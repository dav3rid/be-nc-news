exports.up = connection => {
  return connection.schema.createTable('games', articlesTable => {
    articlesTable.increments('game_id').primary();
    articlesTable.string('title').notNullable();
    articlesTable
      .integer('host_id')
      .references('users.user_id')
      .unique()
      .notNullable();
    articlesTable.integer('opponent_id').references('users.user_id');
    articlesTable.integer('current_turn_id').references('users.user_id');
    articlesTable.text('game_state').defaultsTo('{"msg":"no game state"}');
    articlesTable.timestamp('created_at').defaultsTo(connection.fn.now());
  });
};

exports.down = connection => {
  return connection.schema.dropTable('games');
};
