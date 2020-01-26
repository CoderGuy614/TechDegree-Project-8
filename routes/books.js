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


// /* GET individual book. */
router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
   if(book) {
    res.render("show", { book, title: book.title });
   } else{
     res.sendStatus(404);
   }
}));

/* POST create book */
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: error.errors, title: "New book" })
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }  
  }
}));

/* Delete book form. */
router.get("/:id/delete", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
    res.render("delete", { book, title: "Delete book" });
  } else {
    res.sendStatus(404);
  }
}));

/* Delete individual book. */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
}));


/* Update an individual book  - GET */
router.get("/:id/update-book", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
   if(book) {
    res.render("update-book", { book });
   } else{
     res.sendStatus(404);
   }
}));


/* Update an individual book - POST */
router.post('/:id/update-book', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books"); 
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // to update the desired book
      res.render("update-book", { book, errors: error.errors })
    } else {
      throw error;
    }
  }
}));
module.exports = router;
