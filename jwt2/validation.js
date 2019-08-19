const Joi = require('@hapi/joi')

const registerSchema = {
    name: Joi.string().min(3).required(),
    email: Joi.string().min(5).required().email(),
    password: Joi.string().min(6).required()
}

const loginSchema = {
    email: Joi.string().min(5).required().email(),
    password: Joi.string().min(6).required()
}

let registerValidation = (obj) => {
    return Joi.validate(obj,registerSchema)
}

let loginValidation = (obj) => {
    return Joi.validate(obj,loginSchema)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation