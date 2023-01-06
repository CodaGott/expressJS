const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    maxlength: [40, "Name can't be more than 40 Characters"],
    minlength: [4, "Name can't be less than 4 Characters"],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be up to 8 character long'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm password'],
  },
});

// How to create a model out of a schema
const User = mongoose.model('User', userSchema);

module.exports = User;
