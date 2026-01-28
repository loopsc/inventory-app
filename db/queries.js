const pool = require("./pool");

const fetchAllBooks = async (req, res) => {
    const { rows } = await pool.query(
        `SELECT b.title, a.name AS author, STRING_AGG(g.name, ', ') AS genres, b.is_read, b.is_fiction
            FROM books b
            JOIN authors a ON b.author_id = a.id
            JOIN book_genres bg ON b.id = bg.book_id
            JOIN genres g ON bg.genre_id = g.id
            GROUP BY b.id, a.name;`,
    );
    console.log(rows);
    return rows;
};

module.exports = { fetchAllBooks };
