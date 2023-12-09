const express = require('express');
const multer = require('multer')
const sharp = require('sharp');
const User = require('../models/user') // to load user
const auth = require('../middleware/auth');
const router = new express.Router()

// to signup
router.post('/users', async (req, res) =>
{
    const user = new User(req.body) // User fn need the param that we created in the model but req.body is returning the data in that format itself

    try // we use try catch becasue if an error is generated it might stop our program, so we catch it using try-catch
    {
        await user.save()
        const token = await user.geenerateAuthToken()

        res.status(201).send({ user, token }) // shorthand
    }
    catch (e) { res.status(400).send(e) }
})

// to login
router.post('/users/login', async (req, res) =>
{
    try
    {
        const user = await User.findByCredentials(req.body.email, req.body.password) // User is the collection and user is the current instance of User Collection
        const token = await user.geenerateAuthToken()
        // res.send({ user: user.getPublicProfile(), token }) // peaK about 'getPublicProfile' in '04 user (created logout)'
        res.send({ user, token }) // shorthand

    } catch (e)
    {
        res.status(400).send()
    }
}
)
// logging out
router.post('/users/logout', auth, async (req, res) =>
{
    try
    {
        req.user.tokens = req.user.tokens.filter( // getting user's token and setting a filtered version of it

            (token) =>
            {
                return token.token !== req.token  // (token that is currently present !== the token that was used) ---- if they are equal, false will be returned ---- thus (filtering it and) removing that token from token's array
            }
        )
        await req.user.save()
        res.send()
    }

    catch (e)
    {
        res.status(500).send()
    }
}
)

// logging out of all devices
router.post('/users/logoutAll', auth, async (req, res) =>
{
    try 
    {
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch (e)
    {
        res.status(500).send()

    }
}
)

// repurposing it to 'read me' from read all users
router.get('/users/me', auth, async (req, res) => // points to remember: req is made to '/users' then it will execute auth and then only "the route handler"(3rd argument). Also, auth must call next() present in it or router handler will not execute 
{
    res.send(req.user)
}
)

// update
router.patch('/users/me', auth, async (req, res) =>
{
    const updates = Object.keys(req.body) // (req.body is an object of array). We need to convert this object of array into arrya of string. This is done via keys which will return array of strings
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every // this is an array method, if this is present in array
        (
            (update) => allowedUpdates.includes(update) //shorthand
        )

    if (!isValidOperation)
    {
        return res.status(404).send({ error: 'Invalid updates' })
    }

    try
    {
        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()
        res.send(req.user)

    } catch (e)
    {
        res.status(400).send(e)
    }
}
)

// deleting a user
router.delete('/users/me', auth, async (req, res) =>
{
    try
    {
        await req.user.remove()
        res.send(req.user)
    }
    catch (e)
    {
        res.status(500).send()
    }
}
)

// to upload an image
const upload = multer
    (
        {
            // dest: 'avatars',
            limits:
            {
                fileSize: 1000000
            },
            fileFilter(req, file, cb)
            {
                if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
                {
                    return cb(new Error('Please upload an image'))
                }
                cb(undefined, true)
            }
        }
    )

// Creating avatar, updating avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) =>
{
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) =>
{
    res.status(400).send({ error: error.message })
}
)

// deleting avatar
router.delete('/users/me/avatar', auth, async (req, res) =>
{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}
)

// reading avatar
router.get('/users/:id/avatar', async (req, res) =>
{
    try
    {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar)
        {
            throw new Error()
        }
        // to provide the info aboout the data(the file extension) that we are sending we use response headers
        res.set('Content-Type', 'image/png') // a key value pair is taken by 'set'; first one is name of the response header and second is the value that we are trying to set on it (which by default is set to application/json)
        res.send(user.avatar)
    }
    catch (e)
    {
        res.status(404).send()
    }
}
)

module.exports = router