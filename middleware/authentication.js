const { UnauthenticatedError } = require("../errors")
const jwt = require('jsonwebtoken')

const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) throw new UnauthenticatedError('Authentication invalid')

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = { userId: decoded.userId, name: decoded.name }
        next()
    } catch (error) {
        throw new UnauthenticatedError('Invalid token')
    }
}

module.exports = authenticateUser