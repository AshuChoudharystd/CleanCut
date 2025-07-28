import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
  cartData:{
    type:Object,
    default: {},
  }
},{minimize: false, timestamps: true});

const userModel = mongoose.models['user'] || mongoose.model('user',userSchema);

export default userModel;