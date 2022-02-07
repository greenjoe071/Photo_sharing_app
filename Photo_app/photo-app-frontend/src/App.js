
import './App.css';
import Post from './components/Post';
import React, { useEffect, useState } from 'react';
// import Login from './components/Login'; //part of an attempt for google auth
import { makeStyles } from '@material-ui/core/styles';  //sign-in modal
import  Modal from '@material-ui/core/Modal';        //sign-in modal
import { Button, Input } from '@material-ui/core';      //sign-in modal
import  { auth }  from './firebase'  //adding authorization
import ImageUpload from './components/ImageUpload';
import axios from './axios';
import Pusher from 'pusher-js';


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
    width: 300,
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

  
      
      // hard coded posts - posts are objects in an array
  const [posts, setPosts] = useState ([
    {
      username: "Joe G ",
      caption: "Welcome to The Photo Sharing App",
      imageUrl: "https://www.theclickcommunity.com/blog/wp-content/uploads/2018/05/How-to-take-creative-flower-pictures-by-Lucy-Ketchum-17.jpg"
    },
    {
      username: "User two ",
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

    [user, username]);

     // trying to Axios to handle my HTTP Requests
    const fetchPosts = async () => 
     await axios.get("/sync").then((response) => {
       console.log(response);
       setPosts(response.data);
     });


useEffect(() =>{
  const pusher = new Pusher ('cfd4921e7187e348e2fb', {
    cluster: "us2"
  });

  const channel = pusher.subscribe('posts');
  channel.bind('inserted', (data) => {
    console.log("data received", data);
    fetchPosts();
  });
}, []);

  useEffect(() => {
    fetchPosts();
  }, []);
  //Trying to get PUSHER to work on my frontend  
  // useEffect(() => {
  //     const channel = pusher.subscribe('posts');
  //     channel.bind('inserted', (data) => {
  //       alert(JSON.stringify(data))
  //     });
  //      }, [] ) 

      //  useEffect(() => {fetchPosts()
       
      //    }, [] ) 
          
  

    // SIGN UP
    const signUp = (e) => {
      e.preventDefault()
      auth.createUserWithEmailAndPassword(email, password)
      .then(authUser => authUser.user.updateProfile ({ displayName: username }))
      .catch(error => alert(error.message))

      setOpen(false)
    }

    // SIGN IN
    const [openSignIn, setOpenSignIn] = useState(false)
    const signIn = e => {
      e.preventDefault()
      auth.signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message))
      setOpenSignIn(false)
}

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center><form class Name = "app_signup">
              
                <img className="app_headerImage" src="logo192.png"
                alt="Header" /><br></br>
              
                <Input placeholder="Username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                /><br></br>
                <Input placeholder="Email"
                  type='text'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                /><br></br>
                <Input placeholder="Password"
                  type="password"
                  value = {password}
                  onChange = {e => setPassword(e.target.value)}
                /> <br></br>
                <Button type='submit' onClick={signUp}>Sign Up</Button>
          </form></center>
          </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app_signup'>
            <center>
              <img className='app_headerImage' src="logo192.png" alt="Header" />
            </center>
            <Input placeholder='Email'
              type='text'
              value={email}
              onChange={e => setEmail(e.target.value)} />
            <Input placeholder='password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)} />
            <Button type='Submit' onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

        <div className="app_header">
          <img className="app_headerImage" src="camera-logos.png" alt="header" />
        {user ? <Button onClick={() => auth.signOut()}>Log Out</Button> :( 
          <div className='app_loginContainer'>

            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
         </div>  )}
      
        </div>

      <div className='app_posts'>
        {posts.map(post => (
          <Post 
          user={user}
          key={post._id}
          username={post.user + " "} 
          caption={post.caption} 
          imageUrl={post.image} />
        ))}
      </div>
      {user?.displayName ? <ImageUpload username={user.displayName} /> :
      <h3 className='app_notLogin'>Login Needed To Upload</h3>}
    </div>


  );
} 



export default App;
