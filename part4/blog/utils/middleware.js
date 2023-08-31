const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const errorHandler = (error,request,response,next) => {
    logger.error(error)

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }else if (error.name === 'JsonWebTokenError'){
        return response.status(401).json({ error: 'invalid token' })
    }else if (error.name === 'TokenExpiredError'){
        return response.status(401).json({ error: 'token expired' })
    }

    next(error)
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')

    if(authorization && authorization.startsWith('Bearer ')){
        request.token = authorization.replace('Bearer ', '')
        return next()
    }
    request.token = null
    return next()
}

const useExtractor = async(request, response, next) => {
    const token = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(token.id)
    if(token.id.toString() === user.id){
        request.user = user
        return next()
    }

    return next()
}

module.exports = {
    errorHandler,
    tokenExtractor,
    useExtractor
}