const PORT = 3001

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

let persons = [
	{
		"name": "Arto Hellas",
		"number": "040-123456",
		"id": 1
	},
	{
		"name": "Ada Lovelace",
		"number": "39-44-5323523",
		"id": 2
	},
	{
		"name": "Dan Abramov",
		"number": "12-43-234345",
		"id": 3
	},
	{
		"name": "Mary Poppendieck",
		"number": "39-23-6423122",
		"id": 4
	}
]

app.use(bodyParser.json())
app.use(morgan('tiny'))

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(p => p.id === id)
	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(p => p.id !== id)
	res.status(204).end()
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

	const id = Math.floor(Math.random() * 2000000000)
	const newP = {
		name, number, id
	}

	if (persons.find(p => p.name === newP.name)) {
		error = error.concat('name must be unique')
	}

	console.log(error)
	if (error.length > 0) {
		res.status(400)
			.json({error: error.join('\n')})
			.end()
		return
	}

	if (persons.find(p => p.id === newP.id)) {
		res.status(500)
			.json({error: 'generated id matches existing entry'})
			.end()
		return
	}

	persons = persons.concat(newP)

	res.json(newP)
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
