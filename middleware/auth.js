// Permite pasar uno o varios roles:
// authorize('admin') o authorize('admin', 'premium')

export const authorize = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No autenticado' });
    }

    // Si no se pasan roles, permitimos el acceso
    if (!allowedRoles || allowedRoles.length === 0) {
        return next();
    }

    // Si el rol del usuario esta en la lista de permitidos, continuar
    if (allowedRoles.includes(req.user.role)) {
        return next();
    }

    return res.status(403).json({ message: 'Acceso denegado: rol no autorizado' });
};

export default authorize;
