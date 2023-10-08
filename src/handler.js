const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
  } = req.payload;

  const id = nanoid(16);
  // const finished = false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    id,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id);

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Book added successfully',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Book failed to add',
  });

  response.code(400);
  return response;
};

module.exports = { addBooksHandler };
