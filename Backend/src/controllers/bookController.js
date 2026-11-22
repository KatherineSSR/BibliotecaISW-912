const Book = require('../models/Book');

/**
 * Consultar catálogo de libros con filtros y búsqueda en tiempo real
 */
const getBooks = async (req, res) => {
    try {
        const { search, category, availability, includeInactive, sort } = req.query;
        const query = {};

        // Filtrar activos por defecto
        if (includeInactive !== 'true') {
            query.isActive = true;
        }

        // Búsqueda por término (título, autor, ISBN, categoría)
        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), 'i');
            query.$or = [
                { title: regex },
                { author: regex },
                { isbn: regex },
                { category: regex }
            ];
        }

        // Filtro por categoría específica
        if (category && category.trim()) {
            query.category = category.trim();
        }

        // Filtro por disponibilidad
        if (availability === 'available') {
            query.availableCopies = { $gt: 0 };
        } else if (availability === 'unavailable') {
            query.availableCopies = 0;
        }

        // Ordenamiento
        let sortOption = { createdAt: -1 };
        if (sort === 'title') sortOption = { title: 1 };
        else if (sort === 'author') sortOption = { author: 1 };
        else if (sort === 'year') sortOption = { publicationYear: -1 };

        const books = await Book.find(query).sort(sortOption).lean();

        return res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        console.error('Error al consultar libros:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al consultar el catálogo de libros.',
            error: error.message
        });
    }
};

/**
 * Obtener detalle de un libro por ID
 */
const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id).lean();

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'El libro solicitado no fue encontrado.'
            });
        }

        return res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        console.error('Error al obtener libro por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Identificador de libro inválido o error en la consulta.',
            error: error.message
        });
    }
};

/**
 * Crear / Registrar un nuevo libro en el catálogo
 */
const createBook = async (req, res) => {
    try {
        const {
            title,
            author,
            isbn,
            category,
            editorial,
            publicationYear,
            totalCopies,
            availableCopies,
            location,
            synopsis,
            coverUrl
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'El título del libro es obligatorio.'
            });
        }

        if (!author || !author.trim()) {
            return res.status(400).json({
                success: false,
                message: 'El autor del libro es obligatorio.'
            });
        }

        if (!category || !category.trim()) {
            return res.status(400).json({
                success: false,
                message: 'La categoría del libro es obligatoria.'
            });
        }

        const parsedTotal = totalCopies !== undefined && totalCopies !== null ? Number(totalCopies) : 1;
        if (Number.isNaN(parsedTotal) || parsedTotal < 1) {
            return res.status(400).json({
                success: false,
                message: 'El total de ejemplares debe ser un número entero mayor o igual a 1.'
            });
        }

        const parsedAvailable = availableCopies !== undefined && availableCopies !== null
            ? Number(availableCopies)
            : parsedTotal;

        if (Number.isNaN(parsedAvailable) || parsedAvailable < 0) {
            return res.status(400).json({
                success: false,
                message: 'Los ejemplares disponibles deben ser un número mayor o igual a 0.'
            });
        }

        if (parsedAvailable > parsedTotal) {
            return res.status(400).json({
                success: false,
                message: 'Los ejemplares disponibles no pueden ser mayores al total de ejemplares.'
            });
        }

        const newBook = new Book({
            title: title.trim(),
            author: author.trim(),
            isbn: isbn ? isbn.trim() : '',
            category: category.trim(),
            editorial: editorial ? editorial.trim() : '',
            publicationYear: publicationYear ? Number(publicationYear) : undefined,
            totalCopies: parsedTotal,
            availableCopies: parsedAvailable,
            location: location ? location.trim() : 'Estantería General',
            synopsis: synopsis ? synopsis.trim() : '',
            coverUrl: coverUrl ? coverUrl.trim() : '',
            isActive: true
        });

        await newBook.save();

        return res.status(201).json({
            success: true,
            message: 'Libro registrado exitosamente en el catálogo.',
            data: newBook
        });
    } catch (error) {
        console.error('Error al registrar libro:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error interno al registrar el libro.'
        });
    }
};

