const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authRouter = require('./routes/auth')
//to db
dotenv.config();

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log('connected to db')
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use('/api/user', authRouter)

app.listen(3000, () => console.log('Start on 3000'))
