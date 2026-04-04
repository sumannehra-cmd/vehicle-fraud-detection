const roleCheck = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Sirf ${roles.join(', ')} access kar sakta hai`,
      });
    }
    next();
  };
};

module.exports = roleCheck;