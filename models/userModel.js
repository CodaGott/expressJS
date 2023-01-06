const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    validate: {
      // This only works on Create and Save!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords not the same',
    },
  },
});

userSchema.pre('save', async function (next) {
  //Run this if password was modified.
  if (!this.isModified('password')) {
    return;
    next();
  }
  // Hash Password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Don't persist the passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

// How to create a model out of a schema
const User = mongoose.model('User', userSchema);

module.exports = User;
