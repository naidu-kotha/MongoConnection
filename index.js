const mongoose = require('mongoose')
const express = require('express')
require('dotenv').config();
const StudentDetails = require('./modelStudentDetails')

const app = express()
app.use(express.json())


const url = process.env.PORT

const connection = async () => {
    try {
        await mongoose.connect(url)
        console.log("Connected to MongoDB server")
    } catch(e) {
        console.log(e.message)
    }
}

connection()

// GET
app.get('/students', async(req, res) => {
    try {
        const students = await StudentDetails.find().sort({_id: 1})
        res.json(students)
    } catch(e) {
        console.log(e.message)
        res.status(400)
        res.send({ error: e.message })
    }
})                                                                

// POST
app.post('/addStudent', async(req, res) => {
    const {_id, name, age} = req.body

    try {
        const newData = new StudentDetails({ _id, name, age })
        await newData.save()
        const students = await StudentDetails.find().sort({_id: 1})
        res.json(students)
    } catch (err) {
        console.log(err.message)
        res.status(400)
        res.send({ error: err.message })
    }
})

// PUT
app.put('/updateStudent/:id/', async(req, res) => {
    const {id} = req.params
    const {name, age} = req.body

    try{
        const updatedData = await StudentDetails.findByIdAndUpdate(
            {_id: id},
            {name, age},
            {new: true}
        )
        res.send(updatedData)
    } catch(e) {
        res.status(400)
        res.send({ error: e.message })
    }
})

// DELETE
app.delete('/deleteStudent/:id/', async(req, res) => {
    const {id} = req.params

    try{
        const deletedData = await StudentDetails.findByIdAndDelete(id)
        const message = `Student with id ${id} has been deleted.`
        const updatedData = await StudentDetails.find()
        res.send({ message, updatedData })
    } catch(e) {
        res.status(400)
        res.send({ error: e.message })
    }
})


app.listen(5000, () => {
    console.log("Server started listening on port 5000")
})
