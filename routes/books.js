const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}


/* GET book all books */
router.get('/', asyncHandler(async (req, res) => {

  const books = await Book.findAll({ // retrieve all of the books in the database
        order: [[ 'title', 'ASC' ]]  // order the books by title
  } );

  res.render("index", { books } ); // render the list of books

}));

/* Create a new book form. */
router.get('/new', (req, res) => {
  res.render("new", { book: {} });
});

/* POST create book */
router.post('/new', asyncHandler(async (req, res) => {
  console.log(req.body);
  let book;
  try {
    book = await Book.create(req.body);  
    res.redirect("/books/" + book.id);  
  } catch (error) {
    if(error.name === "SequelizeValidationError") { 
      book = await Book.build(req.body);
      res.render("books/error", { book, errors: error.errors})
    } else {
      throw error; 
    }
  }

}));





module.exports = router;
