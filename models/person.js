const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      required: true,
      unique: [true, 'already exists']
    },
    number: {
      type: String,
      minlength: 3,
      validate: {
        validator: function(v) {
          return /^\d{2,3}-\d/.test(v)
        },
        message: "is not valid number"
      },
      required: true
    }
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

personSchema.post('save', function(error,doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('name must be unique'));
  } else {
    next();
  }
});

personSchema.post('update', function(error, res, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(); // The `update()` call will still error out.
  }
});

module.exports = mongoose.model('Person', personSchema)