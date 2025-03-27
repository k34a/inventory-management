import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username already taken"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});
const User = mongoose.model("User", userSchema);

export default User;
