const mongoose = require("mongoose");

const publicationSchema= mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});

const publicationModel = mongoose.model("publications",publicationSchema);

module.exports = publicationModel;