const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Extract token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token required.' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }

    // Attach the decoded payload to the request object
    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;
