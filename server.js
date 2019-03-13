import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import users from './routes/api/users.js'
import profiles from './routes/api/profiles.js'
import posts from './routes/api/posts.js'
import passport from 'passport'


const app = express(); 

// DB Config
const db = require('./config/keys.js').mongoURI; 
//Connect to DB
mongoose.connect(db).then(() => {console.log("connected to MONGODB")}).catch(err => console.log(err))

//express middleware // 
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())  
app.use(passport.initialize()); 

//passport strategy //
require('./config/passport')(passport); 

//user routes 	// 
app.use('/api/user', users);
app.use('/api/profile', profiles);
app.use('/api/post', posts); 

app.get('/', (req,res) => {
	res.send('Hello Boy')
}); 

const port = process.env.PORT || 5000;

app.listen(port, () => {console.log(`Server running on port: ${port}`)})