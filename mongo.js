// 3.12
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>',
  )
  process.exit(1)
}

// Connect to phonebook server
const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.24zl2.mongodb.net/phonebook?retryWrites=true`
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  // Add new entry to phonebook
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name,
    number,
  })
  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
} else if (process.argv.length === 3) {
  // Display all of the entries in the phonebook
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  mongoose.connection.close()
}
