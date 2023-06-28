const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function ValidateEmail(mail) {
  const regexMail = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

  if (regexMail.test(mail)) {
    return true;
  }
  return false;
}

function ValidatePassword(password) {
  const regexPassword = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  );
  if (regexPassword.test(password)) {
    return true;
  }
  return false;
}

exports.signup = (req, res, next) => {
  if (ValidateEmail(!req.body.email)) {
    res.status(400).json({ message: "Format email invalide" });
    return;
  }

  if (!ValidatePassword(req.body.password)) {
    res
      .status(400)
      .json({
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
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
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
            { expiresIn: "12h" }
          );
          res.status(200).json({
            userId: user._id,
            token: token,
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
