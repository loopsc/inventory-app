require("dotenv").config();
const { Client } = require("pg");

// Run this code once to create tables

const SQL = `
CREATE TABLE IF NOT EXISTS authors (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ) UNIQUE
);

INSERT INTO authors (name)
VALUES
    ('Fyodor Dostoevsky'),
    ('Miguel de Cervantes'),
    ('Aristotle');

CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR ( 255 ),
    author_id INTEGER,
    is_fiction BOOLEAN,
    is_read BOOLEAN,
    FOREIGN KEY (author_id) REFERENCES authors(id)
);

INSERT INTO books (title, author_id, is_fiction, is_read)
VALUES
    ('Crime and Punishment', 1, TRUE, FALSE),
    ('Don Quixote', 2, TRUE, TRUE),
    ('Nicomachean Ethics', 3, FALSE, FALSE);

CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ) UNIQUE
);

INSERT INTO genres (name)
VALUES
    ('Crime'),
    ('Philosophy'),
    ('Psychological'),
    ('Comedy');

CREATE TABLE IF NOT EXISTS book_genres (
    book_id INTEGER,
    genre_id INTEGER,
    PRIMARY KEY (book_id, genre_id),
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (genre_id) REFERENCES genres(id)
);

INSERT INTO book_genres (book_id, genre_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 4),
    (3, 3);
`;

// Connects to database, runs a query to initialise tables then close client connection.
// To be used once just for initially creating tables

async function main() {
    console.log("populating db");
    const client = new Client({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("Success! Closing database connection");
}

main();
