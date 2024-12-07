import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FormCRUD.css'; 

const FormCrud = () => {
  const [books, setBooks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentBook, setCurrentBook] = useState({ id: null, nombre: '' });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/libros');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleChange = (e) => {
    setCurrentBook({ ...currentBook, nombre: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await axios.put(`http://localhost:3001/libros/${currentBook.id}`, currentBook);
    } else {
      await axios.post('http://localhost:3001/libros', currentBook);
    }
    setCurrentBook({ id: null, nombre: '' });
    setEditMode(false);
    fetchBooks();
  };

  const handleEdit = (book) => {
    setEditMode(true);
    setCurrentBook(book);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/libros/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={currentBook.nombre}
          onChange={handleChange}
          placeholder="Nombre del libro"
          required
        />
        <button type="submit">{editMode ? "Actualizar" : "Agregar"}</button>
      </form>
      <ul>
        {books && books.length > 0 ? (
          books.map((book) => (
            <li key={book.id}>
              <h3>{book.nombre}</h3>
              <div>
                <button className="Edit" onClick={() => handleEdit(book)}>Editar</button>
                <button onClick={() => handleDelete(book.id)}>Eliminar</button>
              </div>
            </li>
          ))
        ) : (
          <p>No hay libros disponibles.</p>
        )}
      </ul>
    </div>
  );
};

export default FormCrud;
