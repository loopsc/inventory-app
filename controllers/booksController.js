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

// const getBookById = async (req, res, next) => {
//     try {
//         res.render("bookDetails", {
//             title: "Book Details",
//             book: {
//                 title: "Crime and Punishment",
//                 author: "Fyodor Dostoevsky",
//                 genres: ["Psychological", "Philosophy", "Crime"],
//             },
//         });
//     } catch (err) {
//         next(err);
//     }
// };

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
        const genres = Array.isArray(req.body.genres)
            ? req.body.genres
            : [req.body.genres];

        await db.insertBook(req.body, genres);
        res.redirect("/");
    } catch (err) {
        next(err);
    }
};

// Render the page for updating a book
const getUpdateBook = async (req, res, next) => {
    try {
        const genres = await db.fetchGenres();
        const rows = await db.fetchBook(req.params.bookId);

        const book = rows[0];

        res.render("updateBook", {
            title: "Update Book",
            book,
            genres,
        });
    } catch (err) {
        next(err);
    }
};

// Function when book is updated
const postUpdateBook = async (req, res, next) => {
    try {
        console.log("Book ID: ", req.params.bookId)
        await db.updateBook(req.body, Number(req.params.bookId));
        res.redirect("/");
    } catch (err) {
        console.log(err);
        next(err);
    }
};

const deleteBook = async (req, res, next) => {
    try {
        if (req.body.password !== process.env.USER_PASSWORD) {
            return res.sendStatus(403);
        }
        await db.deleteBook(req.body.book.id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllBooks,
    getNewBook,
    postNewBook,
    getUpdateBook,
    postUpdateBook,
    deleteBook,
};
