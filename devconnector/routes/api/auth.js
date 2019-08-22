const router = require('express').Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../../models/User')
//@route   GET api/auth
//@desc    Get user data
//@access  Public

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        return res.json(user)
    } catch (err) {
        console.error(err)
        res.status(500).send([{ msg: 'Internal server error' }])
    }
})

//@route  POST api/auth
//@desc   Login user
//@access Public

router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body

        try {
            let user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({
                    errors: [{ msg: 'Wrong email/password' }]
                })
            }

            const isValid = await bcrypt.compare(password, user.password)
            if (!isValid) {
                return res.status(400).json({
                    errors: [{ msg: 'Wrong email/password' }]
                })
            }

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) {
                        throw err
                    }
                    return res.json({ token })
                }
            )
        } catch (err) {
            console.error(err)
            return res.status(500).json({
                errors: [{ msg: 'Internal server error' }]
            })
        }
    }
)

module.exports = router
