const Book = require("../models/Book");

exports.createBook = (req, res, next) => {
  console.log("Body: ", req.body);
  console.log("File: ", req.files);

  // const book = new Book({
  //   ...req.body,
  // });

  res.send("Ok");

  // book
  //   .save()
  //   .then(() => res.status(201).json({ message: "Livre enregistré" }))
  //   .catch(() => res.status(400).json({ error: "error" }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch(() => res.status(400).json({ error: "error" }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch(() => res.status(400).json({ error: "error" }));
};

exports.bestRatings = (req, res, next) => {
  const books = [
    "Array des 3 livres de la bdd ayant la meilleure note moyenne",
  ];

  res.status(200).json(books);
};

exports.updateBook = (req, res, next) => {
  res.send("Ok");
};

exports.deleteBook = (req, res, next) => {
  res.send("Ok");
};

exports.rateBook = (req, res, next) => {
  res.send("Ok");
};
