import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt.js";
import transporter from "../services/emailService.js";
import registerTemplate from "../services/templates/registerTemplate.js";

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    jwtConfig.accessTokenSecret,
    { expiresIn: jwtConfig.accessTokenExpiry }
  );

  const refreshToken = jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    jwtConfig.refreshTokenSecret,
    { expiresIn: jwtConfig.refreshTokenExpiry }
  );

  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone: Number(phone),
      passwordHash: hashedPassword,
      isActive: true,
    });

    await user.save();

    // Generate tokens after saving user
    const { accessToken, refreshToken } = generateTokens(user);

    // Calculate refresh token expiry time (7 days from now)
    const refreshTokenExpiryTime = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    user.refreshToken = refreshToken;
    user.refreshTokenExpiresTime = refreshTokenExpiryTime;
    await user.save();

    // Calculate remaining time in days and hours
    const now = new Date();
    const timeDiff = refreshTokenExpiryTime - now;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const expiryMessage = `Refresh token expires in ${days} days and ${hours} hours`;

    //integrate mail service here
    const info = await transporter.sendMail({
      from: "sharmaharshharsh1234@gmail.com",
      to: user.email,
      subject: "User registration",
      text: registerTemplate(user.name, "SavouryBites"), // plain‑text body
    });
    console.log("mail sent", info.messageId);

    res.status(201).json({
      user,
      accessToken,
      refreshToken,
      refreshTokenExpiry: expiryMessage,
      message: "User registered successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const { accessToken, refreshToken } = generateTokens(user);

    // Calculate refresh token expiry time (7 days from now)
    const refreshTokenExpiryTime = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    user.refreshToken = refreshToken;
    user.refreshTokenExpiresTime = refreshTokenExpiryTime;
    await user.save();

    // Calculate remaining time in days and hours
    const now = new Date();
    const timeDiff = refreshTokenExpiryTime - now;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const expiryMessage = `Refresh token expires in ${days} days and ${hours} hours`;

    res.json({
      user,
      accessToken,
      refreshToken,
      refreshTokenExpiry: expiryMessage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token required" });

    const user = await User.findOne({ refreshToken });
    if (!user)
      return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(refreshToken, jwtConfig.refreshTokenSecret, (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Refresh token expired" });

      const newAccessToken = jwt.sign(
        { id: user._id, email: user.email },
        jwtConfig.accessTokenSecret,
        { expiresIn: jwtConfig.accessTokenExpiry }
      );

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    const authenticatedUser = req.user;

    // Check if user is updating their own profile or is admin
    if (
      authenticatedUser._id.toString() !== id &&
      authenticatedUser.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only update your own profile" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role && authenticatedUser.role === "admin") user.role = role; // Only admin can change role
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.passwordHash = hashedPassword;
    }

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const authenticatedUser = req.user;

    // Check if user is deleting their own account or is admin
    if (
      authenticatedUser._id.toString() !== id &&
      authenticatedUser.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only delete your own account" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// FIND ACCOUNT
export const findAccount = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      res.json({ success: true, message: "Email found" });
    } else {
      res.json({ success: false, message: "Email not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// RESET PASSWORD (Send Email)
export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token (JWT with 1 hour expiry)
    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      jwtConfig.accessTokenSecret,
      { expiresIn: '1h' }
    );

    // Save token and expiry to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send reset email
    const resetUrl = `http://localhost:5173/forgetpassword?token=${resetToken}`;
    const mailOptions = {
      from: "sharmaharshharsh1234@gmail.com",
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You requested a password reset for your account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>SavouryBites Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// GET USER
export const getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-passwordHash -refreshToken -refreshTokenExpiresTime -resetToken -resetTokenExpiry');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// FORGET PASSWORD (Update Password)
export const forgetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtConfig.accessTokenSecret);

    // Find user by decoded id
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if token matches and is not expired
    if (user.resetToken !== token) {
      return res.status(400).json({ message: "Invalid token" });
    }

    if (user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ message: "Token expired" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    user.passwordHash = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: "Invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: "Token expired" });
    }
    res.status(500).json({ message: "Server error", error });
  }
};
