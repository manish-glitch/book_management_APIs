const mongoose = require("mongoose");

const authorSchema= mongoose.Schema({
    ID: Number,
    name: String,
    books: [String],
})

const authorModel = mongoose.model(authorSchema);

module.exports = authorModel;