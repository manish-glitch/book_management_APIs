const mongoose = require("mongoose");

const authorSchema= mongoose.Schema({
    ID:Number,
    name:String,
    books: [String],
});

const authorModel = mongoose.model("authors",authorSchema);

module.exports = authorModel;