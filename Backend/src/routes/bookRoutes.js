const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/adminAuth');
const {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getCategories,
    getBookStats
} = require('../controllers/bookController');

// Todas las rutas del catálogo y gestión de libros son exclusivas para administradores
router.use(requireAdmin);

router.get('/', getBooks);
router.get('/categories', getCategories);
router.get('/stats', getBookStats);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;
