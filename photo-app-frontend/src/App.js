
import './App.css';
import Post from './components/Post';
import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import { makeStyles } from '@material-ui/core/styles';  //sign-in modal
import  Modal from '@material-ui/core/Modal';        //sign-in modal
import { Button, Input } from '@material-ui/core';      //sign-in modal
import { auth } from './firebase'  //adding authorization


function getModalStyle() {
  const top=50;
  const left=50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) =>({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
          //for the sign in Modal
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


          // for posts
  const [posts, setPosts] = useState ([
    {
      username: "Joe G" + "  ",
      caption: "This is the text for the caption that I've hard coded.  I'm using the useState hook in React... these posts are objects in an array",
      imageUrl: "https://www.theclickcommunity.com/blog/wp-content/uploads/2018/05/How-to-take-creative-flower-pictures-by-Lucy-Ketchum-17.jpg"
    },
    {
      username: "User two" + " ",
      caption: "Another catchy caption here",
      imageUrl: "https://clicklovegrow.com/wp-content/uploads/2019/06/62018319_10156565426351775_3190533176141283328_o.jpg"
    }
  ])

  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if(authUser) {
        console.log (authUser)
        setUser(authUser)  
      } else{
          setUser(null)
      }
    })
    return () => {
      unsubscribe()
    }},

    [user, username])
    
    const signUp = (e) => {
      e.preventDefault()
      auth.createUserWithEmailAndPassword(email, password)
      .then(authUser => authUser.user.updateProfile ({ displayName: username }))
      .catch(error => alert(error.message))

      setOpen(false)
    }




  return (
    <div className="App">
      
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form class Name = "app_signup">
              <center>
                <img class="app_headerImage" src="logo192.png"
                alt="Header" />
              </center>
                <Input placeholder="User Name"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
                <Input placeholder="Email"
                  type='text'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Input placeholder="Password"
                  type="password"
                  value = {password}
                  onChange = {e => setPassword(e.target.value)}
                />
                <Button type='Submit' onClick={signUp}>Sign Up</Button>
          </form>
          </div>
      </Modal>
      
        <div className="app_header">
          <img className="app_headerImage" src="camera_icon.png" alt="header" />
        </div>

        {user ? <Button onClick={() => auth.signOut()}>Log Out</Button> : <Button onClick={() => setOpen(true)}>Sign Up</Button>}
    
      <Button onClick={() => setOpen(true)}>Sign Up</Button>

        {posts.map(post => (
          <Post username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
        ))}
    </div>


  );
}

export default App;
