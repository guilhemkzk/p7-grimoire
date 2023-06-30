const { userInfo } = require("os");
const Book = require("../models/Book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject.userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre enregistré" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch(() => res.status(400).json({ error: "error" }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch(() => res.status(500).json({ error: "error" }));
};

exports.bestRatings = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((bestRatingBooks) => res.status(200).json(bestRatingBooks))
    .catch(() => res.status(500).json({ error: "error" }));
};

exports.updateBook = (req, res, next) => {
  const bookOject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
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
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.rateBook = (req, res, next) => {
  const currentUser = req.body.userId;
  const currentBook = req.params.id;
  const newGrade = req.body.rating;

  // Find the book
  Book.findOne({ _id: currentBook })
    .then((book) => {
      if (book.ratings.some((e) => e.userId == currentUser)) {
        //// Book.updateOne({"ratings" : {"$elemMatch" : {"userId": {"$eq": currentUser}}}},
        //// {"$set" : {"$ratings.$.grade" : req.body.rating}});
        //     Book.ratings.updateOne(
        //       { userId: { $eq: currentUser } },
        //       { $set: { $grade: newGrade } }
        //     );
        console.log("L'user existe");
      } else {
        console.log("L'user n'existe pas");
        Book.ratings.insertOne({ userId: currentUser, grade: newGrade });
      }

      //   // Recalculate the average rating
      //   let newAverageRating = 0;

      //   book.ratings.forEach((rating) => {
      //     newAverageRating = newAverageRating + rating.grade;
      //   });
      //   newAverageRating = Math.round(newAverageRating / book.ratings.length);

      //   //Update average rating
      //   Book.updateOne({ averageRating: newAverageRating });

      //   //Send the response as the new updated book
      //   Book.findOne({ _id: currentBook })
      //     .then((book) => res.status(200).json(book))
      //     .catch(() => res.status(500).json({ error: "error" }));
      // })
    })

    .catch(() => res.status(500).json({ error: "error" }));
};
