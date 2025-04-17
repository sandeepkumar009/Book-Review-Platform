const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Book' },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

reviewSchema.index({ book: 1, user: 1 }, { unique: true });
reviewSchema.index({ book: 1 });


reviewSchema.statics.calculateAverageRating = async function(bookId) {
  console.log(`Calculating average rating for book: ${bookId}`);
  try {
      const result = await this.aggregate([
        { $match: { book: new mongoose.Types.ObjectId(bookId) } },
        { $group: { _id: '$book', averageRating: { $avg: '$rating' } } }
      ]);

      const newAverage = result.length > 0 ? result[0].averageRating : null;

      console.log(`New average rating for book ${bookId}: ${newAverage}`);

      await mongoose.model('Book').findByIdAndUpdate(bookId, {
        averageRating: newAverage
      });
      console.log(`Updated average rating for book ${bookId} in Book collection.`);

  } catch (error) {
      console.error(`Error calculating/updating average rating for book ${bookId}:`, error);
  }
};


reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.book);
});
reviewSchema.pre('remove', function(next) {
    this._bookId = this.book;
    next();
});
reviewSchema.post('remove', function() {
    if (this._bookId) {
        this.constructor.calculateAverageRating(this._bookId);
    }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
