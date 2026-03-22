const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const authMiddleware = require('../middleware/auth');

// Add Device
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { deviceId, deviceName, location, thingSpeakChannelId, thingSpeakApiKey } = req.body;
        const device = new Device({
            owner: req.user.id,
            deviceId,
            deviceName,
            location,
            thingSpeakChannelId,
            thingSpeakApiKey
        });
        await device.save();
        res.status(201).json(device);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get My Devices
router.get('/', authMiddleware, async (req, res) => {
    try {
        const devices = await Device.find({ owner: req.user.id });
        res.json(devices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
