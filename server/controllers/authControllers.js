import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt.js";

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
        if (userExist) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            phone,
            passwordHash: hashedPassword,
            isActive: true
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const { accessToken, refreshToken } = generateTokens(user);

        // Calculate refresh token expiry time (7 days from now)
        const refreshTokenExpiryTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        user.refreshToken = refreshToken;
        user.refreshTokenExpiresTime = refreshTokenExpiryTime;
        await user.save();

        // Calculate remaining time in days and hours
        const now = new Date();
        const timeDiff = refreshTokenExpiryTime - now;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const expiryMessage = `Refresh token expires in ${days} days and ${hours} hours`;

        res.json({
            user,
            accessToken,
            refreshToken,
            refreshTokenExpiry: expiryMessage
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
        if (!user) return res.status(403).json({ message: "Invalid refresh token" });

        jwt.verify(refreshToken, jwtConfig.refreshTokenSecret, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Refresh token expired" });

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
        if (authenticatedUser._id.toString() !== id && authenticatedUser.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: You can only update your own profile" });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (role && authenticatedUser.role === 'admin') user.role = role; // Only admin can change role
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
        if (authenticatedUser._id.toString() !== id && authenticatedUser.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: You can only delete your own account" });
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};



// lgow jqbh zzot jysf
