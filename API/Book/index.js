//prefix book

const Router = require("express").Router();

const bookModel = require("../../Database/book");
const authorModel = require("../../Database/author");
const publicationModel = require("../../Database/publication");


/*
Route        "/"(root)
Description  get all books
Access       public
Parameters   none
Methods      get
*/
Router.get("/", async(req,res)=>{
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
Router.get("/is/:isbn", async(req, res)=>{
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
Router.get("/c/:category", async (req,res)=>{
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
Router.get("/l/:lang", async (req,res)=>{
    
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
Route        "/book/add"
Description  add new book
Access       public
Parameters   none
Methods      post
*/
Router.post("/add", async (req,res)=>{
    try {
        const {newBook}= req.body;
    

        const addNewBook = await bookModel.create(newBook);
        
     
       // database.books.push(newBook);
        return res.json({books:addNewBook, message:"book is added"});
    } catch (error) {
        return res.json({error: error.message});
    }
   
});

/*
Route        "/book/update/title/"
Description  update book title
Access       public
Parameters   isbn
Methods      put
*/

Router.put("/update/title/:isbn", async (req,res)=>{

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
Router.put("/update/author/:isbn", async(req,res)=>{
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
Route        "/book/delete"
Description  delete book
Access       public
Parameters   isbn
Methods      delete
here we are preparing a whole database with removal of respective 
book (provided isbn) with new databse. we dont have to do this in 
mongoDB database
*/

Router.delete("/delete/:isbn", async (req,res)=>{
    
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
Router.delete("/delete/author/:isbn/:authorId",async(req,res)=>{
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


module.exports = Router;