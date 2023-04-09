require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

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


app.use(express.json())
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

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})