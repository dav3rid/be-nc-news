const { fetchApiInfo } = require('../models/api');

exports.getApiInfo = (req, res, next) => {
  const apiInfo = fetchApiInfo();
  res.status(200).send({ apiInfo });
};
