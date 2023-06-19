const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: "Email existant" },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
