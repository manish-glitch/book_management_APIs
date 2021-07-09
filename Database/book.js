const mongoose = require("mongoose");

//creating book schema
const bookSchema = mongoose.Schema({
    ISBN: {
        type: String,
        required:true,
        minLength: 4,
        maxLength : 10,
    },
    title: String,
    pubDate: String,
    language: String,
    numPage: Number,
    author: [Number],
    publication:[Number],
    category: [String],
});

//create a book model(document model of mongo DB)
const bookModel = mongoose.model("books",bookSchema);

module.exports = bookModel;