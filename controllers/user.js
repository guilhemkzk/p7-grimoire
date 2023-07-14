const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

exports.signup = (req, res, next) => {
  // if (User.findOne({ email: req.body.email })) {
  //   return res.status(401).json({ message: "Utilisateur déjà enregistré" });
  // }

  if (req.body.password.trim() !== req.body.password) {
    res.status(400).json({
      message: "Le mot de passe ne doit pas comporter d'espaces",
    });
    return;
  }

  if (!validator.isStrongPassword(req.body.password)) {
    res.status(400).json({
      message:
        "Le mot de passe doit faire au moins 8 caractères et comporter au moins : 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial",
    });
    return;
  }

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const newUser = new User({
        email: req.body.email,
        password: hash,
      });
      newUser
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur enregistré" }))
        .catch((err) =>
          res.status(400).json({ message: err.errors.email.message })
        );
    })
    .catch((error) => res.status(500).json({ message: error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "2h" } //1h
          );
          res.status(200).json({
            userId: user._id,
            token: token,
          });
        })
        .catch((error) => res.status(500).json({ message: error }));
    })
    .catch((error) => res.status(500).json({ message: error }));
};
