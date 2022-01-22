import React from "react";
import './Post.css'
import { Avatar } from '@material-ui/core'

const Post = ({ username, caption, imageUrl }) => {
    return(
        <div className="post">
            <div className="post_header">
                <Avatar
                    className="post_avatar"
                    alt={username}
                    scr="/static/images/avatar/1.jpg" />
                <h3> {username} </h3>     
            </div>
           
            <img className="post_image" src={imageUrl}  alt="React" />
            <h4 className="post_text"> <strong>{username}</strong>{caption} </h4>
            
        </div>
    )
    
}

export default Post