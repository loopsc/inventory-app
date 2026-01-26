// Add queries for genre filtering?
const getAllBooks = async (req, res, next) => {
    try {
        res.render("index", {
            title: "Home",
            book: {
                id: 0,
            },
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

const getNewBook = async (req, res, next) => {
    try {
        res.render("newBook", {
            title: "New Book",
        });
    } catch (err) {
        next(err);
    }
};

const postNewBook = async (req, res, next) => {
    try {
        console.log("Form data:", req.body);
    } catch (err) {
        next(err);
    }
};

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
    } catch (error) {
        next(err);
    }
};

const postUpdateBook = async (req, res, next) => {
    try {
        console.log("Update book with the following: ", req.body);
        res.redirect("/");
    } catch (error) {
        next(err);
    }
};

const deleteBook = async (req, res, next) => {
    try {
        console.log("Validate and query db to delete book", req.params.bookId);
        res.sendStatus(204);
    } catch (error) {
        next(err)
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
