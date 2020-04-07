exports.up = connection => {
  return connection.schema.createTable('games', articlesTable => {
    articlesTable.increments('game_id').primary();
    articlesTable.string('title').notNullable();
    articlesTable.integer('host_id').references('users.user_id').notNullable();
    articlesTable.text('game_state').notNullable();
    articlesTable.timestamp('created_at').defaultsTo(connection.fn.now());
  });
};

exports.down = connection => {
  return connection.schema.dropTable('games');
};
