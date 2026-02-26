module.exports = (req, res, next) => {
  if (req.user.role !== 'reporter' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Reporter access required.' });
  }
  next();
};