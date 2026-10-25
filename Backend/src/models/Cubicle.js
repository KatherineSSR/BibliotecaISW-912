const mongoose = require('mongoose');

const CubicleSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['free', 'occupied'],
        default: 'free',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cubicle', CubicleSchema);
