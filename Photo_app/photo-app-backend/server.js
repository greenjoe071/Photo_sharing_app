import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
// import Posts from './postModel.js'
import postModel from './postModel.js'
import Pusher from 'pusher'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const port = process.env.PORT || 9000
const connection_url = process.env.DB_CONN

//PUSHER
const pusher = new Pusher({
    appId: process.env.PUSHER_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: "us2",
    useTLS: true
});


//Database
mongoose.connect(connection_url, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
})

app.use(express.json());
app.use(cors());




// PUSHER - to make mongodb real-time
// mongoose.connection.once('open', () => {
//     console.log("DATABASE IS CONNECTED!!!!")
//     const changeStream = mongoose.connection.collection('posts').watch()
//     changeStream.on('change', change => {
//         console.log(change)
//         if(change.operationType === "insert") {
//             console.log("PUSHER is pushing")
//             pusher.trigger("posts", "inserted", {
//                 change: change
//             }).catch(err => console.log(err));
//         } else {
//             console.log("ERROR: not triggering Pusher")
//         }
//     })
// })

mongoose.connection.once('open', () => {
    console.log("DATABASE IS CONNECTED!!!!")
    const changeStream = mongoose.connection.collection('posts').watch()
    changeStream.on('change', (change) => {
        console.log(change)
        if(change.operationType === "insert") {
            console.log("PUSHER is pushing")

            const postDetails = change.fullDocument; 

            pusher.trigger("posts", "inserted", {
                user: postDetails.user,
                caption: postDetails.caption,
                image: postDetails.image
            });
        } else {
            console.log("ERROR: not triggering Pusher")
        }
    });
});


//API Endpoints
app.get("/", (req, res) => res.status(200).send("If you see this, it's connected"))

app.post ("/upload", (req, res) => {
    const dbPost = req.body
    postModel.create(dbPost, (err, data) => {
        if(err)
            res.status(500).send(err)
        else
            res.status(201).send(data)
    })
})

app.get("/sync", (req, res) => {
    postModel.find((err, data) => {
        if(err) {
            res.status(500).send(err) }
        else {
            res.status(200).send(data)
        }
        
    })
})

//Listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`))


