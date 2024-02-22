const errorHandlerMiddleware = (err, req, res, next) => {
  const statusCode = res.statusCode < 400 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.send.NODE_ENV === 'production' ? null : err.stack
  })
}
module.exports = {errorHandlerMiddleware};