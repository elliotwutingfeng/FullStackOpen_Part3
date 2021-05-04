const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

const personSchema = new mongoose.Schema({
  name: {
    type: String, required: true, unique: true, minlength: 3,
  },
  number: { type: String, required: true, minlength: 8 },
})

// Apply the uniqueValidator plugin to personSchema.
personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const m = returnedObject
    m.id = m._id.toString()
    delete m._id
    delete m.__v
  },
})
module.exports = mongoose.model('Person', personSchema)
