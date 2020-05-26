const jwt = require('jsonwebtoken');

function verifyToken (req, res, next){
    let token = req.get('Auth');
    jwt.verify(token, process.env.TOKEN_SEED, (err, decode) =>{
        if(err){
            return res.status(401).json({
                ok:false,
                err: {
                    message: err
                }
            });
        }
        req.user = decode.user;
        next();
    });
}

function verifyRole(req, res, next){
    let user = req.user;
    if(user.role === 'ADMIN_ROLE'){
        next();
    }
    else{
        return res.status(401).json({
            ok:false,
            err: {
                message: 'No tiene privilegios'
            }
        });
    }
}

function verifyTokenUrl (req, res, next){
    let token = req.query.token;
    jwt.verify(token, process.env.TOKEN_SEED, (err, decode) =>{
        if(err){
            return res.status(401).json({
                ok:false,
                err: {
                    message: err
                }
            });
        }
        req.user = decode.user;
        next();
    });
}

module.exports = {
    verifyToken, 
    verifyRole,
    verifyTokenUrl
};