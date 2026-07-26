const jwt = require('jsonwebtoken');

// Middleware ini dipakai di route yang butuh login (misal: dashboard, bank soal)
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']; // format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan, silakan login' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid atau sudah kedaluwarsa' });
    }
    req.guru = decoded; // data guru bisa diakses di controller lewat req.guru
    next();
  });
}

module.exports = verifyToken;
