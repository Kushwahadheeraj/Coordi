const mockUsers = {
    'netrunnerX': { role: 'contributor' },
    'reliefAdmin': { role: 'admin' },
};

const authenticate = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: Missing x-user-id header' });
    }

    const user = mockUsers[userId];
    if (!user) {
        return res.status(403).json({ error: 'Forbidden: Invalid user' });
    }

    req.user = { id: userId, ...user };
    next();
};

const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!roles.length || roles.includes(req.user.role)) {
            return next();
        }
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    };
};

module.exports = { authenticate, authorize };
