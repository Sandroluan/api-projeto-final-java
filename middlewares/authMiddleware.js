const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({ message: 'Erro no formato do token' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ message: 'Token malformatado' });
    }

    const SECRET_KEY = process.env.JWT_SECRET;


    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido ou expirado' });
        }

        req.userId = decoded.user_id;
        req.userEmail = decoded.email;
        req.userTipo = decoded.tipo;

        return next();
    });
};

const isAdmin = (req, res, next)=>{

    if(req.userTipo !== 'admin'){
        return res.status(400).json({message:'acesso negado'})
    }return next()
}

module.exports = {
    authMiddleware,
    isAdmin
}