const mongoose = require("mongoose");

//creating book schema
const bookSchema = mongoose.Schema({
    ISBN: String,
    title: String,
    pubDate: String,
    language: String,
    numPage: Number,
    author: [Number],
    publication:[Number],
    category: [String],
});

//create a book model(document model of mongo DB)
const bookModel = mongoose.model(bookSchema);

module.exports = bookModel;