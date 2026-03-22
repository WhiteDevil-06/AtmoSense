const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deviceId: { type: String, required: true, unique: true },
    deviceName: { type: String, required: true },
    location: { type: String, required: true },
    thingSpeakChannelId: { type: String, required: true },
    thingSpeakApiKey: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Device', DeviceSchema);
