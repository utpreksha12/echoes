const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  name: String,
  photo: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  placesVisited: [placeSchema],
  score: { type: Number, default: 0 }, // Add this line
});

module.exports = mongoose.model("User", userSchema);
