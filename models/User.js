const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please enter your full name"],
    minlength: [4, "Full name must be at least 4 characters long"],
    maxlength: [20, "Full name must be max 20 characters long"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: String,
  },
});

// Fire a function before doc saved to db (hooks)
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt); // Password encrypted
  next();
});

userSchema.statics.login = async function (email, password) {
  // Login time
  const user = await this.findOne({ email }); // This is used as there is no instance of the above schema
  if (user) {
    const auth = await bcrypt.compare(password, user.password); // Password check against the saved
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const User = mongoose.model("User", userSchema);

module.exports = User;
