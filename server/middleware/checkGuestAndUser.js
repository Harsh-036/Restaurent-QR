import jwtConfig from "../config/jwt.js";
import User from "../models/user.js";
import jwt from 'jsonwebtoken';

const checkGuestOrUser = (req, res, next) => {

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
            // console.log(decoded)
            next();
        }  catch (error) {
            return res.status(500).json({ message: 'Server error during user verification' });
        }
    });
};

export default checkGuestOrUser


//jab user yeh orders pr jaye tw check ho access token h uske paas yaa nhi h, agar hai tw thik agar nhi h tw next() krdo iss hisab se bnana h isko; taki chae guest add to cart kre yaa customer kare dono add to cart kr paye orr pata bhi chal jaye guest h ya user agar access token hua tw user, agar bina access token ke tw guest