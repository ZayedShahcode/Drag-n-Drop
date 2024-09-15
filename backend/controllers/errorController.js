import AppError from '../utils/appError'

const handleJWTError  = err => AppError('Invalid token Please login again',401)

module.exports = {handleJWTError}