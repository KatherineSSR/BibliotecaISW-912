const jwt = require('jsonwebtoken');

const requireAdmin = (req, res, next) => {
    const authorization = req.headers.authorization || '';
    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({
            success: false,
            message: 'Debe iniciar sesión como administrador.'
        });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        if (payload.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Solo administradores pueden gestionar los cubículos.'
            });
        }
        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: 'La sesión no es válida o ha expirado. Inicie sesión nuevamente.'
        });
    }
};

module.exports = requireAdmin;
