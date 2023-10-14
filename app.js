"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.send("Welcome to our page. Please enter an endpoint like <br> /books?name=book_name to get the details about that book");
});
app.get('/books', function (req, res) {
    if (req.query.name === undefined) {
        res.status(400).send('Invalid query. Please provide a valid "name" query parameter.');
        return;
    }
    var name = (req.query.name || '').toLowerCase(); // Safely access and provide a default value
    if (name.trim() === '') {
        res.status(400).send('Invalid query. Please provide a valid book name.');
        return;
    }
    fs.readFile('books.json', 'utf8', function (err, data) {
        if (err) {
            res.status(500).send("The file doesn't exist");
            return;
        }
        var booksData = JSON.parse(data);
        var book = booksData.books.find(function (book) { return book.name.toLowerCase() === name; });
        if (!book) {
            res.status(404).send('Book not found');
            return;
        }
        var bookDetailsString = "Name: ".concat(book.name, "\nAuthor: ").concat(book.author, "\nISBN: ").concat(book.isbn);
        res.set('Content-Type', 'text/plain');
        res.send(bookDetailsString);
    });
});
app.use(function (req, res) {
    res
        .status(404)
        .send("Endpoint not found. Please enter a valid endpoint like <br> /books?name=book_name to get the details about that book");
});
var host = 'localhost';
var port = 3000;
app.listen(port, host, function () {
    console.log("Server is running on http://".concat(host, ":").concat(port));
});
