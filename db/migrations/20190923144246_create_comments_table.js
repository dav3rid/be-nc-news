exports.up = connection => {
  return connection.schema.createTable('comments', commentsTable => {
    commentsTable.increments('comment_id').primary();
    commentsTable
      .string('author')
      .references('users.username')
      .notNullable();
    commentsTable
      .integer('article_id')
      .references('articles.article_id')
      .notNullable();
    commentsTable.integer('votes').defaultsTo(0);
    commentsTable.timestamp('created_at').defaultsTo(connection.fn.now());
    commentsTable.text('body').notNullable();
  });
};

exports.down = connection => {
  return connection.schema.dropTable('comments');
};
