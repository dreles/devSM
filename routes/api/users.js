const express = require('express');
const router = express.Router(); 
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');   
import jwt from 'jsonwebtoken'; 
import  passport from 'passport'; 
import key from '../../config/keys';
import validator from 'validator'; 
// Load user model  

const User = require('../../model/User')


//@route: 	localhost/api/user/test
//@desc:  	Test the user api request 
//@access: 	public

router.get('/test' , (req , res) => res.json({msg: "user works"}))

//@route: 	localhost/api/users/register
//@desc:  	Regsiter new user 
//@access: 	public

router.post('/register' , (req, res) => {
	User.findOne({email: req.body.email})
	.then((user) => {
		if(user){
			res.status(400).json({email: "email already exists"})
		}else{

			const avatar = gravatar.url(req.body.email, {
				s: '200', 	//size
				r: 'pg',  	//rating
				d: 'mm'		//defaule
			})
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				avatar,
				password: req.body.password
			}); 

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) =>{
					if(err) throw err 
					newUser.password = hash;
					newUser.save()
					.then(() => res.json(user))
					.catch(err => console.log(err)); 
				})
			})
		}
	}).catch(err => {
		res.status(404).json(err)
	})
})


//@route: 	localhost/api/user/login
//@desc:  	log in user / get web token  
//@access: 	public

router.post('/login', (req , res) => {
	
	const email = req.body.email
	const password = req.body.password

	User.findOne({email}).then((user) => {
		if(!user){
			res.status(404).json({email: 'User not found'})
		}
		bcrypt.compare(password, user.password).then((isMatch) => {
			if(isMatch){
				const payload = {id: user.id, name: user.name, avatar: user.avatar}
				jwt.sign(payload, key.secretOrKey, {expiresIn: 3600}, (err , token) => {
					res.send(
						res.json({
						success: true,
						token: 'Bearer ' + token
					}))
					
				})
			}else{
				res.status(400).json({msg: 'password incorrect'})
			}
		}) 
	})
})

//@route: 	localhost/api/users/current
//@desc:  	current user 
//@access: 	private
router.get('/current', passport.authenticate('jwt', {session: false}), (req , res) => {
	res.json(req.user)
} ) 

module.exports = router




