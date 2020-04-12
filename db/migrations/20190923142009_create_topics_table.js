exports.up = connection => {
  return connection.schema.createTable('topics', topicsTable => {
    topicsTable.string('slug').primary();
    topicsTable.string('description').notNullable();
  });
};

exports.down = connection => {
  return connection.schema.dropTable('topics');
};
