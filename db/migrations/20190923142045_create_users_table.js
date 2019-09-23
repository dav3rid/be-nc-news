exports.up = connection => {
  console.log('Creating users table...');
  return connection.schema.createTable('users', usersTable => {
    usersTable.string('username').primary();
    usersTable.string('avatar_url').notNullable();
    usersTable.string('name').notNullable();
  });
};

exports.down = connection => {
  console.log('Removing users table');
  return connection.schema.dropTable('users');
};
