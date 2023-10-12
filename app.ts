const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send(
      "Welcome to our page Please enter an endpoint like <br> /books?name=book_name to get the details about that book"
    );
  });


app.get('/books', (req, res) => {
    fs.readFile('books.json', 'utf8', (err: Error, data: string) => {
      if (err) {
        res.status(500).send("the file doesn't exist");
        return;
      }
      const name = req.query.name?.toLowerCase(); // Convert the query parameter to lowercase
      const booksData = JSON.parse(data);
      const book = booksData.books.find((book: { name: string }) => book.name.toLowerCase() === name);
      if (!book) {
        res.status(404).send('Book not found');
        return;
      }
  
      const bookDetailsString = `Name: ${book.name}\nAuthor: ${book.author}\nISBN: ${book.isbn}`;
      res.set('Content-Type', 'text/plain');
      res.send(bookDetailsString);
    });
  });
  app.use((req, res) => {
    res
      .status(404)
      .send(
        "Endpoint not found Please enter an valid endpoint like <br> /books?name=book_name to get the details about that book"
      );
  });
const host = 'localhost';
const port = 3000;

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
