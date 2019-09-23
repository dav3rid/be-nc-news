const ENV = process.env.NODE_ENV || 'development';

const allData = {
  development: require('./development-data'),
  test: require('./test-data')
};

module.exports = allData[ENV];
