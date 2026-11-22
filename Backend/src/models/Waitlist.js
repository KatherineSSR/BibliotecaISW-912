const mongoose = require('mongoose');

const WaitlistSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: [true, 'El libro es obligatorio.']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es obligatorio.']
    },
    userCode: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    userEmail: {
        type: String,
        required: false,
        trim: true,
        default: ''
    },
    bookTitle: {
        type: String,
        required: true,
        trim: true
    },
    requestDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['waiting', 'notified', 'fulfilled', 'cancelled', 'expired'],
        default: 'waiting'
    },
    notifiedAt: {
        type: Date,
        default: null
    },
    expiresAt: {
        type: Date,
        default: null
    },
    priority: {
        type: Number,
        default: 1
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

WaitlistSchema.index({ book: 1, status: 1, priority: 1 });
WaitlistSchema.index({ user: 1, book: 1 });

module.exports = mongoose.model('Waitlist', WaitlistSchema);
