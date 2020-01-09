const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('give password pl0x')
	process.exit(1)
}
const password = process.argv[2]

const db_uri = `mongodb+srv://fullstack:${password}@cluster0-arjyx.mongodb.net/phonebook-app?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
	name: String,
	number: { type: String, match: /^\+?[0-9-]+$/ }
})

const Person = mongoose.model('Person', personSchema)

const failureF = error => {
	console.log('something failed: ', error.message)
	mongoose.connection.close()
}

const addPerson = () => {
	const name = process.argv[3]
	const number = process.argv[4]

	const person = new Person({
		name, number
	})

	person.save().then(res => {
		console.log(`added ${person.name} number ${person.number} to phonebook`)
		mongoose.connection.close()
	}).catch(failureF)
}

const listPersons = () => {
	Person
		.find({})
		.then(persons => {
			console.log('phonebook:')
			persons.forEach((person, k, e) => {
				console.log(`${person.name}: ${person.number}`)
			})
			mongoose.connection.close()
		}).catch(failureF)
}

const conn = () => mongoose.connect(db_uri, { useNewUrlParser: true, useUnifiedTopology: true })

if (process.argv.length === 3) {
	conn()
	listPersons()
} else if (process.argv.length === 5) {
	conn()
	addPerson()
} else {
	console.log('unknown action')
}
