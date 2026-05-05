const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url}:`, err.message)

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Validation error.',
      errors: err.errors.map(e => e.message)
    })
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      message: 'Duplicate entry.',
      errors: err.errors.map(e => e.message)
    })
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      message: 'Invalid reference — related record does not exist.'
    })
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token.' })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired. Please login again.' })
  }

  if (err.status === 404) {
    return res.status(404).json({ message: err.message || 'Resource not found.' })
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

module.exports = errorHandler