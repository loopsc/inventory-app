const { Router } = require("express");
const booksController = require("../controllers/booksController");
const booksRouter = Router();

booksRouter.get("/", booksController.getAllBooks);
booksRouter.get("/books/:bookId", booksController.getBookById);
booksRouter.get("/new", booksController.getNewBook);
booksRouter.post("/new", booksController.postNewBook);
booksRouter.get("/update/:bookId", booksController.getUpdateBook);
booksRouter.post("/update/:bookId", booksController.postUpdateBook);
booksRouter.delete("/books/:bookId", booksController.deleteBook);

module.exports = booksRouter;
