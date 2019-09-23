exports.up = function(connection) {
  console.log('Creating topics table...');
  return connection.schema.createTable('topics', topicsTable => {
    topicsTable.string('slug').primary();
    topicsTable.string('description');
  });
};

exports.down = function(connection) {
  console.log('Removing topics table');
  return connection.schema.dropTable('topics');
};
