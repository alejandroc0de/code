// token auth JWT 

const jwt = require('jsonwebtoken');

function authMiddleware(req,res, next){

    const authHeader = req.headers.authorization; // jwt from frontend
    if(!authHeader || !authHeader('Bearer')){
        return res.status(401).json({message: 'Token no proporcionado'})
    }

    const token = authHeader.split(' ')[1]; // split el token de lo que llega del front 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401),json({message: 'Token incorrecto o expirado'});
    }

}

module.exports = authMiddleware