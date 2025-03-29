const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at elast 3 char"],
    },
    lastname: {
      type: String
    },
  },
  email:{
    type: String,
    required: true,
    unique: true,
    minlength: [6, "Email must be at elast 6 char"],
  },
  password:{
    type: String,
    required: true,
    select: false,
  },
  SocketId:{
    type: String,
  },
});


userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return token;
}

userSchema.methods.comparePassword = async function (password) {   
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
}

userSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

const userModel = mongoose.model("user", userSchema);

module.exports = userModel  ;