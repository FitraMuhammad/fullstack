const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
require('dotenv').config

const app = express()



morgan.token('post', (request) => {
  if(request.method === 'POST'){
    return JSON.stringify(request.body)
  }else{
    return null
  }
})


app.use(express.static('build'))

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] :req[header] :response-time ms :post'))

const errorHandler = (error, request, response, next) => {
  console.log(error)

  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.post('/api/persons', (request,response, next) => {
  const body = request.body

  if(!body.name || !body.number){
    return response.status(400).json({
      error: 'The name or number is missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.get('/', (request,response) => {
  response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request,response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/info', (request,response) => {
  Person.find({}).then(person => {
    response.send(
      `<p>Phonebook has info for ${person.length} people</p>
             <br />
             <p>${new Date()}</p>`
    )
  })
})

app.get('/api/persons/:id', (request,response, next) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request,response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})



app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})