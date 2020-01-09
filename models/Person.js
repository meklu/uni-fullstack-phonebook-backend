const mongoose = require('mongoose')

const db_uri = process.env.MONGODB_URI

const personSchema = new mongoose.Schema({
	name: String,
	number: { type: String, match: /^\+?[0-9-]+$/ }
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id
		delete returnedObject._id
		delete returnedObject.__v
	}
})

mongoose.connect(db_uri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		console.log('connected to MongoDB')
	}).catch((error) => {
		console.log('error connecting to MongoDB:', error.message)
	})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
