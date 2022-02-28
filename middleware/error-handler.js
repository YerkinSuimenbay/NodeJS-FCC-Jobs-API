const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong. Try again later!',
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if (err.name === 'ValidationError') {
    customError.message = Object.values(err.errors).map(errorItem => errorItem.message).join('. ')
    customError.statusCode = 400
  }

  if (err.code && err.code === 11000) {  // DUPLICATE ERROR CODE
    customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} field. Please choose another value`
    customError.statusCode = 400
  }

  if (err.name === 'CastError') {
    customError.message = `No item with id ${err.value}`
    customError.statusCode = 404
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.message })
}

module.exports = errorHandlerMiddleware
