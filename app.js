require("dotenv").config();
const express = require("express");
const app = express();
const booksRouter = require("./routes/booksRouter");
const errorHandler = require("./middlewares/error");

// For rendering ejs files
const path = require("node:path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//For working with forms
app.use(express.urlencoded({ extended: true }));
// For serving CSS
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.use(express.json());

app.locals.links = [
    { href: "/", text: "Home" },
    { href: "/new", text: "New Book" },
];

app.use("/", booksRouter);
app.use(errorHandler);

app.listen(3000, (error) => {
    if (error) {
        throw error;
    }
    console.log("Server started successfully");
});
