const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");

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
  },
});

userSchema.plugin(uniqueValidator, {
  message: "L'adresse mail doit être unique",
});

module.exports = mongoose.model("User", userSchema);
