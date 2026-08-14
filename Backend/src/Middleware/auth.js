import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    if(!req.headers.authorization){
        return res.json({
            success: false,
            code: 401,  
            message:"Token is Required",
            data:null,
            error:true,
        })
    }
    const token = req.headers.authorization.split(" ");
    const result = token[1];
    jwt.verify(result,process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.json({
                success: false,
                code: 401,
                message: "Session is Expired Please login again!",
                data: null,
                error: true,
            })
        } else{
            req.user= decoded;
            next();
        }
    })
}

export const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if(roles.includes(req.user.role)){
            next();
        } else {
            res.json({
                success: false,
                code: 403,
                message: "You are not authorized to perform this action",
                data: null,
                error: true,
            })
        }
    }
}