const notFound = (req, res, next) => {
  const err = new Error(`Route not found — ${req.method} ${req.url}`)
  err.status = 404
  next(err)
}

module.exports = notFound