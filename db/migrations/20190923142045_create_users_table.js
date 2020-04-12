exports.up = connection => {
  return connection.schema.createTable('users', usersTable => {
    usersTable.string('username').primary();
    usersTable.string('avatar_url').notNullable();
    usersTable.string('name').notNullable();
  });
};

exports.down = connection => {
  return connection.schema.dropTable('users');
};
