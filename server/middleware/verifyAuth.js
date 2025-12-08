import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import User from '../models/user.js';
import Session from '../models/session.js';

const verifyAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    // First try to verify as JWT access token
    jwt.verify(token, jwtConfig.accessTokenSecret, async (err, decoded) => {
        if (!err) {
            // It's a valid JWT token, check user
            try {
                const user = await User.findById(decoded.id);
                if (!user || !user.isActive) {
                    return res.status(403).json({ message: 'User not found or inactive' });
                }
                req.user = user;
                req.authType = 'user';
                return next();
            } catch (error) {
                return res.status(500).json({ message: 'Server error during user verification' });
            }
        } else {
            // Not a valid JWT, try as session token
            try {
                const session = await Session.findOne({
                    sessionToken: token,
                    expiresAt: { $gt: new Date() }
                });

                if (!session) {
                    return res.status(403).json({ message: 'Invalid or expired token' });
                }

                req.session = session;
                req.authType = 'guest';
                return next();
            } catch (error) {
                return res.status(500).json({ message: 'Server error during session verification' });
            }
        }
    });
};

export default verifyAuth;
