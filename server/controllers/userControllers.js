import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt.js";

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        jwtConfig.accessTokenSecret,
        { expiresIn: jwtConfig.accessTokenExpiry }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
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
            passwordHash: hashedPassword
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

        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            message: "Login successful",
            accessToken,
            refreshToken
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
