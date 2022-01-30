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
  const name = process.argv[3]
  const number = process.argv[4]
  
  const url =`mongodb+srv://admin-nives:${password}@cluster0.s8cft.mongodb.net/phonebook?retryWrites=true&w=majority`
  mongoose.connect(url) 

  const personSchema = new mongoose.Schema({
      name: String,
      number: String
  })

  const Person = mongoose.model('Person', personSchema)

  const person = new Person({
      name: name,
      number: number
  })

 

  if (name == null) {
    Person.find({}).then(result => {
        result.forEach(note =>{
            console.log(note);
        })
        mongoose.connection.close()
    })

  }else{
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close()
    })

  }
  
 