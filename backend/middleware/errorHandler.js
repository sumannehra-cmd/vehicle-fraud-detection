// Yeh middleware saari errors pakad leta hai
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message    = err.message;

  // Galat MongoDB ID
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Item nahi mila';
  }

  // Duplicate entry (jaise same email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exist karta hai`;
  }

  // Validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  res.status(statusCode).json({
    message,
    // Development mein stack trace dikhao, production mein nahi
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};

module.exports = errorHandler;