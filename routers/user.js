const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const User = require('../models/user')

router.get('/', auth, async (req, res) => {
    try {
        await req.admin.populate('users')
        res.send(req.admin.users)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/sign-up', auth, async (req, res) => {
    const user = new User({
        ...req.body,
        admin: req.admin._id
    })

    try {
        const userExists = await User.findOne({ email: user.email, admin: user.admin })

        if(userExists) {
            return res.status(409).send()
        }
        await user.save()
        res.send()
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findOne({_id, admin: req.admin._id})

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(400).send()
    }
})

router.patch('/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'status']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates! '})
    }

    try {
        const user = await User.findOne({_id, admin: req.admin._id})
        if (!user) {
            return res.status(404).send()
        }

        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save()
        
        res.send()
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findByIdAndDelete({_id, admin: req.admin._id })

        if (!user) {
            res.status(404).send()
        }

        res.send()
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router