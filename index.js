require('dotenv').config()

const PORT = process.env.PORT || 3001

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/Person')

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = []

app.get('/api/persons', (req, res) => {
	Person.find({}).then(data => {
		res.json(data.map(p => p.toJSON()))
	})
})

app.get('/api/persons/:id', (req, res) => {
	const id = req.params.id
	Person.findById(id).then(person => {
		res.json(person)
	}).catch(err => {
		res.status(404).end()
	})
})

app.delete('/api/persons/:id', (req, res) => {
	const id = req.params.id
	Person.findByIdAndDelete(id).then((data) => {
		res.status(204).end()
	}).catch((err) => {
		console.log(`couldn't delete person with id ${id}`, err.message)
		res.status(204).end()
	})
})

app.post('/api/persons', (req, res) => {
	const { name, number } = req.body
	let error = []

	if (typeof name === undefined || name === '') {
		error = error.concat('name must be provided')
	}

	if (typeof number === undefined || number === '') {
		error = error.concat('number must be provided')
	} else if (!/^\+?[0-9]+/.test(number)) {
		error = error.concat('number is invalid')
	}

	const newP = Person({
		name, number
	})

	Person.exists({name}).then((extant) => {
		if (extant) {
			error = error.concat('name must be unique')
		}

		console.log(error)
		if (error.length > 0) {
			res.status(400)
				.json({error: error.join('\n')})
				.end()
			return
		}

		newP.save().then((data) => {
			res.json(newP.toJSON())
		}).catch((err) => {
			console.log(`failed to save person ${name}`, err.message)
			res.status(500)
				.json({error: `database error while saving person:\n\t${err.message}`})
				.end()
		})
	}).catch((err) => {
		console.log(`failure while checking existence`, err.message)
		res.status(500)
			.json({error: `database error while checking existence:\n\t${err.message}`})
			.end()
	})
})

app.get('/info', (req, res) => {
	res.append('Content-type', 'text/plain; charset=utf-8')
	let msg = ''
	msg += `Phonebook has info for ${persons.length} people`
	msg += `\n\n${new Date()}`
	res.send(msg)
})

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`)
})
