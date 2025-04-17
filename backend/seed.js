// Purpose: Script to seed the database with initial book data.
// Usage: node seed.js  (to import data)
//        node seed.js -d (to destroy data)

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load models
const Book = require('./models/Book'); // Adjust path if needed

// Load env vars
dotenv.config(); // Ensure your .env file is in the root or adjust path

// --- Book Data to Seed ---
// Using Project Gutenberg Covers API images
// Initial averageRating set to null to represent "unrated"
const booksToSeed = [
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A classic novel focusing on Elizabeth Bennet as she deals with issues of manners, upbringing, morality, education, and marriage in the society of the landed gentry of the British Regency.",
    genre: "Classic Romance",
    publicationDate: new Date("1813-01-28"),
    coverImageUrl: "https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg",
    averageRating: null // Represents "unrated"
  },
  {
    title: "Moby Dick; or The Whale",
    author: "Herman Melville",
    description: "The narrative of the obsessive quest of Ahab, captain of the whaling ship Pequod, for revenge on Moby Dick, the giant white sperm whale that bit off his leg on the previous voyage.",
    genre: "Adventure Fiction",
    publicationDate: new Date("1851-10-18"),
    coverImageUrl: "https://www.gutenberg.org/cache/epub/2701/pg2701.cover.medium.jpg",
    averageRating: null 
  },
  {
    title: "Frankenstein; Or, The Modern Prometheus",
    author: "Mary Wollstonecraft Shelley",
    description: "A novel about eccentric scientist Victor Frankenstein, who creates a grotesque creature in an unorthodox scientific experiment.",
    genre: "Gothic Fiction",
    publicationDate: new Date("1818-01-01"),
    coverImageUrl: "https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg",
    averageRating: null 
  },
  {
    title: "The War of the Worlds",
    author: "H. G. Wells",
    description: "An early science fiction novel which describes an invasion of Earth by Martians.",
    genre: "Science Fiction",
    publicationDate: new Date("1898-01-01"), 
    coverImageUrl: "https://www.gutenberg.org/cache/epub/36/pg36.cover.medium.jpg",
    averageRating: null
  },
  {
    title: "Treasure Island",
    author: "Robert Louis Stevenson",
    description: "An adventure novel narrating a tale of 'buccaneers and buried gold'. Its influence is enormous on popular perceptions of pirates.",
    genre: "Adventure",
    publicationDate: new Date("1883-11-14"),
    coverImageUrl: "https://www.gutenberg.org/cache/epub/120/pg120.cover.medium.jpg",
    averageRating: null 
  },
  {
    title: "The Adventures of Tom Sawyer",
    author: "Mark Twain",
    description: "A novel about a young boy growing up along the Mississippi River. It is set in the 1840s in the fictional town of St. Petersburg.",
    genre: "Adventure",
    publicationDate: new Date("1876-12-01"), 
    coverImageUrl: "https://www.gutenberg.org/cache/epub/74/pg74.cover.medium.jpg",
    averageRating: null 
  },
  {
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    description: "A collection of twelve short stories featuring the fictional detective Sherlock Holmes.",
    genre: "Mystery",
    publicationDate: new Date("1892-10-14"),
    coverImageUrl: "https://www.gutenberg.org/cache/epub/1661/pg1661.cover.medium.jpg",
    averageRating: null
  },
  {
    title: "Meditations",
    author: "Marcus Aurelius",
    description: "A series of personal writings by the Roman Emperor Marcus Aurelius, recording his private notes to himself and ideas on Stoic philosophy.",
    genre: "Philosophy",
    coverImageUrl: "https://www.gutenberg.org/cache/epub/2680/pg2680.cover.medium.jpg",
    averageRating: null 
  },
];

// --- Seeding Function ---
const importData = async () => {
  try {
    // Connect to DB
    await connectDB();
    console.log('Database connected for seeding...');

    // Optional: Clear existing books before seeding
    await Book.deleteMany();
    console.log('Existing books cleared...');

    // Insert the new book data
    // Note: If your Book model requires 'addedBy', you'll need to find an admin user's ID first
    // and add it to each book object before inserting.
    await Book.insertMany(booksToSeed);

    console.log('Data Imported Successfully!');
    mongoose.connection.close(); // Close connection
    process.exit(); // Exit script after success
  } catch (error) {
    console.error(`Error seeding data: ${error}`);
    mongoose.connection.close(); // Ensure connection is closed on error
    process.exit(1); // Exit script with error
  }
};

// --- Destruction Function (Optional) ---
const destroyData = async () => {
  try {
     // Connect to DB
    await connectDB();
    console.log('Database connected for destruction...');

    await Book.deleteMany();
    // await Review.deleteMany(); // Also delete related reviews if needed
    console.log('Book Data Destroyed Successfully!');
    mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error}`);
    mongoose.connection.close();
    process.exit(1);
  }
};

// --- Script Execution Logic ---
// Check command line arguments to decide whether to import or destroy
if (process.argv[2] === '-d') { // Pass '-d' flag to destroy data
  destroyData();
} else {
  importData(); // Default action is to import
}
