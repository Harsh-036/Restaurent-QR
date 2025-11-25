import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  passwordHash: {
    type: String
  },
  isActive: {
    type: Boolean
  },
  refreshToken: {
    type: String
  }
});

const User = mongoose.model("User", userSchema);

export default User;
