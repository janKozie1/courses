const router = require('express').Router()
const User = require('../model/User')

const Joi = require('@hapi/joi')

const schema = {
    name: Joi.string().min(3).required(),
    email: Joi.string().min(5).required().email(),
    password: Joi.string().min(6).required()
}



router.post('/register', async (req, res) => {

    const {error} = Joi.validate(req.body,schema)

    if(error){
        return  res.status(400).send(error.details[0].message)
    }
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    try {
        const savedUser = await user.save();
        res.send(savedUser)
    } catch (err) {
        res.status(400).send(err)
    }
})


router.post('/login')



module.exports = router