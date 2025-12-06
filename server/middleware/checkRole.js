
const checkRole = (role) =>{
    return (req,res,next) => {
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