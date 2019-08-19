const config = require('config')
const mongoose = require('mongoose')
const usersRoute = require('./routes/users.route')
const express = require('express')
const app = express();

if(!config.get('myprivatekey')){
    console.error('Brak klucza');
    process.exit(1)
}


mongoose
    .connect('mongodb://localhost/nodejsauth',{useNewUrlParser:true})
    .then(()=>console.log('connected'))
    .catch(err=>console.error("couldnt connect"))

    app.use(express.json())

    app.use('/api/users',usersRoute)

    const port = 3000
    app.listen(port,()=>console.log('started'))