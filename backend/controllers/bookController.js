const Book = require('../models/Book');
const asyncHandler = require('express-async-handler');

const getBooks = asyncHandler(async (req, res) => {
  const pageSize = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  const queryOptions = {};
  if (req.query.genre) {
    queryOptions.genre = req.query.genre;
  }
  if (req.query.search) {
    queryOptions.$text = { $search: req.query.search };
  }

  const count = await Book.countDocuments(queryOptions);

  const books = await Book.find(queryOptions)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    books,
    page,
    pages: Math.ceil(count / pageSize),
    totalBooks: count,
  });
});

const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    res.json(book);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

const createBook = asyncHandler(async (req, res) => {
  const {
    title,
    author,
    description,
    coverImageUrl,
    genre,
    isbn,
    publisher,
    publicationDate,
  } = req.body;

  const book = new Book({
    title,
    author,
    description,
    coverImageUrl,
    genre,
    isbn,
    publisher,
    publicationDate,
    addedBy: req.user._id,
  });

  const createdBook = await book.save();
  res.status(201).json(createdBook);
});

const getGenres = asyncHandler(async (req, res) => {
  const genres = await Book.distinct('genre', { genre: { $ne: null, $ne: "" } });
  res.json(genres.sort());
});

const updateBook = asyncHandler(async (req, res) => {
  const { title, author, description } = req.body;
  const book = await Book.findById(req.params.id);

  if (book) {
    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    await book.remove();
    res.json({ message: 'Book removed successfully' });
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

module.exports = {
  getBooks,
  getBookById,
  createBook,
  getGenres,
  updateBook,
  deleteBook,
};