const express = require("express");
//database
const database=require("./database");

//initialization
const booky= express();

//configuration
booky.use(express.json());
/*
Route        "/"(root)
Description  get all books
Access       public
Parameters   none
Methods      get
*/
booky.get("/", (req,res)=>{
    return res.json({books: database.books});
}
);

/*
Route        "/is"
Description  get specific books
Access       public
Parameters   isbn
Methods      get
*/
booky.get("/is/:isbn", (req, res)=>{
    const getSpecificBook = database.books.filter(
        (book)=>book.ISBN === req.params.isbn
        );
        
    if(getSpecificBook.length===0){
        return res.json({error: `no book found for the ISBN of ${req.params.isbn}`},)
    }

    return res.json({book:getSpecificBook});
});
/*
Route        "/c"
Description  get books acording to category
Access       public
Parameters   category
Methods      get
*/
booky.get("/c/:category", (req,res)=>{
    const getSpecificBook = database.books.filter(
        (book)=>book.category.includes(req.params.category)
    );
    if(getSpecificBook.length===0){
        return res.json({error:`no book found for category of ${req.params.category}`})
    }
    return res.json({book:getSpecificBook});

});



/*
Route        "/l"
Description  get books acording to lang
Access       public
Parameters   language
Methods      get
*/
booky.get("/l/:lang", (req,res)=>{
    const getSpecificBook = database.books.filter(
        (book)=>book.language.includes(req.params.lang)
    );
    if(getSpecificBook.length===0){
        return res.json({error:`no book found for lang of ${req.params.lang}`})
    }
    return res.json({book:getSpecificBook});

});

/*
Route        "/author"
Description  get all author
Access       public
Parameters   none
Methods      get
*/

booky.get("/author", (req,res)=>{
    return res.json({authors:database.authors});
});

/*
Route        "/author/a"
Description  get specific author
Access       public
Parameters   id
Methods      get
*/

booky.get("/author/a/:aid", (req,res)=>{
    let id=req.params.aid;
    let authId=Number(id);
    const getSpecificAuthor = database.authors.filter(
        (author)=>author.ID === authId
        );
        
    if(getSpecificAuthor.length===0){
        return res.json({error: `no author found for the id of ${req.params.aid}`},)
    }

    return res.json({author:getSpecificAuthor});
});


/*
Route        "/author/book"
Description  get all athor based on books
Access       public
Parameters   isbn
Methods      get
*/
booky.get("/author/book/:isbn", (req,res)=>{
    const getSpecificAuthor = database.authors.filter(
        (author)=>author.books.includes(req.params.isbn)
    );
    if(getSpecificAuthor.length===0){
        return res.json({error:`no author found for book of ${req.params.isbn}`})
    }
    return res.json({book:getSpecificAuthor});

});

/*
Route        "/publication"
Description  get all publication
Access       public
Parameters   none
Methods      get
*/
booky.get("/publication", (req,res)=>{
    return res.json({publications:database.publications});
});

/*
Route        "/publication/id"
Description  get specific publication
Access       public
Parameters   id
Methods      get
*/
booky.get("/publication/pid/:id", (req,res)=>{
    let id=req.params.id;
    let pubId=Number(id);
    const getSpecificPub = database.publications.filter(
        (publication)=>publication.id === pubId
        );
        
    if(getSpecificPub.length===0){
        return res.json({error: `no publication found for the id of ${req.params.id}`},)
    }

    return res.json({publication:getSpecificPub});
});

/*
Route        "/book/add"
Description  add new book
Access       public
Parameters   none
Methods      post
*/
booky.post("/book/add",(req,res)=>{
    const {newBook}=req.body;
    database.books.push(newBook);
    return res.json({books:database.books});
})


/*
Route        "/author/add"
Description  add new author
Access       public
Parameters   none
Methods      post
*/
booky.post("/author/add", (req,res)=>{
    const {newAuthor} = req.body;  //es6 property destructuring
    database.authors.push(newAuthor);
    return res.json({authors:database.authors}); 
});

/*
Route        "/publication/add"
Description  add new publication
Access       public
Parameters   none
Methods      post
*/
booky.post("/publication/add", (req,res)=>{
    const {newPub} = req.body;  //es6 property destructuring
    database.publications.push(newPub);
    return res.json({publications:database.publications}); 
});
/*
Route        "/book/update/title/"
Description  update book title
Access       public
Parameters   isbn
Methods      put
*/

booky.put("/book/update/title/:isbn",(req,res)=>{
    //using forEach
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            book.title=req.body.newBookTitle;
            return;
        }
    });
    return res.json({books:database.books});
});

/*
Route        "/book/update/author"
Description  update/add new author for book
Access       public
Parameters   isbn
Methods      put
*/
booky.put("/book/update/author/:isbn/:authorId",(req,res)=>{
    //update book database
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            return book.author.push(parseInt(req.params.authorId));
        }
    })
    //update author database
    database.authors.forEach((author)=>{
        if(author.ID===parseInt(req.params.authorId))
            return author.books.push(req.params.isbn);
    });

    return res.json({books:database.books, author:database.authors});
});

/*
Route        "/author/update/"
Description  update author name
Access       public
Parameters   ID
Methods      put
*/
booky.put("/author/update/:id",(req,res)=>{
    database.authors.forEach((author)=>{
        if(author.ID===parseInt(req.params.id)){
            author.name=req.body.newName;
            return;
        }
    });
    return res.json({author:database.authors});
})
/*
Route        "/publication/update/"
Description  update publication name
Access       public
Parameters   id
Methods      put
*/
booky.put("/publication/update/:id",(req,res)=>{
    database.publications.forEach((publication)=>{
        if(publication.id===parseInt(req.params.id)){
            publication.name=req.body.newPubName;
            return;
        }
    });
    return res.json({publications:database.publications});
})

/*
Route        "/publication/update/book"
Description  update/add book to publication
Access       public
Parameters   isbn
Methods      put
*/
booky.put("/publication/update/book/:isbn",(req,res)=>{
    //update publication database
    database.publications.forEach((publication)=>{
        if(publication.id===req.body.pubId){
            return publication.books.push(req.params.isbn)
        }
    });
    //update book database
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            return book.publication=req.body.pubId;
            
        }
    });
    return res.json({
        books:database.books,
        publications:database.publications,
        message:"all work done without any error",
    });
})

booky.listen(3000, ()=> console.log("server is running"));