import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import User from '../models/user.js';
import Session from '../models/session.js';

const verifyAuthOrSession = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  // First, try to verify as JWT (user)
  try {
    const decoded = jwt.verify(token, jwtConfig.accessTokenSecret);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(403).json({ message: 'User not found or inactive' });
    }
    req.user = user;
    req.authType = 'user';
    return next();
  } catch (jwtError) {
    // JWT verification failed, try session token
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
    } catch (sessionError) {
      return res.status(500).json({ message: 'Server error during session verification' });
    }
  }
};

export default verifyAuthOrSession;
