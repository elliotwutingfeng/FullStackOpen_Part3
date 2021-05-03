require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
const Person = require('./models/person')

// 3.7 3.8
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// 3.1 3.13
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then((result) => {
    response.json(result)
  }).catch(error => next(error))
})
// 3.2
app.get('/info', (request, response, next) => {
  Person.find({}).then((result) =>
    result.length
  ).then((number_of_persons) => {
    response.send(
      `<div>Phonebook has info for ${number_of_persons} people</div>
      <div>${new Date()}</div>`
    )
  }).catch(error => next(error))
})
// 3.3
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => response.json(person))
    .catch(error => next(error))
})
// 3.4 3.15
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => next(error))
})
// 3.5
app.post('/api/persons', async (request, response) => {
  // 3.6
  const body = request.body
  if (body.name === undefined) {
    return response.status(400).send({ error: 'name is missing' })
  }
  if (body.number === undefined) {
    return response.status(400).send({ error: 'number is missing' })
  }

  const numberAlreadyExists =  await Person.find({}).then((persons) => {
    return persons.find((d) => d.number === body.number) !== undefined
  })
  if(numberAlreadyExists){
    return response.status(400).send({ error: 'number must be unique' })
  }
  else{

    const person = new Person({
      name:body.name,
      number:body.number,
    })
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  }
})

app.put('/api/persons/:id', async (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
