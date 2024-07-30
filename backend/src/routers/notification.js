const express = require('express');
const auth = require('../middleware/auth');
const Notification = require('../models/notification');

const router = new express.Router();

router.get('/notifications', auth, async (req, res) =>
{
    try
    {
        const notifications = await Notification.find({ doctor: req.user._id, read: false }).populate('patient', 'name email');
        res.send(notifications);
    } catch (error)
    {
        res.status(500).send(error);
    }
});

router.patch('/notifications/:id', auth, async (req, res) =>
{
    try
    {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        if (!notification)
        {
            return res.status(404).send();
        }
        res.send(notification);
    } catch (error)
    {
        res.status(500).send(error);
    }
});

module.exports = router;
