const express = require("express");
// Import mongoose
const mongoose = require("mongoose");
// Import bcrypt
const bcrypt = require("bcrypt");
// Import dotenv (loads environment variables from .env file)
const dotenv = require("dotenv");
// Import jsonwebtoken (allow secure exchange of tokens)
const jwt = require("jsonwebtoken");
// Import multer (for multipart form data)
const multer = require("multer");
// Import models
const Book = require("./models/Book");
const User = require("./models/User");

// Create express application
const app = express();
const upload = multer();

// Allow all request's origins
var cors = require("cors");

// Set up Global configuration access
dotenv.config();

app.use(cors()); // Use this after the variable declaration

mongoose
  .connect(
    "mongodb+srv://gkzk:Whothef*ck15that@project0.huvo8yv.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//Middleware that intercept all request with a content type "json" and make it available in the req object in req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // for parsing multipart/form-data
app.use(upload.array());
app.use(express.static("public"));

// // parse application/x-www-form-urlencoded
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

// // parse application/json
// app.use(bodyParser.json());

// -------------------------------- Middlewares ----------------------------------

// Allow access to API from any origin, list of methods and authorized headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// Request that send the JWT token in response
app.post("/user/generateToken", (req, res) => {
  // Validate User Here
  // Then generate JWT Token
});

// ---------------------------- Endpoints and routes  -----------------------------

// [POST] API AUTH SIGNUP
app.post("/api/auth/signup", (req, res, next) => {
  //Check if the email already exists

  const existingUser = User.findOne({ email: req.body.email }).then((user) => {
    if (user == null) {
      const saltRounds = 10;
      bcrypt
        .hash(req.body.password, saltRounds)
        .then((hash) => {
          const newUser = new User({
            email: req.body.email,
            password: hash,
          });
          newUser
            .save()
            .then(() =>
              res.status(201).json({ message: "Utilisateur enregistré" })
            )
            .catch(() => res.status(400).json({ error: "error" }));
        })
        .catch((err) => console.error(err.message));
    } else {
      console.log("Utilisateur déjà enregistré");
      // ENVOYER UN MESSAGE
      return;
    }
  });
});

// [POST] API AUTH LOGIN
app.post("/api/auth/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      bcrypt.compare(req.body.password, user.password, function (err, resp) {
        if (resp == true) {
          let jwtSecretKey = process.env.JWT_SECRET_KEY;
          let data = {
            time: Date(),
            userId: 12,
          };

          const token = jwt.sign(data, jwtSecretKey);
          res.status(200).json({ token: token, userId: user._id });
        } else {
          res
            .status(400)
            .json({ error: "Mot de passe ou identifiant incorrect" });
        }
      });
    })
    .catch(() => res.status(400).json({ error: "error" }));
});

// [GET] API BOOKS
app.get("/api/books", (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch(() => res.status(400).json({ error: "error" }));
});

// [POST] API BOOKS
app.post("/api/books", upload.single("image"), (req, res, next) => {
  console.log("Body: ", req.body);
  console.log("File: ", req.file);

  // const book = new Book({
  //   ...req.body,
  // });
  res.send("test");

  // book
  //   .save()
  //   .then(() => res.status(201).json({ message: "Livre enregistré" }))
  //   .catch(() => res.status(400).json({ error: "error" }));
});

// [GET] API BOOKS ID
app.get("/api/books/:id", (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch(() => res.status(400).json({ error: "error" }));
});

// [GET] API BOOKS BESTRATING
app.get("/api/books/bestrating", (req, res, next) => {
  const books = [
    "Array des 3 livres de la bdd ayant la meilleure note moyenne",
  ];

  res.status(200).json(books);
});

// [PUT] API BOOKS ID

// [DELETE] API BOOKS ID

// [POST] API BOOKS ID RATING

// Export the app so it can be reach by other applications, especially node server
module.exports = app;
