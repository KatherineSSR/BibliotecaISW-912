const mongoose = require('mongoose');

const CubicleSessionSchema = new mongoose.Schema({
    cubicleNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 6
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userCode: {
        type: String,
        required: true,
        trim: true,
        match: /^\d{4}$/
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    durationMinutes: {
        type: Number,
        required: true,
        min: 1,
        max: 240,
        default: 240
    },
    endsAt: {
        type: Date,
        required: true
    },
    endedAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'finished', 'expired'],
        default: 'active'
    }
}, {
    timestamps: true
});

CubicleSessionSchema.index(
    { cubicleNumber: 1 },
    { unique: true, partialFilterExpression: { status: 'active' } }
);
CubicleSessionSchema.index(
    { user: 1 },
    { unique: true, partialFilterExpression: { status: 'active' } }
);
CubicleSessionSchema.index({ startedAt: -1 });
CubicleSessionSchema.index({ status: 1, endsAt: 1 });

module.exports = mongoose.model('CubicleSession', CubicleSessionSchema);
