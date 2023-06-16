const express = require("express");

// Create express application
const app = express();

//Middleware that intercept all request with a content type "json" and make it available in the req object in req.body
app.use(express.json());

// -------------------------------- Middlewares ----------------------------------

// Allow access to API from any origin, list of methods and authorized headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// ---------------------------- Endpoints and routes  -----------------------------

// [POST] API AUTH SIGNUP
app.post("/api/auth/signup", (req, res, next) => {
  const user = [
    {
      email: "Adresse email de l'user unique",
      password: "Mot de passe hashé de l'utilisateur",
    },
  ];
  console.log("Signup");
  res.status(200).json(user);
});

// [POST] API AUTH LOGIN
app.post("/api/auth/login", (req, res, next) => {
  const userAuth = [
    {
      id: "Id utilisateur depuis la base de données si match",
      token: "token web JSON signé contenant l'ID de l'utilisateur",
    },
  ];
  res.status(200).json(userAuth);
});

// [GET] API BOOKS
app.get("/api/books", (req, res, next) => {
  const books = [
    {
      userId: "identifiant MongoDB unique de l'user qui a créé le livre",
      title: "Titre du livre",
      author: "Auteur du livre",
      imageUrl:
        "https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg",
      year: 4900,
      genre: "Genre du livre",
      ratings: [
        {
          userId: "Identifiant MongoDB unique de l'user qui a noté le livre",
          grade: 5,
        },
      ],
      averageRating: 2,
    },
  ];
  res.status(200).json(books);
});

// [POST] API BOOKS
app.post("/api/books", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({ message: "Objet ajouté" });
});

// [GET] API BOOKS ID
app.get("/api/books/:id", (req, res, next) => {
  const book = "Renvoie le livre avec l'id fourni";
  res.status(200).json(book);
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
