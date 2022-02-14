import React, { useState } from "react"
import './ImageUpload.css'
import { storage } from "../firebase"
import axios from "../axios"
import { Button, Input } from '@material-ui/core'; 
import { IconButton } from '@mui/material';


// function handleScroll() {
//     window.scroll({
//       top: document.body.offsetHeight,
//       left: 0, 
//       behavior: 'smooth',
//     });
//   }

  // return <button type="button" onClick={handleScroll}>Scroll</button>;

  const handleScroll = () => {
    window.scroll({
        top: document.body.offsetHeight,
        left: 0, 
        behavior: 'smooth',
      });
  }


const ImageUpload = ({ username }) => {
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [caption, setCaption] = useState('')

    const [ url, setUrl] = useState(""); //for Axios
    
    const handleChange = e => {
        if(e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image); //status bar
    uploadTask.on("state_changed",
    (snapshot) => {
        const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(progress);
            },
            (error) => {
                console.log(error);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then((url) => {
                        setUrl(url);
                        axios.post("/upload", {
                            caption: caption,
                            user: username,
                            image: url,
                        })
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    
            
                    });
            },

            
        );
    };

    return (
        <div className="footer">
        <div className="imageUpload">
            <progress className="imageUpload__progress" value={progress} max="100" />
            <input 
                type="text" 
                placeholder="Enter a caption..." 
                className="imageUpload__input"
                value={caption} 
                onChange={e => setCaption(e.target.value)} 
            />
            <div className="container">
            <input className="imageUpload__file" type="file" onChange={handleChange} />
            <button className="imageUpload__button" onClick={handleUpload}>Upload</button>
        </div>
        </div>
        </div>
    )



//     return (
//     <div className="footer">
            
        
//         <div className="imageUpload">
//             <progress className="imageUpload_progress" value={progress} max="100" />
//         </div>

//             <input  type="text"
//                     placeholder="Say something about your photo"
//                     className="imageUpload_input"
//                     value={caption}
//                     onChange={e => setCaption(e.target.value)} />
// <div>
//             <input className="imageUpload_file" 
//                     type="file"
//                     onChange={handleChange} />
                   
//                 <Button 
//                     variant="contained" component="span" className="imageUpload_button"
//                     onClick={handleUpload}
//                     onDone={handleScroll}
//                     >Upload your image
//                 </Button>
//             </div>

{/* <div className="upload-btn-wrapper">
  <button className="btn" onChange={handleChange} >Find a file</button>
  <input type="file" name="myfile" />
</div>

<div className="load-btn-wrapper">
  <button className="btn" onClick={handleUpload} >upload a file</button>
</div> */}

    // </div>
    // )
}




export default ImageUpload