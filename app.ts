const express = require('express');
import { Request, Response } from 'express';
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send(
    "Welcome to our page. Please enter an endpoint like <br> /books?name=book_name to get the details about that book"
  );
});

app.get('/books', (req: Request, res: Response) => {
  if (req.query.name === undefined) {
    res.status(400).send('Invalid query. Please provide a valid "name" query parameter.');
    return;
  }
  const name = (req.query.name as string || '').toLowerCase();
  if (name.trim() === '') {
    res.status(400).send('Invalid query. Please provide a valid book name.');
    return;
  }

  fs.readFile('books.json', 'utf8', (err: NodeJS.ErrnoException | null, data: string) => {
    if (err) {
      res.status(500).send("The file doesn't exist");
      return;
    }

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

app.use((req: Request, res: Response) => {
  res
    .status(404)
    .send(
      "Endpoint not found. Please enter a valid endpoint like <br> /books?name=book_name to get the details about that book"
    );
});

const host = 'localhost';
const port = 3000;

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
