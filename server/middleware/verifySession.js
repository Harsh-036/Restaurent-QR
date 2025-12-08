import Session from '../models/session.js';

const verifySession = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Session token required' });
    }

    try {
        const session = await Session.findOne({
            sessionToken: token,
            expiresAt: { $gt: new Date() }
        });

        if (!session) {
            return res.status(403).json({ message: 'Invalid or expired session token' });
        }

        req.session = session; // Attach session object to request
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Server error during session verification' });
    }
};

export default verifySession;
