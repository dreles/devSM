import mongoose from 'mongoose';

Schema = mongoose.Schema;

postSchema = new Schema({
	user: {
		type: Schema.types.ObjectId,
		ref: 'users'
	},
	text: {
		type: String,
		required: true
	},
	name: {
		type: String
	},
	avatar: {
		type: String
	},
	likes: [{
		user: {
			type: Schema.types.ObjectId,
			ref: 'users'
		}
	}],
	comments: [{
		users: {
			type: Schema.types.ObjectId,
			ref: 'users'
		},
		text: {
			type: String,
			required: true
		},
		name: {
			type: String
		},
		avatar: {
			type: String
		},
		date: {
			type: Date,
			default: Data.now
		}
	}],
	data: {
		type: Date,
		default: Data.now
	}

}) 

module.exports = mongoose.model('posts', postSchema); 