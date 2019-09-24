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
