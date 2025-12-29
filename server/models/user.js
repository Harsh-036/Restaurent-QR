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
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalSpend: {
    type: Number
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  loyaltyPoints: {
    type: Number
  },
  refreshToken: {
    type: String
  },
  refreshTokenExpiresTime: {
    type: Date
  },
  lastLogin: {
    type: Date,
    default: null
  },
  resetToken: {
    type: String
  },
  resetTokenExpiry: {
    type: Date
  }
});

const User = mongoose.model("User", userSchema);

export default User;
