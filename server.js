import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import users from './routes/api/users.js'
import profiles from './routes/api/profiles.js'
import posts from './routes/api/posts.js'


const app = express(); 

// DB Config
const db = require('./config/keys.js').mongoURI; 
//Connect to DB
mongoose.connect(db).then(() => {console.log("connected to MONGODB")}).catch(err => console.log(err))
//use routes

app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())  

app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/posts', posts); 

app.get('/', (req,res) => {
	res.send('Hello Boy')
}); 

const port = process.env.PORT || 5000;

app.listen(port, () => {console.log(`Server running on port: ${port}`)})