exports.up = connection => {
  return connection.schema.createTable('users', usersTable => {
    usersTable.increments('user_id').primary();
    usersTable.string('name').unique().notNullable();
  });
};

exports.down = connection => {
  return connection.schema.dropTable('users');
};
