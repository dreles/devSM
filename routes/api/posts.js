const express = require('express');
const router = express.Router(); 
import passport from passport; 

// get post model 
const Post = require('../../model/Post'); 



//route: 	localhost/api/post/test
//desc: 	test post request
//access: 	public 
router.get('/test' , (req , res) => res.json({msg: "posts works"}))

//route: 	localhost/api/post
//desc: 	create a post 
//access: 	private 
router.post('/' , passport.authenticate('jwt', {session: false}), (req , res) => {
	postObject = {}; 
	if(req.body.text) postObject.text = req.body.text;
	if(req.body.text) postObject.text = req.body.text;
	if(req.body.text) postObject.text = req.body.text;

})

module.exports = router