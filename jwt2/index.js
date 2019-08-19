const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')

//to db
dotenv.config();

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log('connected to db')
})

const authRouter = require('./routes/auth')


app.use('/api/user', authRouter)

app.listen(3000, () => console.log('Start on 3000'))
