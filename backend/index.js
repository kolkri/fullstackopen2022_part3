require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())


morgan.token('body', req => {
    return JSON.stringify(req.body)
  })



  app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
      res.json(result)
    })
  })

  app.get('/info', (req, res) => {
    const amount = Person.length
    const currentdate = new Date()
    res.send(`<p>Phonebook has info for ${amount} people</p>
    <p>${currentdate}</p>`)
  
  })

  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
      if (person){
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
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }
    // if(Person.some(person => person.name === body.name)){
    //     return response.status(400).json({ 
    //         error: 'name must be unique' 
    //       })
    // }
  
    const person = new Person ({
      name: body.name,
      number: body.number
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })
  
  const PORT = process.env.PORT 
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
  }
  

  app.use(errorHandler)