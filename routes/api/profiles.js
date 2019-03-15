const express = require('express');
const router = express.Router(); 
const mongoose = require('mongoose');
const passport = require('passport'); 


//load profile model 

const Profile = require('../../model/Profile');

//load User model 

const User = require('../../model/User'); 

//@route: 	localhost/api/profile/test
//@desc:  	Test the user api request 
//@access: 	public

router.get('/test' , (req , res) => res.json({msg: "profile works"}))

//@route: 	localhost/api/profile
//@desc:  	get request to user profile 
//@access: 	public

router.get('/', passport.authenticate('jwt', {session: false}), (req , res) => {
	const errors = {}
	Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']).then((profile) => {
		if(!profile){
			errors.profile = 'user profile not found'; 
			res.status(404).json(errors); 
		}
		res.send(profile)
	}).catch(err => {
		res.status(404).json(err); 
	})
})

//@route: 	localhost/api/profile
//@desc:  	post request to user profile 
//@access: 	private

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
	const errors = {}
	const profileFields = {}
	profileFields.user = req.user.id;
	if(req.body.handle) profileFields.handle = req.body.handle;
	if(req.body.company) profileFields.company = req.body.company;
	if(req.body.website) profileFields.website = req.body.website;
	if(req.body.location) profileFields.location = req.body.location;
	if(req.body.status) profileFields.status = req.body.status;
	//split skills into array before saving into db 
	if(req.body.skills !== undefined) profileFields.skills = req.body.skills.split(',');
	if(req.body.bio) profileFields.bio = req.body.bio;

	///find user 
	User.findOne({user: req.user.id}).then((user) => {
		if(user){
			Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true}).then((profile) => {
				res.json(profile)
			}).catch(err => {
				res.status(404).json(err)
			})
		}else{
			Profile.findOne({handle: req.body.handle}).then( handle => {
				if(handle){
					errors.handle = 'handle already exists'
					res.status(400).json(errors)
				}else{
					new Profile(profileFields).save().then(profile => res.json(profile)).catch(err => res.status(400).json(err)) 
				}
			}).catch(err => res.status(404).json(err))
		}
	}).catch((err) => {
		res.status(404).json(err)
	})
})

//@route: 	localhost/api/profile/handle/:handle
//@desc:  	get user with handle parameter
//@access: 	public

router.get('/handle/:handle', (req, res) => {
	const errors = {}
	Profile.findOne({handle: req.params.handle}).populate('user', ['name', 'avatar']).then(profile => {
		if(!profile){
			errors.noprofile = 'no profile with this handle'
			res.status(400).json(errors)
		}else{
			res.json(profile)
		}
	}).catch(err => res.status(404).json(err))
}); 


//@route: 	localhost/api/profile/id/:id
//@desc:  	get user with handle parameter
//@access: 	public

router.get('/id/:id', (req, res) => {
	const errors = {}
	Profile.findOne({_id: req.params.id}).populate('user', ['name', 'avatar']).then(profile => {
		if(!profile){
			errors.noprofile = 'no profile with this id'
			res.status(400).json(errors)
		}else{
			res.json(profile)
		}
	}).catch(err => res.status(404).json(err))
}); 

//@route: 	localhost/api/profile/all
//@desc: 	get all profiles
//@access: 	public

router.get('/all', (req,res) => {
	const errors = {}
	Profile.find().then((posts) => {
		if(!posts){
			errors.noprofiles = 'no profiles found';
			res.status(400).json(errors)
		}
		res.send(posts)
	}).catch(err => res.status(404).json(err))
})

//@route: 	localhost/api/profile/experience
//@desc: 	add experience
//@access: 	private

router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {
	let errors = {}; 
	const experience = {}; 
	if(req.body.company) experience.company = req.body.company;
	if(req.body.title) experience.title = req.body.title;
	if(req.body.description) experience.description = req.body.description;
	Profile.findOne({user: req.user.id}).then(profile => {
		if(!profile){
			errors.noprofile = 'no profile found'
			res.status(404).json(errors);
		}
		profile.experience = experience; 
		profile.save().then(profile => res.send(profile)); 

	})
})

//@route: 	localhost/api/profile/experience/:exp_id
//@desc: 	remove experience
//@access: 	private

router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req, res) => {
	
		Profile.findOne({user: req.user.id}).then((profile) => {
			const deleteIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

			profile.experience.splice(deleteIndex, 1);

			profile.save().then(profile => res.json(profile))


		})

	})

//@route: 	localhost/api/profile/
//@desc: 	remove profile and user
//@access: 	private

router.delete('/', passport.authenticate('jwt', {session: false}), (req, res) => {
	
		Profile.findOneAndRemove({user: req.user.id}).then(() => {
			User.findOneAndRemove({_id: req.user.id}).then(() => {
				res.json({success: true})
			})
		})

	})

module.exports = router
