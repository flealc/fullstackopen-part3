const express = require('express')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

const morgan = require('morgan')

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(404).send({error: 'malformatted id'})
    }

    next(error)
}

app.use(express.json())
app.use(morgan(function (tokens, req, res) {
    
    if (req.method === 'POST') {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            JSON.stringify(req.body),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
          ].join(' ')
    }
    
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
}))
app.use(express.static('build'))


app.get('/', (request, response) => {
    response.send('<h1>Ring Ring</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/info', (request, response) => {
    const size = persons.length 
    const date = new Date().toString()
    response.send(`
        <p>Phonebook has info for ${size} people</p>
        <p>${date}</p>
        `)
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id) 
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
    
})

app.post('/api/persons', (request, response) => {
    const body = request.body 
    
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number is missing"
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })


})

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})