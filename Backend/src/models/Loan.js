const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
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
        required: [true, 'El código de usuario es obligatorio.'],
        trim: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    bookTitle: {
        type: String,
        required: true,
        trim: true
    },
    loanDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    dueDate: {
        type: Date,
        required: [true, 'La fecha de vencimiento del préstamo es obligatoria.']
    },
    returnDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'returned', 'overdue'],
        default: 'active'
    },
    notes: {
        type: String,
        trim: true,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

LoanSchema.index({ status: 1, dueDate: 1 });
LoanSchema.index({ userCode: 1, status: 1 });
LoanSchema.index({ book: 1, status: 1 });

module.exports = mongoose.model('Loan', LoanSchema);
