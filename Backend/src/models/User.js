
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    name: {
        required: true,
        type: String,
    },

    lastName: {
        required: true,
        type: String,
    },

    password: {
        type: String,
        default: ''
    },

    email: {
        required: true,
        type: String,
        unique: true
    },

    cedula: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    phone: {
        type: String,
        trim: true
    },

    age: {
        type: Number,
        min: 0
    },

    address: {
        type: String,
        trim: true
    },

    userCode: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },

    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

UserSchema.statics.findByEmail = function (email) {
    return this.findOne({ email });
};

UserSchema.statics.createUser = function (data) {
    return this.create(data);
};

module.exports = mongoose.model('User', UserSchema);

