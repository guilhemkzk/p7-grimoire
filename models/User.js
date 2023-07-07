const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Adresse email non valide",
    },
  },

  password: {
    type: String,
    required: true,
    validate: {
      validator: validator.isStrongPassword,
      message: "Le mot de passe doit comporter...",
    },
  },
});

module.exports = mongoose.model("User", userSchema);
