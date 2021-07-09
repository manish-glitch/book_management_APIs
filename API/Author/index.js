const Router = require("express").Router();

const bookModel = require("../../Database/book");
const authorModel = require("../../Database/author");


/*
Route        "/author"
Description  get all author
Access       public
Parameters   none
Methods      get
*/

Router.get("/", async (req,res)=>{
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

Router.get("/a/:aid", async (req,res)=>{

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
Router.get("/book/:isbn", async (req,res)=>{
    
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
Route        "/author/add"
Description  add new author
Access       public
Parameters   none
Methods      post
*/
Router.post("/add", async (req,res)=>{
    const {newAuthor} =  req.body;  //es6 property destructuring
    console.log(newAuthor);
    const addNewAuthor = await authorModel.create(newAuthor);
    console.log(addNewAuthor);
    
    //database.authors.push(newAuthor);
    return res.json({authors:addNewAuthor, message:"author added"}); 
});

/*
Route        "/author/update/"
Description  update author name
Access       public
Parameters   ID
Methods      put
*/
Router.put("/update/:id",async(req,res)=>{
    
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
});


/*
Route        "/author/update/book"
Description  add new book to author's book
Access       public
Parameters   ID
Methods      put
*/
Router.put("/update/book/:id", async (req,res)=>{
    const addBookAuthor= await authorModel.findOneAndUpdate(
        {
            ID: req.params.id,
        },
        {
            $addToSet:{
                books: req.body.newBook,
            },
        },
        {new:true}
        );
        return res.json({author:addBookAuthor});
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
Router.delete("/delete/:id", async (req,res)=>{
    const updatedAuthorDatabase= await authorModel.findOneAndDelete({ID: parseInt(req.params.id)});

    //     const  =database.authors.filter(
//         (author)=>author.ID!==parseInt(req.params.id)
//     );
// //filter will always return a new
//     database.authors = updatedAuthorDatabase;
    return res.json({authors:updatedAuthorDatabase});

});


module.exports = Router;