const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users.js');
const profiles = require('./routes/api/profiles.js');
const posts = require('./routes/api/posts.js');


const app = express(); 

// DB Config
const db = require('./config/keys.js').mongoURI; 
//Connect to DB
mongoose.connect(db).then(() => {console.log("connected to MONGODB")}).catch(err => console.log(err))
//use routes
app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/posts', posts); 

app.get('/', (req,res) => {
	res.send('Hello Boy')
}); 

const port = process.env.PORT || 5000;

app.listen(port, () => {console.log(`Server running on port: ${port}`)})