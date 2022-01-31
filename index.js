require('dotenv').config()
const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const Person = require('./models/person')


app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postReq' ))

morgan.token('postReq', function(req) {
  if(req.method === 'POST')
  return JSON.stringify(req.body)
});

/*
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
*/
app.get('/api/persons', (req, res) => {
    Person.find({}).then(perso => {
      res.json(perso)
    })
})

app.get('/info', (req, res) => {
  Person.find({})
  .then((persons) => {
    res.send(`<p>Phonebook has ${persons.length} people</p>
              <p>${new Date().toString()}</p>`)
  })
    
    })

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
    .then(perso => {
      if (perso) {
        res.json(perso)
      } else {
        res.status(404).end()
      }
    })
    /*
    .catch(error => {
      console.log(error);
      res.status(400).send({error: 'malformated id'})
    })  
    */
   .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
  })


app.post('/api/persons', (req, res, next) => {
    const body = req.body
    var name = 'name'
    const nameValue = body.name
    var query = {};
    query[name] = nameValue;
    
    if (!body.name) {
        return res.status(400).json({error: 'name missing'})
    }
    if (!body.number) {
        return res.status(400).json({error: 'number missing'})
    }

    if(Person.find(query)) {
      return res.status(400).json({error: 'name must be unique'})
    }
    
    const person = new Person ({
        name: body.name,
        number: body.number,
    })
    person.save()
    .then(savedperson => {
      res.json(savedperson.toJSON())
    })
    .catch((error) => next(error))

})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const id = req.params.id
  const update = { number: body.number };

  Person.findByIdAndUpdate(id, update, {new: true})
  .then((updatedPerson) => {
    res.json(updatedPerson.toJSON())
  })
  .catch((error) => next(error))

})


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// handle requests with unknown endpoint
app.use(unknownEndpoint)

// Error handling middleware
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.message.includes('ObjectId')) {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})