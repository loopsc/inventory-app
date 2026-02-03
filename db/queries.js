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

const fetchBook = async (id) => {
    const { rows } = await pool.query(
        `SELECT b.id, b.title, a.name AS author, STRING_AGG(g.name, ', ') AS genres, b.is_read, b.is_fiction
            FROM books b
            JOIN authors a ON b.author_id = a.id
            JOIN book_genres bg ON b.id = bg.book_id
            JOIN genres g ON bg.genre_id = g.id
            WHERE b.id = ($1)
            GROUP BY b.id, a.name;`,
        [id],
    );
    return rows;
};

// prettier-ignore
const insertBook = async (bookData, genres) => {

    // Create or find author
    let res = await pool.query("SELECT id FROM authors WHERE name = ($1)", [bookData.author]);
    let authorId;
    if (res.rowCount !== 0) {
        authorId = res.rows[0].id;
    } else {
        res = await pool.query("INSERT INTO authors (name) VALUES ($1) RETURNING id", [bookData.author])
        authorId = res.rows[0].id
    }

    // Insert book
    // is_read and is_fiction is stored as boolean in database
    const isFiction = bookData.isFiction === "fiction"
    const isRead = bookData.isRead === "read"
    res = await pool.query("INSERT INTO books (title, author_id, is_fiction, is_read) VALUES ($1, $2, $3, $4) RETURNING id", [
        bookData.title, authorId, isFiction, isRead
    ])
    const bookId = res.rows[0].id;

    // Link genres to book
    res = await pool.query("SELECT id FROM genres WHERE name = ANY($1)", [genres]);
    const genreIds = res.rows.map(row => row.id)
    const insertValues = genreIds.map((genreId) => `(${bookId}, ${genreId})`).join(", ");
    await pool.query(`INSERT INTO book_genres (book_id, genre_id) VALUES ${insertValues}`);
};

// prettier-ignore
const updateBook = async (book, bookId) => {
    const isRead = book.isRead === 'read';
    const isFiction = book.isFiction === 'fiction';

    const genres = Array.isArray(book.genres)
        ? book.genres
        : [book.genres];

    try {
        await pool.query("BEGIN");

        // author
        let res = await pool.query("SELECT id FROM authors WHERE name = $1", [book.author]);

        let authorId;

        if (res.rowCount > 0) {
            authorId = res.rows[0].id;
        } else {
            res = await pool.query(
                "INSERT INTO authors (name) VALUES ($1) RETURNING id",
                [book.author]
            );
            authorId = res.rows[0].id;
        }

        // update book
        await pool.query(
            `UPDATE books SET title = $1, author_id = $2, is_read = $3, is_fiction = $4 WHERE id = $5`,
            [book.title, authorId, isRead, isFiction, bookId]
        );

        // remove old genres
        await pool.query(
            "DELETE FROM book_genres WHERE book_id = $1",
            [bookId]
        );

        // add new genres
        if (genres) {
            res = await pool.query(
                "SELECT id FROM genres WHERE name = ANY($1)",
                [genres]
            );

            const genreIds = res.rows.map(r => r.id);

            if (genreIds.length > 0) {
                await pool.query(
                    `INSERT INTO book_genres (book_id, genre_id) SELECT $1, UNNEST($2::int[])`,
                    [bookId, genreIds]
                );
            }
        }

        await pool.query("COMMIT");

    } catch (err) {
        await pool.query("ROLLBACK");
        throw err;
    }
};

const deleteBook = async (bookId) => {
    await pool.query("DELETE FROM books WHERE id = ($1);", [bookId]);
};

const fetchGenres = async () => {
    const { rows } = await pool.query("SELECT * FROM genres;");
    const genres = rows.map((row) => row.name);
    return genres;
};

module.exports = {
    fetchAllBooks,
    fetchBook,
    insertBook,
    deleteBook,
    fetchGenres,
    updateBook,
};
