const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const protect = async (req, res, next) =>{
    let token;

    try {
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            console.log('hello1');
            try {
                //Get token from the header
                token = req.headers.authorization.split(' ')[1];
                

                //verify the token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                //Get user from the token
                req.user = await UserModel.findById(decoded.id).select('-password');

            } catch (error) {
                console.log(error);
                res.status(401).json({message: "Not authorized"});
            }
            next();
        }

    } catch (error) {
        res.status(401).json({
            message: "Not authorized, no token",
            error: error,
        });
    }
}

module.exports = { protect };
