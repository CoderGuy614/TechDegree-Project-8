var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}


/* GET book listings. */
router.get('/', asyncHandler(async (req, res) => {

  const books = await Book.findAll({ // retrieve all of the books in the database
        order: [[ 'title', 'ASC' ]]  // order the books by title
  } );

  res.render("index", { books } ); //render the books list via the index view by passing the books local

}));

/* Create a new book form. */
router.get('/new', (req, res) => {
  res.render("new", { book: {} });
});

/* POST create book */
router.post('/', asyncHandler(async (req, res) => {
  // create a new book
  let book;
  try {
    book = await Book.create(req.body);  // pass request body to the create method
    res.redirect("/books/" + book.id);   // redirect to the books/id path after created
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // check for the SequelizeValidationError error
      book = await Book.build(req.body);
      res.render("books/form-error", { book, errors: error.errors})
    } else {
      throw error; // throw error to asyncHandler's catch block
    }
  }

}));





module.exports = router;
