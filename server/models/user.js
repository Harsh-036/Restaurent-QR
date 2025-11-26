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
    type: Boolean
  },
  totalSpend: {
    type: Number
  },
  totalOrders: {
    type: Number
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
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);

export default User;
