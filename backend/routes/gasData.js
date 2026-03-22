const express = require('express');
const router = express.Router();
const GasData = require('../models/GasData');
const Device = require('../models/Device');

// Public route for ESP32/Arduino to push data
// Typically it might use a simple API key, but we'll allow pushing via deviceId for now
router.post('/', async (req, res) => {
    try {
        const { deviceId, mq2Level, mq135Level, mq7Level } = req.body;
        
        // Optionally verify if device exists
        const device = await Device.findOne({ deviceId });
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        const gasData = new GasData({
            deviceId,
            mq2Level,
            mq135Level,
            mq7Level
        });
        
        await gasData.save();
        res.status(201).json(gasData);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get data for a specific device (Protected, frontend uses this)
// Requires authMiddleware when integrated in server.js? Actually we can just filter by deviceId
router.get('/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        const limit = parseInt(req.query.limit) || 50;
        
        const data = await GasData.find({ deviceId })
            .sort({ timestamp: -1 })
            .limit(limit);
            
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
