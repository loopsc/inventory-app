const db = require("../db/queries");

// TODO: Add queries for genre filtering?
const getAllBooks = async (req, res, next) => {
    const books = await db.fetchAllBooks();
    try {
        res.render("index", {
            title: "Home",
            books,
        });
    } catch (err) {
        next(err);
    }
};

const getBookById = async (req, res, next) => {
    try {
        res.render("bookDetails", {
            title: "Book Details",
            book: {
                title: "Crime and Punishment",
                author: "Fyodor Dostoevsky",
                genres: ["Psychological", "Philosophy", "Crime"],
            },
        });
    } catch (err) {
        next(err);
    }
};

// Render the page for creating a new book
const getNewBook = async (req, res, next) => {
    try {
        const genres = await db.fetchGenres();
        res.render("newBook", {
            title: "New Book",
            genres: genres,
        });
    } catch (err) {
        next(err);
    }
};

const postNewBook = async (req, res, next) => {
    try {
        await db.insertBook(req.body);
        res.redirect("/");
    } catch (err) {
        next(err);
    }
};

// Render the page for updating a book
const getUpdateBook = async (req, res, next) => {
    try {
        // Query the book from the id in req.params
        res.render("updateBook", {
            title: "Update Book",
            book: {
                title: "Crime and Punishment",
                author: "Fyodor Dostoevsky",
                genres: ["psychological", "philosophy"],
                isFiction: true,
                isRead: false,
            },
        });
    } catch (err) {
        next(err);
    }
};

// Function when book is updated
const postUpdateBook = async (req, res, next) => {
    try {
        console.log("Update book with the following: ", req.body);
        res.redirect("/");
    } catch (err) {
        next(err);
    }
};

const deleteBook = async (req, res, next) => {
    try {
        if (req.body.password !== process.env.USER_PASSWORD) {
            return res.sendStatus(403);
        }
        console.log(req.body.book.id);
        await db.deleteBook(req.body.book.id);
        res.sendStatus(204);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    getNewBook,
    postNewBook,
    getUpdateBook,
    postUpdateBook,
    deleteBook,
};
