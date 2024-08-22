const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAdmin = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        let user = await User.findById(decodedToken.id);
        if (user && user.role === 'admin') {
          next();
        } else {
          res.status(403).json({ error: 'Access denied, admin only' });
        }
      }
    });
  } else {
    res.redirect('/login');
  }
};

module.exports = requireAdmin;
