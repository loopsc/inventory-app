const pool = require("./pool");

// TODO: Sort in alphabetical order
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

// prettier-ignore
const insertBook = async (bookData) => {

    // Create or find author
    let isAuthorExist = await pool.query("SELECT id FROM authors WHERE name = $1", [bookData.author]);
    let authorId;
    if (isAuthorExist.rows.length) {
        authorId = isAuthorExist.rows[0].id;
    } else {
        isAuthorExist = await pool.query("INSERT INTO authors (name) VALUES $1 RETURNING id", [bookData.author])
        authorId = isAuthorExist.rows[0].id
    }

    // Insert book
    const isFiction = bookData.isFiction === "fiction"
    const isRead = bookData.isRead === "read"
    let res = await pool.query("INSERT INTO books (title, author_id, is_fiction, is_read) VALUES ($1, $2, $3, $4) RETURNING id", [
        bookData.title, authorId, isFiction, isRead
    ])
    const bookId = res.rows[0].id;

    // Link genres to book
    res = await pool.query("SELECT id FROM genres WHERE name = ANY($1)", [bookData.genres]);
    const genreIds = res.rows.map(row => row.id)
    const insertValues = genreIds.map((genreId) => `(${bookId}, ${genreId})`).join(", ");
    await pool.query(`INSERT INTO book_genres (book_id, genre_id) VALUES ${insertValues}`);
};

const deleteBook = async (bookId) => {
    await pool.query("DELETE FROM books WHERE id = $1;", [bookId]);
};

const fetchGenres = async () => {
    const { rows } = await pool.query("SELECT * FROM genres;");
    const genres = rows.map((row) => row.name);
    return genres;
};

module.exports = { fetchAllBooks, insertBook, deleteBook, fetchGenres };
