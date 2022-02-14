import axios from 'axios';

const instance = axios.create({
    baseURL: "https://photo-app-backend288.herokuapp.com/"
})

// const instance = axios.create({
//     baseURL: "http://localhost:3000/"
// })

export default instance