import express from 'express'
import mongoose from 'mongoose'
import Cors from 'cors'
import Posts from './postModel.js'

const app = express()
const port = process.env.PORT || 9000
const connection_url = 'mongodb+srv://admin:dWPE6yFuPB8m8NSb@cluster0.6g5pz.mongodb.net/photo-app-backend?retryWrites=true&w=majority'


//Database
mongoose.connect(connection_url, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
})

app.use(express.json())
app.use(Cors())


//API Endpoints
app.get("/", (req, res) => res.status(200).send("If you see this, it's connected"))

app.post ('/upload', (req, res) => {
    const dbPost = req.body
    Posts.create(dbPost, (err, data) => {
        if(err)
            res.status(500).send(err)
        else
            res.status(201).send(data)
    })
})

app.get('/sync', (req, res) => {
    Posts.find((err, data) => {
        if(err) {
            res.status(500).send(err) }
        else {
            res.status(200).send(data)
        }
        
    })
})

//Listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`))


