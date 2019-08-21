const router = require('express').Router()
const verify = require('./verifyToken')

router.get('/',verify, (req,res)=>{
    res.send(req.user)
    res.json({posts:[{title:'My first owo',desc:'Hahaha xd '}]})
})

module.exports = router;