const { decodeJwt } = require('jose');

// Decodes the access token from the Authorization header
const jwtMiddleware = (req, res, next) => {
    if (req.headers['Authorization'])
        // Store the decoded information in a variable user that can be used by other middlewares
        req.user = decodeJwt(req.headers['Authorization']);

    next();
};

// Grants or denies access based on the decoded token from jwtMiddleware
const protectedRoute = ({ roles, privileges }) => {
    return (req, res, next) => {
        if (req.user) {
            if (
                roles
                    ? roles.includes(req.user.role)
                    : false || privileges
                        ? privileges.some((scope) => req.user.scope.includes(scope))
                        : false
            ) {
                next();
            } else {
                res.status(403).send({ message: 'Forbidden' });
            }
        } else {
            res.status(401).send({ message: 'Unauthorized' });
        }
    };
};

module.exports = { jwtMiddleware, protectedRoute }