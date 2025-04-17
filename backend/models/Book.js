const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    coverImageUrl: { type: String, trim: true },
    genre: { type: String, trim: true },
    isbn: { type: String, trim: true },
    publisher: { type: String, trim: true },
    publicationDate: { type: Date },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    averageRating: {
      type: Number,
      default: null,
      min: 0,
      max: 5 
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

bookSchema.index({ title: 'text', author: 'text', genre: 1 });
const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
