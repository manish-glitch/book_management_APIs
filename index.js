require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");


const { parse } = require("dotenv");


//microservices routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");



//initialization of express
const booky= express();

//configuration
booky.use(express.json());

//estamblish database
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}
)
.then(()=>console.log("connection is established"));


//initializing microservices
booky.use("/book", Books);
booky.use("/author", Authors);
booky.use("/publication", Publications);

booky.listen(3000, ()=> console.log("server is running"));