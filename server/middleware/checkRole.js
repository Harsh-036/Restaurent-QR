
const checkRole = (role) =>{
    return (req,res,next) => {
        // Allow guests to access menu
        if (req.authType === 'guest') {
            return next();
        }

        if (!req.user) {
            return res.status(401).json({
                message: 'User not authenticated'
            });
        }

        if(role.includes(req.user.role)){
            next()
        }else{
            res.status(403).json({
                message: `This resource is not accessible for ${req.user.role}`
            })
        }
    }
}

export default checkRole;