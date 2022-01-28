const http = require('http')
const express = require('express')

const app = express()
app.use(express.json())

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

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

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
    

    const person = {
        name: body.name,
        number: body.number,
        id: getRandomInt(1000)
    }
    persons.concat(person)
    res.json(person)

})

const PORT = 3003
app.listen(PORT)
console.log(`Server running on port ${PORT}`)