import React, { useEffect, useRef, useState } from 'react';
import { state, request, renderApp } from '../core.js';
import { EmptyState, Icon, Notice, PageAlert, PageHeading, PersonCell, StatusPill } from '../components.jsx';

export async function loadBooks() {
  state.loading = true;
  state.error = '';
  try {
    const params = new URLSearchParams();
    if (state.bookSearch) params.append('search', state.bookSearch);
    if (state.bookCategoryFilter) params.append('category', state.bookCategoryFilter);
    if (state.bookAvailabilityFilter && state.bookAvailabilityFilter !== 'all') {
      params.append('availability', state.bookAvailabilityFilter);
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const [booksRes, statsRes, categoriesRes] = await Promise.all([
      request(`/api/books${queryString}`),
      request('/api/books/stats').catch(() => ({ data: null })),
      request('/api/books/categories').catch(() => ({ data: [] }))
    ]);

    state.books = booksRes.data || [];
    state.bookCategories = categoriesRes.data || [];

    if (statsRes.data) {
      state.bookStats = statsRes.data;
    } else {
      const totalTitles = state.books.length;
      const totalCopies = state.books.reduce((acc, b) => acc + (b.totalCopies || 0), 0);
      const availableCopies = state.books.reduce((acc, b) => acc + (b.availableCopies || 0), 0);
      const outOfStockCount = state.books.filter(b => (b.availableCopies || 0) === 0).length;
      state.bookStats = {
        totalTitles,
        totalCopies,
        availableCopies,
        borrowedCopies: totalCopies - availableCopies,
        outOfStockCount
      };
    }
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
  }
}

const COMMON_CATEGORIES = [
  'Literatura Clásica',
  'Ficción y Novela',
  'Ciencia y Tecnología',
  'Historia y Geografía',
  'Filosofía y Psicología',
  'Artes y Humanidades',
  'Infantil y Juvenil',
  'Educación y Didáctica',
  'Ciencias Sociales',
  'Otro'
];

export default function BooksPage() {
  const createModalRef = useRef(null);
  const editModalRef = useRef(null);

  const [search, setSearch] = useState(state.bookSearch || '');
  const [selectedCategory, setSelectedCategory] = useState(state.bookCategoryFilter || '');
  const [availabilityFilter, setAvailabilityFilter] = useState(state.bookAvailabilityFilter || 'all');

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [editingBook, setEditingBook] = useState(null);

  // Nuevo libro form state
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Literatura Clásica',
    customCategory: '',
    editorial: '',
    publicationYear: '',
    totalCopies: 1,
    availableCopies: 1,
    location: 'Estantería General',
    synopsis: '',
    coverUrl: ''
  });

  useEffect(() => {
    const timer = setTimeout(async () => {
      let changed = false;
      if (search.trim() !== state.bookSearch) {
        state.bookSearch = search.trim();
        changed = true;
      }
      if (selectedCategory !== state.bookCategoryFilter) {
        state.bookCategoryFilter = selectedCategory;
        changed = true;
      }
      if (availabilityFilter !== state.bookAvailabilityFilter) {
        state.bookAvailabilityFilter = availabilityFilter;
        changed = true;
      }

      if (changed) {
        await loadBooks();
        renderApp();
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, availabilityFilter]);

  const refresh = async () => {
    await loadBooks();
    renderApp();
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');

    try {
      const categoryToUse = newBook.category === 'Otro' && newBook.customCategory.trim()
        ? newBook.customCategory.trim()
        : newBook.category;

      const payload = {
        title: newBook.title.trim(),
        author: newBook.author.trim(),
        isbn: newBook.isbn.trim(),
        category: categoryToUse.trim(),
        editorial: newBook.editorial.trim(),
        publicationYear: newBook.publicationYear ? Number(newBook.publicationYear) : undefined,
        totalCopies: Number(newBook.totalCopies) || 1,
        availableCopies: Number(newBook.availableCopies) || 1,
        location: newBook.location.trim() || 'Estantería General',
        synopsis: newBook.synopsis.trim(),
        coverUrl: newBook.coverUrl.trim()
      };

      const result = await request('/api/books', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      state.notice = result.message || 'Libro registrado exitosamente.';
      createModalRef.current?.close();
      setNewBook({
        title: '',
        author: '',
        isbn: '',
        category: 'Literatura Clásica',
        customCategory: '',
        editorial: '',
        publicationYear: '',
        totalCopies: 1,
        availableCopies: 1,
        location: 'Estantería General',
        synopsis: '',
        coverUrl: ''
      });
      await loadBooks();
      renderApp();
    } catch (err) {
      setFormError(err.message || 'Error al guardar el libro.');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (book) => {
    setEditingBook({
      _id: book._id,
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      category: book.category || '',
      editorial: book.editorial || '',
      publicationYear: book.publicationYear || '',
      totalCopies: book.totalCopies !== undefined ? book.totalCopies : 1,
      availableCopies: book.availableCopies !== undefined ? book.availableCopies : 1,
      location: book.location || 'Estantería General',
      synopsis: book.synopsis || '',
      coverUrl: book.coverUrl || '',
      isActive: book.isActive !== false
    });
    setFormError('');
    editModalRef.current?.showModal();
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingBook?._id) return;

    setSaving(true);
    setFormError('');

    try {
      const payload = {
        title: editingBook.title.trim(),
        author: editingBook.author.trim(),
        isbn: editingBook.isbn.trim(),
        category: editingBook.category.trim(),
        editorial: editingBook.editorial.trim(),
        publicationYear: editingBook.publicationYear ? Number(editingBook.publicationYear) : undefined,
        totalCopies: Number(editingBook.totalCopies),
        availableCopies: Number(editingBook.availableCopies),
        location: editingBook.location.trim(),
        synopsis: editingBook.synopsis.trim(),
        coverUrl: editingBook.coverUrl.trim(),
        isActive: Boolean(editingBook.isActive)
      };

      const result = await request(`/api/books/${editingBook._id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      state.notice = result.message || 'Libro actualizado correctamente.';
      editModalRef.current?.close();
      setEditingBook(null);
      await loadBooks();
      renderApp();
    } catch (err) {
      setFormError(err.message || 'Error al actualizar el libro.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (book) => {
    const confirmMessage = `¿Estás seguro de que deseas eliminar "${book.title}" del catálogo?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      const result = await request(`/api/books/${book._id}`, {
        method: 'DELETE'
      });
      state.notice = result.message || 'Libro eliminado del catálogo.';
      await loadBooks();
      renderApp();
    } catch (err) {
      state.error = err.message || 'Error al eliminar el libro.';
      renderApp();
    }
  };

  const stats = state.bookStats || {
    totalTitles: state.books.length,
    totalCopies: 0,
    availableCopies: 0,
    outOfStockCount: 0
  };

  return (
    <>
      <PageHeading
        eyebrow="ACERVO BIBLIOGRÁFICO"
        title="Catálogo de libros"
        actions={
          <button
            className="button button-primary"
            onClick={() => {
              setFormError('');
              createModalRef.current?.showModal();
            }}
            type="button"
          >
            <Icon name="plus" />
            <span>Nuevo libro</span>
          </button>
        }
      >
        Administra el catálogo bibliográfico, inventario de ejemplares físicos y disponibilidad para préstamos.
      </PageHeading>

      <PageAlert message={state.error} onRetry={refresh} />
      <Notice message={state.notice} />

      {/* Tarjetas de estadísticas de libros */}
      <section className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <article className="panel stat-card">
          <div className="stat-label">Títulos en catálogo</div>
          <div className="stat-value">{stats.totalTitles || 0}</div>
          <div className="stat-foot">Obras registradas</div>
        </article>
        <article className="panel stat-card">
          <div className="stat-label">Total ejemplares</div>
          <div className="stat-value">{stats.totalCopies || 0}</div>
          <div className="stat-foot">Volúmenes en inventario</div>
        </article>
        <article className="panel stat-card">
          <div className="stat-label">Ejemplares disponibles</div>
          <div className="stat-value" style={{ color: '#2b6cb0' }}>{stats.availableCopies || 0}</div>
          <div className="stat-foot">Listos para préstamo</div>
        </article>
        <article className="panel stat-card">
          <div className="stat-label">Títulos agotados</div>
          <div className="stat-value" style={{ color: stats.outOfStockCount ? '#c53030' : '#4a5568' }}>
            {stats.outOfStockCount || 0}
          </div>
          <div className="stat-foot">Sin ejemplares en estantería</div>
        </article>
      </section>

      {/* Directorio de libros */}
      <section className="panel data-panel">
        <div className="table-toolbar" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2>Inventario de libros</h2>
            <p>{state.books.length} títulos encontrados</p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            {/* Buscador */}
            <label className="search-box">
              <Icon name="search" />
              <input
                type="search"
                placeholder="Buscar por título, autor, ISBN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            {/* Filtro de categoría */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                height: '40px',
                padding: '0 12px',
                borderRadius: '8px',
                border: '1px solid #d2d6dc',
                background: 'white',
                fontSize: '0.9rem'
              }}
            >
              <option value="">Todas las categorías</option>
              {Array.from(new Set([...COMMON_CATEGORIES, ...(state.bookCategories || [])]))
                .filter(cat => cat !== 'Otro')
                .map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>

            {/* Filtro de disponibilidad */}
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              style={{
                height: '40px',
                padding: '0 12px',
                borderRadius: '8px',
                border: '1px solid #d2d6dc',
                background: 'white',
                fontSize: '0.9rem'
              }}
            >
              <option value="all">Todos los estados</option>
              <option value="available">Solo disponibles</option>
              <option value="unavailable">Agotados (0 ejemplares)</option>
            </select>
          </div>
        </div>

        {state.loading ? (
          <div className="table-message">Cargando catálogo…</div>
        ) : state.books.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>LIBRO / AUTOR</th>
                  <th>CATEGORÍA</th>
                  <th>ISBN / EDITORIAL</th>
                  <th>AÑO</th>
                  <th>UBICACIÓN</th>
                  <th>EJEMPLARES</th>
                  <th style={{ textAlign: 'center' }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {state.books.map((book) => {
                  const isAvailable = (book.availableCopies || 0) > 0;
                  return (
                    <tr key={book._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '48px',
                              borderRadius: '4px',
                              background: '#edf2f7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#4a5568',
                              flexShrink: 0,
                              overflow: 'hidden'
                            }}
                          >
                            {book.coverUrl ? (
                              <img
                                src={book.coverUrl}
                                alt={book.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            ) : (
                              <Icon name="book" />
                            )}
                          </div>
                          <div>
                            <strong style={{ display: 'block', fontSize: '0.95rem' }}>{book.title}</strong>
                            <span style={{ fontSize: '0.85rem', color: '#718096' }}>{book.author}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          background: '#e2e8f0',
                          color: '#2d3748',
                          fontWeight: '500'
                        }}>
                          {book.category}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          {book.isbn ? <span className="code-tag" style={{ marginRight: '4px' }}>{book.isbn}</span> : null}
                          <span style={{ color: '#718096' }}>{book.editorial || '—'}</span>
                        </div>
                      </td>
                      <td>{book.publicationYear || '—'}</td>
                      <td>{book.location || 'General'}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 'bold' }}>
                            {book.availableCopies} / {book.totalCopies}
                          </span>
                          <StatusPill active={isAvailable} inactive={!isAvailable}>
                            {isAvailable ? 'Disponible' : 'Agotado'}
                          </StatusPill>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button
                            className="button button-quiet button-small"
                            onClick={() => openEdit(book)}
                            type="button"
                            title="Editar libro"
                            style={{ gap: '4px', padding: '0 10px' }}
                          >
                            <Icon name="edit" />
                            <span>Editar</span>
                          </button>
                          <button
                            className="button button-quiet button-small"
                            onClick={() => handleDelete(book)}
                            type="button"
                            title="Eliminar libro"
                            style={{ gap: '4px', padding: '0 8px', color: '#c53030' }}
                          >
                            <Icon name="trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon="book" title={search ? 'No se encontraron libros' : 'El catálogo está vacío'}>
            {search
              ? 'Prueba con otro título, autor o categoría.'
              : 'Haz clic en "Nuevo libro" para agregar la primera obra al inventario.'}
          </EmptyState>
        )}
      </section>

      {/* Modal: Registrar Libro */}
      <dialog className="modal" ref={createModalRef}>
        <form className="modal-card" onSubmit={handleCreateSubmit} style={{ maxWidth: '650px' }}>
          <div className="modal-heading">
            <div>
              <div className="eyebrow">CATÁLOGO BIBLIOGRÁFICO</div>
              <h2>Registrar nuevo libro</h2>
            </div>
            <button className="icon-button" onClick={() => createModalRef.current?.close()} type="button" aria-label="Cerrar">×</button>
          </div>
          <p className="modal-description">Ingresa los datos del libro y el número de ejemplares disponibles.</p>
          {formError && (
            <div className="alert alert-error" role="alert">
              <Icon name="alert" />
              <span>{formError}</span>
              <button className="alert-dismiss" onClick={() => setFormError('')} type="button" aria-label="Cerrar">×</button>
            </div>
          )}

          <div className="form-grid">
            <div className="form-field form-field-wide">
              <label htmlFor="create-title">Título del libro *</label>
              <input
                id="create-title"
                required
                maxLength="200"
                placeholder="Ej: Cien años de soledad"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label htmlFor="create-author">Autor(a) *</label>
              <input
                id="create-author"
                required
                maxLength="150"
                placeholder="Ej: Gabriel García Márquez"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label htmlFor="create-category">Categoría / Género *</label>
              <select
                id="create-category"
                value={newBook.category}
                onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
              >
                {COMMON_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {newBook.category === 'Otro' && (
              <div className="form-field form-field-wide">
                <label htmlFor="create-custom-category">Especificar otra categoría *</label>
                <input
                  id="create-custom-category"
                  required
                  placeholder="Ej: Biografías, Poesía..."
                  value={newBook.customCategory}
                  onChange={(e) => setNewBook({ ...newBook, customCategory: e.target.value })}
                />
              </div>
            )}

            <div className="form-field">
              <label htmlFor="create-isbn">ISBN / Código de barras</label>
              <input
                id="create-isbn"
                placeholder="Ej: 978-0307474728"
                value={newBook.isbn}
                onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label htmlFor="create-editorial">Editorial</label>
              <input
                id="create-editorial"
                placeholder="Ej: Editorial Sudamericana"
                value={newBook.editorial}
                onChange={(e) => setNewBook({ ...newBook, editorial: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label htmlFor="create-year">Año de publicación</label>
              <input
                id="create-year"
                type="number"
                min="1000"
                max={new Date().getFullYear() + 1}
                placeholder="Ej: 1967"
                value={newBook.publicationYear}
                onChange={(e) => setNewBook({ ...newBook, publicationYear: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label htmlFor="create-location">Ubicación en biblioteca</label>
              <input
                id="create-location"
                placeholder="Ej: Estantería B-3"
                value={newBook.location}
                onChange={(e) => setNewBook({ ...newBook, location: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label htmlFor="create-total">Total de ejemplares *</label>
              <input
                id="create-total"
                type="number"
                min="1"
                required
                value={newBook.totalCopies}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setNewBook({
                    ...newBook,
                    totalCopies: val,
                    availableCopies: Math.min(newBook.availableCopies, val)
                  });
                }}
              />
            </div>

            <div className="form-field">
              <label htmlFor="create-available">Ejemplares disponibles *</label>
              <input
                id="create-available"
                type="number"
                min="0"
                max={newBook.totalCopies}
                required
                value={newBook.availableCopies}
                onChange={(e) => setNewBook({ ...newBook, availableCopies: Number(e.target.value) })}
              />
            </div>

            <div className="form-field form-field-wide">
              <label htmlFor="create-cover">URL imagen de portada (opcional)</label>
              <input
                id="create-cover"
                type="url"
                placeholder="https://..."
                value={newBook.coverUrl}
                onChange={(e) => setNewBook({ ...newBook, coverUrl: e.target.value })}
              />
            </div>

            <div className="form-field form-field-wide">
              <label htmlFor="create-synopsis">Sinopsis / Descripción breve</label>
              <textarea
                id="create-synopsis"
                rows="3"
                placeholder="Breve reseña del contenido del libro..."
                value={newBook.synopsis}
                onChange={(e) => setNewBook({ ...newBook, synopsis: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d2d6dc', font: 'inherit' }}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button className="button button-quiet" onClick={() => createModalRef.current?.close()} type="button">Cancelar</button>
            <button className="button button-primary" type="submit" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar libro'}
            </button>
          </div>
        </form>
      </dialog>

      {/* Modal: Editar Libro */}
      <dialog className="modal" ref={editModalRef}>
        {editingBook && (
          <form className="modal-card" onSubmit={handleUpdateSubmit} style={{ maxWidth: '650px' }}>
            <div className="modal-heading">
              <div>
                <div className="eyebrow">MODIFICAR LIBRO</div>
                <h2>Editar datos de la obra</h2>
              </div>
              <button className="icon-button" onClick={() => editModalRef.current?.close()} type="button" aria-label="Cerrar">×</button>
            </div>
            <p className="modal-description">Actualiza el inventario o la información bibliográfica de este título.</p>
            {formError && (
            <div className="alert alert-error" role="alert">
              <Icon name="alert" />
              <span>{formError}</span>
              <button className="alert-dismiss" onClick={() => setFormError('')} type="button" aria-label="Cerrar">×</button>
            </div>
          )}

            <div className="form-grid">
              <div className="form-field form-field-wide">
                <label htmlFor="edit-title">Título del libro *</label>
                <input
                  id="edit-title"
                  required
                  maxLength="200"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label htmlFor="edit-author">Autor(a) *</label>
                <input
                  id="edit-author"
                  required
                  maxLength="150"
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label htmlFor="edit-category">Categoría / Género *</label>
                <input
                  id="edit-category"
                  required
                  maxLength="80"
                  value={editingBook.category}
                  onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label htmlFor="edit-isbn">ISBN / Código de barras</label>
                <input
                  id="edit-isbn"
                  value={editingBook.isbn}
                  onChange={(e) => setEditingBook({ ...editingBook, isbn: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label htmlFor="edit-editorial">Editorial</label>
                <input
                  id="edit-editorial"
                  value={editingBook.editorial}
                  onChange={(e) => setEditingBook({ ...editingBook, editorial: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label htmlFor="edit-year">Año de publicación</label>
                <input
                  id="edit-year"
                  type="number"
                  min="1000"
                  max={new Date().getFullYear() + 1}
                  value={editingBook.publicationYear}
                  onChange={(e) => setEditingBook({ ...editingBook, publicationYear: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label htmlFor="edit-location">Ubicación en biblioteca</label>
                <input
                  id="edit-location"
                  value={editingBook.location}
                  onChange={(e) => setEditingBook({ ...editingBook, location: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label htmlFor="edit-total">Total ejemplares *</label>
                <input
                  id="edit-total"
                  type="number"
                  min="1"
                  required
                  value={editingBook.totalCopies}
                  onChange={(e) => setEditingBook({ ...editingBook, totalCopies: Number(e.target.value) })}
                />
              </div>

              <div className="form-field">
                <label htmlFor="edit-available">Ejemplares disponibles *</label>
                <input
                  id="edit-available"
                  type="number"
                  min="0"
                  max={editingBook.totalCopies}
                  required
                  value={editingBook.availableCopies}
                  onChange={(e) => setEditingBook({ ...editingBook, availableCopies: Number(e.target.value) })}
                />
              </div>

              <div className="form-field form-field-wide">
                <label htmlFor="edit-cover">URL imagen de portada</label>
                <input
                  id="edit-cover"
                  type="url"
                  value={editingBook.coverUrl}
                  onChange={(e) => setEditingBook({ ...editingBook, coverUrl: e.target.value })}
                />
              </div>

              <div className="form-field form-field-wide">
                <label htmlFor="edit-synopsis">Sinopsis / Descripción</label>
                <textarea
                  id="edit-synopsis"
                  rows="3"
                  value={editingBook.synopsis}
                  onChange={(e) => setEditingBook({ ...editingBook, synopsis: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d2d6dc', font: 'inherit' }}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="button button-quiet" onClick={() => editModalRef.current?.close()} type="button">Cancelar</button>
              <button className="button button-primary" type="submit" disabled={saving}>
                {saving ? 'Guardando cambios…' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}

