const router = require('express').Router()
const auth = require('../../middleware/auth')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')

const Profile = require('../../models/Profile')
const User = require('../../models/User')

//@route   GET api/profile/me
//@desc    Get current user's profile
//@access  Private

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            'user',
            ['name', 'avatar']
        )

        if (!profile) {
            return res
                .status(400)
                .json([{ err: 'There is no profile for this user' }])
        }
        return res.json(profile)
    } catch (err) {
        return res.status(500).send([{ msg: 'Internal server error' }])
    }
})

//@route   POST api/profile
//@desc    Create or update user profile
//@access  Private

router.post(
    '/',
    [
        auth,
        [
            check('status', 'Status is required')
                .not()
                .isEmpty(),
            check('skills', 'Skills are required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const {
                company,
                website,
                location,
                bio,
                status,
                githubusername,
                skills,
                youtube,
                facebook,
                twitter,
                instagram,
                linkedin
            } = req.body

            const profileFields = {
                status,
                user: req.user.id,
                skills: skills.split(',').map(e => e.trim()),
                company,
                website,
                location,
                bio,
                status,
                githubusername,
                skills,
                social: {
                    youtube,
                    facebook,
                    twitter,
                    instagram,
                    linkedin
                }
            }

            try {
                let profile = await Profile.findOne({ user: req.user.id })
                if (profile) {
                    profile = await Profile.findOneAndUpdate(
                        { user: req.user.id },
                        { $set: profileFields },
                        { new: true }
                    )
                    return res.json(profile)
                }

                profile = new Profile(profileFields)
                await profile.save()
                return res.send(profile)
            } catch (err) {
                res.status(500).send('Internal server error')
            }
        } catch (err) {}
    }
)

//@route   POST api/profile/all
//@desc    Get all user profiles
//@access  Public

router.get('/all', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', [
            'name',
            'avatar'
        ])
        res.json(profiles)
    } catch (err) {
        console.error(err.msg)
        res.status(500).json([{ err: 'Internal server error' }])
    }
})

//@route   POST api/profile/user/:user_id
//@desc    Get user profile by id
//@access  Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar'])
        if (!profile) {
            return res.status(404).json([{ msg: 'Profile not found' }])
        }
        res.json(profile)
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json([{ msg: 'Profile not found' }])
        }
        return res.status(500).json([{ err: 'Internal server error' }])
    }
})

//@route   DELETE api/profile/
//@desc    Delete, user & posts
//@access  Private

router.delete('/', auth, async (req, res) => {
    console.log(req.user.id)
    try {
        await Profile.findOneAndRemove({
            user: req.user.id
        })
        await User.findOneAndRemove({
            _id: req.user.id
        })
        return res.json({ msg: 'User removed' })
    } catch (err) {
        console.log(err)
        return res.status(500).json([{ err: 'Internal server error' }])
    }
})

//@route   DELETE api/profile/experiance
//@desc    Add profile experiance
//@access  Private

router.put(
    '/experiance',
    [
        auth,
        [
            check('title', 'Title is required')
                .not()
                .isEmpty(),
            check('company', 'Company is required')
                .not()
                .isEmpty(),
            check('from', 'From date is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        let errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }

        const newExp = (({
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }) => {
            title, company, location, from, to, current, description
        })(req.body)
        
        try {
        } catch (err) {
            return res.status(500).json([{ err: 'Internal server error' }])
        }
    }
)

module.exports = router
