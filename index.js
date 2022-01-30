const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postReq' ))

morgan.token('postReq', function(req) {
  if(req.method === 'POST')
  return JSON.stringify(req.body)
});



if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =`mongodb+srv://admin-nives:${password}@cluster0.s8cft.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
/*
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
*/
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has ${persons.length} people</p>
              <p>${new Date().toString()}</p>`)
    })

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {res.json(person)}
    else {res.status(404).end()}
    
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
  
    res.status(204).end()
  })

 const getRandomInt =(max) => {
    return Math.floor(Math.random() * max);
  }

app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if (!body.name) {
        return res.status(400).json({error: 'name missing'})
    }
    if (!body.number) {
        return res.status(400).json({error: 'number missing'})
    }

    if (persons.some(n => n.name === body.name)) {
        return res.status(400).json({error: 'name must be unique'})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: getRandomInt(1000)
    }
    persons.concat(person)
    res.json(person)

})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})