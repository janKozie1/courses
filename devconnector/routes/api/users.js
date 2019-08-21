const router = require('express').Router()
const { check, validationResult } = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')

const User = require('../../models/User')
//@route   POST api/users
//@desc    Register user
//@access  Public

router.post(
    '/',
    [
        check('name', 'Name is required')
            .not()
            .isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check(
            'password',
            'Please entera password with 6 or more characters'
        ).isLength(6)
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { name, email, password } = req.body

        try {
            let user = await User.findOne({ email })
            if (user) {
                return res.status(400).json({
                    errors: [{ msg: 'User already exists' }]
                })
            }

            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            user = new User({
                name,
                email,
                avatar,
                password: hashedPassword
            })

            await user.save()

            return res.send('User registered')
        } catch (err) {
            console.error(err)
            return res.status(500).json({
                errors: [{ msg: 'Internal server error' }]
            })
        }
    }
)

module.exports = router
