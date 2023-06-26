const express = require("express");
const bb = require("express-busboy");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/users");

// Create express application and allow download of images
const app = express();
bb.extend(app, {
  upload: true,
  path: "images/",
  allowedPath: /./,
});

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

// ---------------------------- Endpoints and routes  -----------------------------

app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);

// Export the app so it can be reach by other applications, especially node server
module.exports = app;
