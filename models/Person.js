const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const db_uri = process.env.MONGODB_URI

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		unique: true,
		required: true
	},
	number: {
		type: String,
		minlength: 8,
		match: /^\+?[0-9-]+$/,
		required: true
	}
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id
		delete returnedObject._id
		delete returnedObject.__v
	}
})

mongoose.set('useFindAndModify', false)

mongoose.connect(db_uri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		console.log('connected to MongoDB')
	}).catch((error) => {
		console.log('error connecting to MongoDB:', error.message)
	})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
