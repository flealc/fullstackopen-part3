const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argumant')
    process.exit(1)
}

const password = process.argv[2]

const url = 
`mongodb+srv://hissesstealer05:${password}@part3.z82tc8a.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)



const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const arguments = process.argv 

if (arguments.length<5) {
    Person
    .find({})
    .then( result => {
        result.forEach(person => {
            console.log(person) 
        })
        mongoose.connection.close()     
    })
    
} else {
    const person = new Person({
        name: arguments[3],
        number: arguments[4]
    })
    
    person.save().then(result => {
        console.log(`added ${arguments[3]} number ${arguments[4]} to phonebook`)
        mongoose.connection.close()
    })
}

