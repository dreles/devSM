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
//desc: 	delete a post 
//access: 	private 
router.delete('/:id', passport.authenticate('jwt', {session: false}),(req, res) => {
	Post.findById(req.params.id).then((post)=>{
		if(post.user.toString() !== req.user.id){
			res.status(401).json({notauthorized: 'user not authorized'})
		}
		post.remove().then(res.json({status: 'success'}))
	})
})

router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
	const userId = req.user.id
	let isUnlike = false 
	let isFirstLike = false 

	Post.findById(req.params.id).then((post) => {

		if(post.likes.length === 0 ){
			post.likes.push({user: userId}); 
			isFirstLike = true
		}
		
		for(let i = 0; i < post.likes.length ; i++){
			if(isFirstLike){
				break
			}
			if(post.likes[i].user.toString() === userId){
				post.likes.splice(i, 1); 
				isUnlike = true 
			}else{
				if(isUnlike === false && i === post.likes.length - 1){
					post.likes.push({user: userId}) 
				}
			}
		}

	post.save().then(res.json(post))
	})
})

router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
	Post.findById(req.params.id).then(post => {

		const comments = {
			user: req.user.id,
			text: req.body.text,
			name: req.body.name,
			avatar: req.body.avatar
		}
		
		post.comments.unshift(comments)
		post.save().then(res.json(post))
	})
})

router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {
	Post.findById(req.params.id).then(post => {
		
		for(let i = 0; i < post.comments.length ; i++){
			
			if(post.comments[i]._id == req.params.comment_id){
				console.log('we made it')
				post.comments.splice(i, 1); 
			}
		}

		post.save().then(res.json(post))
	})
})



module.exports = router