const { nanoid } = require('nanoid');
const books = require('./books');

// FUNC ADD NOTES WITH METHOD POST
const addBooksHandler = (req, h) => {
  // GET BODY REQUEST
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (!name || name.trim() === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Nama buku tidak boleh kosong.',
    });

    response.code(400);
    return response;
  }

  // GET VALUE FOR id, finished, insertedAt, updatedAt
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id);

  // IF SUCCESS ADD BOOKS
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  // Use an array of error messages for better readability
  // const errorMessages = [];
  // if (!name || name.trim() === '') {
  //   errorMessages.push('Gagal menambahkan buku. Nama buku tidak boleh kosong.');
  // }
  // if (readPage > pageCount) {
  //   errorMessages.push('Gagal menambahkan buku. readPage
  // tidak boleh lebih besar dari pageCount.');
  // }

  // IF FAIL ADD BOOKS
  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku.',
  });

  response.code(400);
  return response;
};

// FUNC FOR SHOW ALL BOOKS WITH METHOD GET
const getAllBooksHandler = () => ({
  status: 'success',
  data: {
    books,
  },
});

// FUNC SHOW BOOK BY ID WITH METHOD GET
const getBookByIdHandler = (req, h) => {
  const { bookId } = req.params;

  const book = books.filter((buku) => buku.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = { addBooksHandler, getAllBooksHandler, getBookByIdHandler };
