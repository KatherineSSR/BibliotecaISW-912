const mongoose = require('mongoose');

const ComputerSessionSchema = new mongoose.Schema({
    workstationNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 14
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
        trim: true
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    endedAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'finished'],
        default: 'active'
    }
}, {
    timestamps: true
});

ComputerSessionSchema.index(
    { workstationNumber: 1 },
    { unique: true, partialFilterExpression: { status: 'active' } }
);
ComputerSessionSchema.index(
    { user: 1 },
    { unique: true, partialFilterExpression: { status: 'active' } }
);
ComputerSessionSchema.index({ startedAt: -1 });

module.exports = mongoose.model('ComputerSession', ComputerSessionSchema);
