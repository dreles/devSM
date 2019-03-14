const express = require('express');
const router = express.Router(); 
import passport from 'passport'; 

// get post model 
const Post = require('../../model/Post'); 

//get user model 
const User = require('../../model/User'); 

//route: 	localhost/api/post/test
//desc: 	test post request
//access: 	public 
router.get('/test' , (req , res) => res.json({msg: "posts works"}))

//route: 	localhost/api/post
//desc: 	create a post 
//access: 	private 
router.post('/' , passport.authenticate('jwt', {session: false}), (req , res) => {
	const postObject = {
		user: req.user.id,
		avatar: req.body.avatar,
		name: req.body.name
	}; 
	if(req.body.text) postObject.text = req.body.text;

	new Post(postObject).save().then(post => res.json(post)).catch(err => res.status(400).json(err))

})

//route: 	localhost/api/post
//desc: 	create a post 
//access: 	private 
router.get('/', (req, res) => {
	Post.find().sort({date: -1}).then((posts) => res.json(posts)).catch(err => res.status(404).json(err)); 
})


//route: 	localhost/api/post
//desc: 	create a post 
//access: 	private 
router.get('/:id', (req, res) => {
	Post.findById(req.params.id).then((post) => res.json(post)).catch(err => res.status(404).json(err)); 
})

//route: 	localhost/api/post
//desc: 	create a post 
//access: 	private 
router.delete('/:id', passport.authenticate('jwt', {session: false}),(req, res) => {
	Post.findById(req.params.id).then((post)=>{
		if(post.user.toString() !== req.user.id){
			res.status(401).json({notauthorized: 'user not authorized'})
		}
		post.remove().then(res.json({status: 'success'}))
	})
})

module.exports = router