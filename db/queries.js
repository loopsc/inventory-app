const pool = require("./pool");

const fetchAllBooks = async () => {
    const { rows } = await pool.query(
        `SELECT b.id, b.title, a.name AS author, STRING_AGG(g.name, ', ') AS genres, b.is_read, b.is_fiction
            FROM books b
            JOIN authors a ON b.author_id = a.id
            JOIN book_genres bg ON b.id = bg.book_id
            JOIN genres g ON bg.genre_id = g.id
            GROUP BY b.id, a.name;`,
    );
    return rows;
};

const deleteBook = async (bookId) => {
    await pool.query("DELETE FROM books WHERE id = $1;", [bookId]);
};

module.exports = { fetchAllBooks, deleteBook };
