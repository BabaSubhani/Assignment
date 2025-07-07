const jwt = require('jsonwebtoken');

const auth = (roles) => (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    if (roles && !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = auth;