const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please tell us your book name'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Please tell us your book author name'],
      trim: true
    },
    genre: {
      type: String,
      required: [true, 'Please tell us your book author name'],
      trim: true
    }
});
  
module.exports = mongoose.model("Book", bookSchema)

