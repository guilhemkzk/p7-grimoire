const mongoose = require("mongoose");
// const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    // validate: {
    //   validator: validator.isEmail,
    //   message: "Adresse email non valide",
    // },
  },

  password: {
    type: String,
    required: true,
    // validate: {
    //   validator: validator.isStrongPassword,
    //   message: "Le mot de passe doit comporter...",
    // },
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
