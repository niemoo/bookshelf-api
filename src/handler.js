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

  // CHECK BODY REQUEST NAME
  if (!name || name.trim() === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  // CHECK BODY REQUEST READPAGE > PAGECOUNT
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
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
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
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

  // IF FAIL ADD BOOKS
  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku.',
  });

  response.code(400);
  return response;
};

// FUNC FOR SHOW ALL BOOKS WITH METHOD GET
const getAllBooksHandler = (req) => {
  const { name, finished, reading } = req.query;

  let filteredBooks = books;

  // GET ALL READING AND UNREADING BOOKS
  if (reading === '1') {
    filteredBooks = books.filter((book) => book.reading === true);
  } else if (reading === '0') {
    filteredBooks = books.filter((book) => book.reading === false);
  }

  // GET ALL FINISHED AND UNFINISHED BOOKS
  if (finished === '1') {
    filteredBooks = books.filter((book) => book.finished === true);
  } else if (finished === '0') {
    filteredBooks = books.filter((book) => book.finished === false);
  }

  if (name) {
    const lowerCaseName = name.toLowerCase();
    filteredBooks = books.filter((book) => book.name.toLowerCase().includes(lowerCaseName));
  }

  return {
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  };
};

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

  // IF FAILED SHOW
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

// FUNC EDIT BOOK BY ID WITH METHOD PUT
const editBookByIdHandler = (req, h) => {
  const { bookId } = req.params;

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

  // SEARCH NOTES INDEX BY ID
  const index = books.findIndex((book) => book.id === bookId);

  // IF ID NOT FOUND
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    response.code(404);
    return response;
  }

  // IF NAME IS EMPTY STRING
  if (!name || name.trim() === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  // IF READPAGE > PAGECOUNT
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  // EDIT BOOKS DATA
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  };

  // IF SUCCESS EDIT NOTES
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });

  response.code(200);
  return response;
};

// FUNC DELETE BOOK BY ID WITH METHOD DELETE
const deleteBookByIdHandler = (req, h) => {
  const { bookId } = req.params;

  const index = books.findIndex((book) => book.id === bookId);

  // IF SUCCESS DELETE
  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  // IF FAILED DELETE
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
