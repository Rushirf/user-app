const mongoose = require("mongoose");
const { genders } = require("../utils/constant");

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [
        true,
        "Name should not be less than 2, and more than 100 characters long",
      ],
      minlength: [
        2,
        "Name should not be less than 2, and more than 100 characters long",
      ],
      maxlength: [
        100,
        "Name should not be less than 2, and more than 100 characters long",
      ],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Please provide a valid email address"],
      unique: [true, "Email already in use"],
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide a valid phone number"],
      unique: [true, "Phone number already in use"],
    },
    password: {
      type: String,
      // required: true,
    },
    profilePicture: {
      type: String,
      match: [
        /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/,
        "Could not set valid client profile picture URL",
      ],
    },

    // all of the below is to be filled by the client himself/herself
    gender: {
      type: String,
      required:true,
      enum: Object.values(genders),
    },
    age: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: "Age should be an integer",
      },
    },

    city: {
      type: String,
      trim: true,
      minlength: [
        2,
        "City should not be less than 2, and more than 100 characters long",
      ],
      maxlength: [
        100,
        "City should not be less than 2, and more than 100 characters long",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("profiles", profileSchema);
