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

app.get('/api/persons', (req, res, next) => {
	Person.find({}).then(data => {
		res.json(data.map(p => p.toJSON()))
	}).catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
	const id = req.params.id
	Person.findById(id).then(person => {
		if (person) {
			res.json(person)
		} else {
			res.status(404).end()
		}
	}).catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
	const id = req.params.id
	Person.findByIdAndDelete(id).then((data) => {
		res.status(204).end()
	}).catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
	const { name, number } = req.body

	const newP = Person({
		name, number
	})

	newP.save().then((data) => {
		res.json(newP.toJSON())
	}).catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
	const id = req.params.id
	const { number } = req.body
	Person.findByIdAndUpdate(id, { number }, { new: true, runValidators: true }).then((person) => {
		res.json(person.toJSON())
	}).catch(err => next(err))
})

app.get('/info', (req, res) => {
	(async () => {
		res.append('Content-type', 'text/plain; charset=utf-8')
		let msg = ''
		msg += `Phonebook has info for ${await Person.estimatedDocumentCount()} people`
		msg += `\n\n${new Date()}`
		res.send(msg)
	})()
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
	const mongooseError = require('mongoose').Error
	console.error(err.message)

	if (err instanceof mongooseError) {
		if (err.name === 'CastError' && err.kind === 'ObjectId') {
			return res.status(400).json({ error: 'malformed id' })
		}
		if (err.name === 'ValidationError') {
			return res.status(400).json({ error: err.message })
		}

		return res.status(500).json({ error: `unhandled database error: ${err.message}` })
	}

	next(err)
}

app.use(errorHandler)

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`)
})
