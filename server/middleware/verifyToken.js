import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import User from '../models/user.js';

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, jwtConfig.accessTokenSecret, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired access token' });
        }

        try {
            const user = await User.findById(decoded.id);
            if (!user || !user.isActive) {
                return res.status(403).json({ message: 'User not found or inactive' });
            }
            req.user = user; // Attach full user object to request
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Server error during user verification' });
        }
    });
};

export default verifyToken;
