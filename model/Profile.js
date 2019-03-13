import mongoose from 'mongoose'; 
const Schema = mongoose.Schema 

const ProfileSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	handle: {
		type: String,
		required: true,
		max: 40
	},
	company: {
		type: String
	},
	website: {
		type: String
	},
	location: {
		type: String 
	},
	status: {
		type: String,
		required: true 
	},
	skills: {
		type: [String],
		required: true 
	},
	bio: {
		type: String 
	},
	experience: [{
		company: {
			type: String
		},
		title: {
			type: String,
			required: true 
		},
		description: {
			type: String 
		}

	}]
})


module.exports = mongoose.model('profiles', ProfileSchema); 