
const Router = require("express").Router();

const bookModel = require("../../Database/book");
const authorModel = require("../../Database/author");
const publicationModel = require("../../Database/publication");

/*
Route        "/publication"
Description  get all publication
Access       public
Parameters   none
Methods      get
*/
Router.get("/", async (req,res)=>{
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
Router.get("/pid/:id", async (req,res)=>{

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
Route        "/publication/add"
Description  add new publication
Access       public
Parameters   none
Methods      post
*/
Router.post("/add", async(req,res)=>{
    const {newPub} = req.body;  //es6 property destructuring
    console.log(newPub);
    await publicationModel.create(newPub);
    //database.publications.push(newPub);
    return res.json({publications:newPub, message:"publication added"}); 
});

/*
Route        "/publication/update/"
Description  update publication name
Access       public
Parameters   id
Methods      put
*/
Router.put("/update/:id",async(req,res)=>{
   
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
Router.put("/update/book/:isbn",async(req,res)=>{
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
Route        "/publication/delete"
Description  delete publication
Access       public
Parameters   id
Methods      delete
here we are preparing a whole database with removal of respective 
publication (provided id) with new databse. we dont have to do this in 
mongoDB database
*/
Router.delete("/delete/:id",async (req,res)=>{
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
Router.delete("/delete/book/:isbn/:pubId",(req,res)=>{
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

module.exports = Router;