require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
//database
const database=require("./Database/database");

//Models
const bookModel = require("./Database/book");
const authorModel = require("./Database/author");
const publicationModel = require("./Database/publication");
const { parse } = require("dotenv");

//initialization
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
/*
Route        "/"(root)
Description  get all books
Access       public
Parameters   none
Methods      get
*/
booky.get("/", async(req,res)=>{
    const getAllBooks= await bookModel.find();
    return res.json({books:getAllBooks});
}
);

/*
Route        "/is"
Description  get specific books
Access       public
Parameters   isbn
Methods      get
*/
booky.get("/is/:isbn", async(req, res)=>{
    const getSpecificBook= await bookModel.findOne({ISBN:req.params.isbn});
//if not found anything above will return null(false)
    //const getSpecificBook = database.books.filter(
      //  (book)=>book.ISBN === req.params.isbn
        //);
        //below we converted the null(false to true) by "!", so when above situation happens getspecificbook
        //will get null we will create null to true and then below if will take place
    if(!getSpecificBook){
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
booky.get("/c/:category", async (req,res)=>{
    const getSpecificBook = await bookModel.findOne({category: req.params.category,})
    
    //const getSpecificBook = database.books.filter(
      //  (book)=>book.category.includes(req.params.category)
    //);
    if(!getSpecificBook){
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
booky.get("/l/:lang", async (req,res)=>{
    
    const getSpecificBook= await bookModel.findOne({language : req.params.lang});
    
    //const getSpecificBook = database.books.filter(
        //(book)=>book.language.includes(req.params.lang)
   // );
    if(!getSpecificBook){
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

booky.get("/author", async (req,res)=>{
    const getAllAuthors = await authorModel.find();
    return res.json({authors:getAllAuthors});
});

/*
Route        "/author/a"
Description  get specific author
Access       public
Parameters   id
Methods      get
*/

booky.get("/author/a/:aid", async (req,res)=>{

    const getSpecificAuthor = await authorModel.findOne({ID:parseInt(req.params.aid)})

    //const getSpecificAuthor = database.authors.filter(
      //  (author)=>author.ID === parseInt(req.params.aid)
        //);
        
    if(!getSpecificAuthor){
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
booky.get("/author/book/:isbn", async (req,res)=>{
    
    const getSpecificAuthor = await authorModel.find({books:req.params.isbn})

    //const getSpecificAuthor = database.authors.filter(
      //  (author)=>author.books.includes(req.params.isbn)
    //);
    if(!getSpecificAuthor){
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
booky.get("/publication", async (req,res)=>{
    const getAllPub= await publicationModel.find();
    return res.json({publications:getAllPub});
});

/*
Route        "/publication/id"
Description  get specific publication
Access       public
Parameters   id
Methods      get
*/
booky.get("/publication/pid/:id", async (req,res)=>{

    const getSpecificPub= await publicationModel.findOne({id:req.params.id})
    
    //const getSpecificPub = database.publications.filter(
      //  (publication)=>publication.id === parseInt(req.params.id)
        //);
        
    if(!getSpecificPub){
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
booky.post("/book/add", async (req,res)=>{
    const {newBook}= req.body;
    

    const addNewBook = await bookModel.create(newBook);
   

   // database.books.push(newBook);
    return res.json({books:addNewBook, message:"book is added"});
})


/*
Route        "/author/add"
Description  add new author
Access       public
Parameters   none
Methods      post
*/
booky.post("/author/add", async (req,res)=>{
    const {newAuthor} =  req.body;  //es6 property destructuring
    console.log(newAuthor);
    const addNewAuthor = await authorModel.create(newAuthor);
    console.log(addNewAuthor);
    
    //database.authors.push(newAuthor);
    return res.json({authors:addNewAuthor, message:"author added"}); 
});

/*
Route        "/publication/add"
Description  add new publication
Access       public
Parameters   none
Methods      post
*/
booky.post("/publication/add", async(req,res)=>{
    const {newPub} = req.body;  //es6 property destructuring
    console.log(newPub);
    await publicationModel.create(newPub);
    //database.publications.push(newPub);
    return res.json({publications:newPub, message:"publication added"}); 
});
/*
Route        "/book/update/title/"
Description  update book title
Access       public
Parameters   isbn
Methods      put
*/

booky.put("/book/update/title/:isbn", async (req,res)=>{

    const updatedBook = await bookModel.findOneAndUpdate(
        {
        ISBN: req.params.isbn,
        },
        
        {
            title: req.body.newBookTitle,
        },
        {
            new: true,
        }
);

    //using forEach
    //database.books.forEach((book)=>{
      //  if(book.ISBN===req.params.isbn){
        //    book.title=req.body.newBookTitle;
          //  return;
       // }
    //});
    return res.json({books:updatedBook});
});

/*
Route        "/book/update/author"
Description  update/add new author for book
Access       public
Parameters   isbn
Methods      put
*/
booky.put("/book/update/author/:isbn", async(req,res)=>{
    //update book database
    const updatedBookAuthor = await bookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {//as author is array we need to addToSet as author id should not repeat 
            $addToSet:{
                author: req.body.authorId,
            },
        },
        {
            new : true,
        }
        
)
    //update author database
    const updatedAuthorBook = await authorModel.findOneAndUpdate(
        {
            ID: req.body.authorId,
        },
        {//as books is array we will use addtoset beacause we dont want same book double
            $addToSet:{
                books: req.params.isbn,
            },
    
        },
        {
            new:true,
        }
    );

    //update book database
    //database.books.forEach((book)=>{
      //  if(book.ISBN===req.params.isbn){
        //    return book.author.push(parseInt(req.params.authorId));
        //}
    //})
    //update author database
    //database.authors.forEach((author)=>{
      //  if(author.ID===parseInt(req.params.authorId))
        //    return author.books.push(req.params.isbn);
    //});

    return res.json({books:updatedBookAuthor, author:updatedAuthorBook});
});

/*
Route        "/author/update/"
Description  update author name
Access       public
Parameters   ID
Methods      put
*/
booky.put("/author/update/:id",async(req,res)=>{
    
    const authorNewName = await authorModel.findOneAndUpdate(
       {
            ID: parseInt(req.params.id),
       },
       {
           name:req.body.newName,
       },
       {
           new:true,
       }
       
);
   
   
    //database.authors.forEach((author)=>{
      //  if(author.ID===parseInt(req.params.id)){
        //    author.name=req.body.newName;
          //  return;
        //}
    //});
    return res.json({author:authorNewName});
})
/*
Route        "/publication/update/"
Description  update publication name
Access       public
Parameters   id
Methods      put
*/
booky.put("/publication/update/:id",async(req,res)=>{
   
    const newPubName = await publicationModel.findOneAndUpdate(
        {
            id:parseInt(req.params.id),
        },
        {
            name: req.body.newName,
        },
        {
            new:true,
        }
);
   
   
    // database.publications.forEach((publication)=>{
     //   if(publication.id===parseInt(req.params.id)){
       //     publication.name=req.body.newPubName;
         //   return;
        //}
    //});
    return res.json({publications:newPubName});
})

/*
Route        "/publication/update/book"
Description  update/add book to publication
Access       public
Parameters   isbn
Methods      put
*/
booky.put("/publication/update/book/:isbn",async(req,res)=>{
    //update publication database
    const newPub= await publicationModel.findOneAndUpdate(
        {
            Id: req.body.pubId,
        },
        {
            $addToSet:{
                books: req.params.isbn
            },
        },
        {
            new:true,
        }
);
   
    const newPubBook= await bookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
            
        },
        {
            $addToSet:{
                publication: req.body.pubId,
            },
        },
        {
            new : true,
        }
);
    //update publication database
   // database.publications.forEach((publication)=>{
     //   if(publication.id===req.body.pubId){
       //     return publication.books.push(req.params.isbn)
        //}
    //});
    //update book database
    //database.books.forEach((book)=>{
      //  if(book.ISBN===req.params.isbn){
        //    return book.publication=req.body.pubId;
            
       // }
    //});
    return res.json({
        books:newPubBook,
        publications:newPub,
        message:"all work done without any error",
    });
})

/*
Route        "/book/delete"
Description  delete book
Access       public
Parameters   isbn
Methods      delete
here we are preparing a whole database with removal of respective 
book (provided isbn) with new databse. we dont have to do this in 
mongoDB database
*/

booky.delete("/book/delete/:isbn", async (req,res)=>{
    
    const updatedBookDatabase= await bookModel.findOneAndDelete({ISBN: req.params.isbn});
     //bestest logic ever here we found author who is having the same book that we are deleting
     //so that means we should also remove the respective book from the author's books array
     //we did it by matching the book's isbn in authors books array by using $in and then pulled that book out
     //fucking awsome
    const relatedAuthor = await authorModel.findOneAndUpdate(
        {books:{$in:[req.params.isbn]}},
        {$pull:{books:req.params.isbn}},
        {new:true},
        
    );
    
    const relatedPub = await publicationModel.findOneAndUpdate(
        {books:{$in:[req.params.isbn]}},
        {$pull:{books:req.params.isbn}},
        {new:true},
        
    );
    //const updatedBookDatabase =database.books.filter(
      //  (book)=>book.ISBN!==req.params.isbn
    //);
//filter will always return a new
    //database.books = updatedBookDatabase;
    return res.json({books:updatedBookDatabase,authors:relatedAuthor,publications:relatedPub, message:"deleted book"});

});


/*
Route        "/book/delete/author"
Description  delete an author form book
Access       public
Parameters   isbn,authorId
Methods      delete
*/
booky.delete("/book/delete/author/:isbn/:authorId",async(req,res)=>{
    //update book data

    const updatedBook = await bookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            $pull:{
                author: parseInt(req.params.authorId),
            },
        },
        {new:true},
    );
        //update author data
        const updatedAuthor= await authorModel.findOneAndUpdate(
            {
                ID:parseInt(req.params.authorId),
            },
            {
                $pull:{
                    books: req.params.isbn,
                },
            },
            {new:true},
        );

    // database.books.forEach((book)=>{
    //     if(book.ISBN === req.params.isbn){
    //         const newAuthorList = book.author.filter(
    //             (author)=> author  !== parseInt(req.params.authorId));
    //         book.author= newAuthorList;
            
    //         return;
    //     }
    // });

    //update author database
    // database.authors.forEach((author)=>{
    //     if(author.ID===parseInt(req.params.authorId)){
    //         const newBooksList= author.books.filter(
    //             (book)=> book !== req.params.isbn
    //             );
    //             author.books=newBooksList;
    //             return;
    //     }
    // });
    return res.json({books:updatedBook, author:updatedAuthor, message:"author deleted"})
});

/*
Route        "/author/delete"
Description  delete author
Access       public
Parameters   ID
Methods      delete
here we are preparing a whole database with removal of respective 
author (provided id) with new databse. we dont have to do this in 
mongoDB database
*/
booky.delete("/author/delete/:id", async (req,res)=>{
    const updatedAuthorDatabase= await authorModel.findOneAndDelete({ID: parseInt(req.params.id)});

    //     const  =database.authors.filter(
//         (author)=>author.ID!==parseInt(req.params.id)
//     );
// //filter will always return a new
//     database.authors = updatedAuthorDatabase;
    return res.json({authors:updatedAuthorDatabase});

});

/*
Route        "/publication/delete"
Description  delete publication
Access       public
Parameters   id
Methods      delete
here we are preparing a whole database with removal of respective 
publication (provided id) with new databse. we dont have to do this in 
mongoDB database
*/
booky.delete("/publication/delete/:id",async (req,res)=>{
    const updatedPublicationDatabase= await publicationModel.findOneAndDelete({Id: parseInt(req.params.id)});

    //     const updatedPublicationDatabase =database.publications.filter(
//         (publication)=>publication.id!==parseInt(req.params.id)
//     );
// //filter will always return a new
//     database.publications = updatedPublicationDatabase;
    return res.json({publications:updatedPublicationDatabase});

});


/*
Route        "/publication/delete/book"
Description  delete a book  form publication
Access       public
Parameters   isbn, publication id
Methods      delete
*/
booky.delete("/publication/delete/book/:isbn/:pubId",(req,res)=>{
    //update publication data
    database.publications.forEach((publication)=>{
        if(publication.id === parseInt(req.params.pubId)){
            const newBookList = publication.books.filter(
                (book)=> book  !== req.params.isbn
            );
            publication.books= newBookList; 
            return;
        }
    });

    //update book database
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            const newPubList= book.publication.filter(
                (publication)=> publication !== parseInt(req.params.pubId)
                );
            book.publication=newPubList;
            return;
        }
    });
    return res.json({publications:database.publications, books:database.books, message:"book deleted"})
});

booky.listen(3000, ()=> console.log("server is running"));