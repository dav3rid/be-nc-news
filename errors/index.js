exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePsql400Errors = (err, req, res, next) => {
  const codes = ['22P02', '42703'];
  if (codes.includes(err.code)) res.status(400).send({ msg: 'Bad request.' });
  else next(err);
};
exports.handlePsql422Errors = (err, req, res, next) => {
  const codes = ['23503'];
  if (codes.includes(err.code))
    res.status(422).send({ msg: 'Unprocessable entity.' });
  else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send('Server error.');
};

// NO ERR PARAMETER - TECHNICALLY NO ERROR
exports.handle404s = (req, res, next) => {
  res.status(404).send({ msg: 'Page not found.' });
};
exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: 'Method not allowed.' });
};
