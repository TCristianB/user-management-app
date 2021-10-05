const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const Admin = require('../models/admin')


router.get('/',  auth, (req, res) => {
    try {
        res.send(req.admin)
    } catch(e) {
        res.status(404).send()
    }
})

router.post('/sign-up', async (req, res) => {
    const admin = new Admin(req.body)
    try {
        const adminExists = await Admin.findOne({ email: admin.email })
        
        if(adminExists) {
            return res.status(409).send()
        }
        await admin.save()
        
        const token = await admin.generateAuthToken()
        
        res.header('Authorization', 'Bearer ' + token).cookie('jwt', token, { httpOnly: true }).send()
    } catch (e) {
        res.status(400).send()
    }
})


router.post('/sign-in', async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        const token = await admin.generateAuthToken()
        res.header('Authorization', 'Bearer ' + token).cookie('jwt', token, { httpOnly: true }).send()
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/sign-out', auth, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.admin.save()
        
        res.clearCookie('jwt').send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
