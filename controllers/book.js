const Book = require("../models/Book");
const sharp = require("sharp");
const fs = require("fs");
sharp.cache(false);

exports.createBook = (req, res, next) => {
  fs.access("images/", (err) => {
    if (err) {
      fs.mkdirSync("images/");
    }
  });

  if (!req.file || !req.body) {
    console.log("Request incomplete");
    return;
  }

  const nameWebp = req.file.filename.split(".")[0] + ".webp";

  sharp(req.file.path)
    .resize({ width: 412, height: 520, fit: sharp.fit.contain })
    .webp({ quality: 20 })
    .toFile("images/resized/" + nameWebp, (err, info) => {
      if (err) {
        return console.log(err);
      }
    });

  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject.userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/resized/${nameWebp}`,
  });

  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre enregistré" });
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(500).json({ message: error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(500).json({ message: error }));
};

exports.bestRatings = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((bestRatingBooks) => res.status(200).json(bestRatingBooks))
    .catch((error) => res.status(500).json({ message: error }));
};

exports.updateBook = (req, res, next) => {
  if (req.file) {
    let nameWebp = req.file.filename.split(".")[0] + ".webp";

    sharp(req.file.path)
      .resize({ width: 412, height: 520, fit: sharp.fit.contain })
      .webp({ quality: 20 })
      .toFile("images/resized/" + nameWebp, (err, info) => {
        if (err) {
          return console.log(err);
        }
      });
  }

  const bookOject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/resized/${
          req.file.filename.split(".")[0]
        }.webp`,
      }
    : { ...req.body };

  delete bookOject.userId;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookOject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre mis à jour" }))
          .catch((error) => res.status(500).json({ message: error }));
      }
    })
    .catch((error) => res.status(500).json({ message: error }));
};

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre supprimé !" }))
    .catch((error) => res.status(500).json({ message: error }));
};

exports.rateBook = (req, res, next) => {
  const currentUserId = req.body.userId;
  const currentBookId = req.params.id;
  const newGrade = req.body.rating;

  Book.findOne({ _id: currentBookId })
    .then((book) => {
      // Check if the user has created the book
      if (book.userId === currentUserId) {
        res.status(400).json({
          message: "Vous ne pouvez pas effetuer cette action.",
        });
      }
      // Check if the user has already voted for the book
      book.ratings.forEach((rating) => {
        if (rating.userId === currentUserId) {
          res.status(400).json({
            message: "Vous ne pouvez pas effetuer cette action.",
          });
        }
      });
    })
    .catch((error) => res.status(500).json({ message: error }));

  Book.updateOne(
    { _id: currentBookId },
    {
      $push: { ratings: { userId: currentUserId, grade: newGrade } },
    }
  )
    .then(() => {
      //Get the updated book
      Book.findOne({ _id: currentBookId })
        .then((book) => {
          // Recalculate the average rating
          let newAverage =
            (book.averageRating * (book.ratings.length - 1) + newGrade) /
            book.ratings.length;

          newAverage = Math.round(newAverage * 10) / 10;

          //Update average rating
          Book.updateOne(
            { _id: currentBookId },
            { $set: { averageRating: newAverage } }
          )
            .then(console.log("Book ratings updated"))
            .catch((error) => res.status(500).json({ message: error }));

          //Send the response as the new updated book
          Book.findOne({ _id: currentBookId })
            .then((book) => res.status(200).json(book))
            .catch((error) => res.status(500).json({ message: error }));
        })
        .catch((error) => res.status(500).json({ message: error }));
    })

    .catch((error) => res.status(500).json({ message: error }));
};
