const { VerifyToken } = require('../../../../Order-service/src/utils');
const { ValidateSignature } = require('../../utils');

module.exports = async (req,res,next) => {
    
    const isAuthorized = await VerifyToken(req.header('auth-token')) && ValidateSignature;

    if(isAuthorized){
        return next();
    }
    return res.status(403).json({message: 'Not Authorized'})
}

