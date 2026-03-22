const mongoose = require('mongoose');

const GasDataSchema = new mongoose.Schema({
    deviceId: { type: String, required: true },
    mq2Level: { type: Number, required: true },
    mq135Level: { type: Number, required: true },
    mq7Level: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GasData', GasDataSchema);
