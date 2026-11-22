const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título del libro es obligatorio.'],
        trim: true,
        maxlength: [200, 'El título no puede exceder 200 caracteres.']
    },
    author: {
        type: String,
        required: [true, 'El autor del libro es obligatorio.'],
        trim: true,
        maxlength: [150, 'El autor no puede exceder 150 caracteres.']
    },
    isbn: {
        type: String,
        trim: true,
        default: ''
    },
    category: {
        type: String,
        required: [true, 'La categoría o género es obligatoria.'],
        trim: true,
        maxlength: [80, 'La categoría no puede exceder 80 caracteres.']
    },
    editorial: {
        type: String,
        trim: true,
        default: ''
    },
    publicationYear: {
        type: Number,
        min: [1000, 'Año de publicación inválido.'],
        max: [new Date().getFullYear() + 1, 'Año de publicación inválido.']
    },
    totalCopies: {
        type: Number,
        required: [true, 'El total de ejemplares es obligatorio.'],
        min: [1, 'Debe registrar al menos 1 ejemplar.'],
        default: 1
    },
    availableCopies: {
        type: Number,
        required: [true, 'Los ejemplares disponibles son obligatorios.'],
        min: [0, 'Los ejemplares disponibles no pueden ser menores a 0.'],
        default: 1
    },
    location: {
        type: String,
        trim: true,
        default: 'Estantería General'
    },
    synopsis: {
        type: String,
        trim: true,
        default: ''
    },
    coverUrl: {
        type: String,
        trim: true,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Middleware para asegurar que availableCopies no exceda totalCopies
BookSchema.pre('validate', function () {
    if (this.availableCopies > this.totalCopies) {
        this.invalidate('availableCopies', 'Los ejemplares disponibles no pueden exceder el total de ejemplares.');
    }
});

BookSchema.index({ title: 'text', author: 'text', isbn: 'text', category: 'text' });

module.exports = mongoose.model('Book', BookSchema);