/**
 * Actualizar información de un libro
 */
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'El libro a actualizar no existe.'
            });
        }

        const {
            title,
            author,
            isbn,
            category,
            editorial,
            publicationYear,
            totalCopies,
            availableCopies,
            location,
            synopsis,
            coverUrl,
            isActive
        } = req.body;

        if (title !== undefined) book.title = title.trim();
        if (author !== undefined) book.author = author.trim();
        if (isbn !== undefined) book.isbn = isbn.trim();
        if (category !== undefined) book.category = category.trim();
        if (editorial !== undefined) book.editorial = editorial.trim();
        if (publicationYear !== undefined) book.publicationYear = publicationYear ? Number(publicationYear) : undefined;
        if (location !== undefined) book.location = location.trim();
        if (synopsis !== undefined) book.synopsis = synopsis.trim();
        if (coverUrl !== undefined) book.coverUrl = coverUrl.trim();
        if (isActive !== undefined) book.isActive = Boolean(isActive);

        if (totalCopies !== undefined) {
            const parsedTotal = Number(totalCopies);
            if (Number.isNaN(parsedTotal) || parsedTotal < 1) {
                return res.status(400).json({
                    success: false,
                    message: 'El total de ejemplares debe ser un número entero mayor o igual a 1.'
                });
            }
            book.totalCopies = parsedTotal;
        }

        if (availableCopies !== undefined) {
            const parsedAvailable = Number(availableCopies);
            if (Number.isNaN(parsedAvailable) || parsedAvailable < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Los ejemplares disponibles deben ser mayor o igual a 0.'
                });
            }
            book.availableCopies = parsedAvailable;
        }

        // Validar que disponibles no superen totales
        if (book.availableCopies > book.totalCopies) {
            return res.status(400).json({
                success: false,
                message: `Los ejemplares disponibles (${book.availableCopies}) no pueden exceder el total (${book.totalCopies}).`
            });
        }

        await book.save();

        return res.status(200).json({
            success: true,
            message: 'Libro actualizado exitosamente.',
            data: book
        });
    } catch (error) {
        console.error('Error al actualizar libro:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error interno al actualizar el libro.'
        });
    }
};

/**
 * Eliminar libro (baja lógica por defecto, o física si permanent=true)
 */
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { permanent } = req.query;

        if (permanent === 'true') {
            const deleted = await Book.findByIdAndDelete(id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'El libro no existe o ya fue eliminado.'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Libro eliminado permanentemente de la base de datos.'
            });
        }

        // Baja lógica
        const book = await Book.findByIdAndUpdate(
            id,
            { $set: { isActive: false } },
            { returnDocument: 'after' }
        );

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'El libro no fue encontrado.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'El libro fue dado de baja del catálogo exitosamente.',
            data: book
        });
    } catch (error) {
        console.error('Error al eliminar libro:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar el libro.',
            error: error.message
        });
    }
};

/**
 * Obtener lista de categorías únicas de libros disponibles
 */
const getCategories = async (req, res) => {
    try {
        const categories = await Book.distinct('category', { isActive: true });
        return res.status(200).json({
            success: true,
            data: categories.sort()
        });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al consultar categorías de libros.',
            error: error.message
        });
    }
};

/**
 * Estadísticas generales de libros para el dashboard y panel
 */
const getBookStats = async (req, res) => {
    try {
        const [stats] = await Book.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    totalTitles: { $sum: 1 },
                    totalCopies: { $sum: '$totalCopies' },
                    availableCopies: { $sum: '$availableCopies' }
                }
            }
        ]);

        const outOfStockCount = await Book.countDocuments({ isActive: true, availableCopies: 0 });

        const totalTitles = stats ? stats.totalTitles : 0;
        const totalCopies = stats ? stats.totalCopies : 0;
        const availableCopies = stats ? stats.availableCopies : 0;
        const borrowedCopies = Math.max(0, totalCopies - availableCopies);

        return res.status(200).json({
            success: true,
            data: {
                totalTitles,
                totalCopies,
                availableCopies,
                borrowedCopies,
                outOfStockCount
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de libros:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al consultar estadísticas de libros.',
            error: error.message
        });
    }
};

module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getCategories,
    getBookStats
};
