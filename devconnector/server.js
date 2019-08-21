const express = require('express')
const app = express()

const connectDB = require('./config/db')
//ROUTES
const users = require('./routes/api/users')
const auth = require('./routes/api/auth')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const PORT = process.env.PORT || 5000

connectDB()

app.use(express.json({ extended: false }))

app.get('/', (req, res) => {
    res.send('Api running')
})

app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

app.listen(PORT, () => {
    console.log('Started on: ' + PORT)
})
