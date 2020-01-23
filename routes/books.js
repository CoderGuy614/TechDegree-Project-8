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
  res.render("new-book", { book: {} });
});

/* POST create book */
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("books/new", { book, errors: error.errors, title: "New book" })
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }  
  }
}));



module.exports = router;
