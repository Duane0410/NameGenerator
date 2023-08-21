const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) {
            return res.sendStatus(401).json({ "message": 'Unauthorized!'});
        }
        const rolesArray = [...allowedRoles];
        console.log('Allowed Roles - ', rolesArray);
        console.log('Requested Roles - ', req.roles);
        const result = req.roles.some(role => rolesArray.includes(role))
        console.log('Result - ', result)
        if (!result) {
            return res.sendStatus(401).json({ "message": 'Unauthorized!'});
        }
        next();
    }
}

module.exports = verifyRoles