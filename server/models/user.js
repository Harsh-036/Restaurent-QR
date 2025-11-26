import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: Number
  },
  passwordHash: {
    type: String
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customers'
  },
  isActive: {
    type: Boolean
  },
  totalSpend: {
    type: Number
  },
  totalOrders: {
    type: Number
  },
  loyalPoints: {
    type: Number
  },
  refreshToken: {
    type: String
  }
});

const User = mongoose.model("User", userSchema);

export default User;
