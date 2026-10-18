const mongoose = require('mongoose');

const AccessSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userCode: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        required: true
    },
    entryTime: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Access', AccessSchema);
