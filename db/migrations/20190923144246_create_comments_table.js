exports.up = connection => {
  console.log('Creating comments table...');
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
    commentsTable.timestamp('created_at');
  });
};

exports.down = connection => {
  console.log('Removing comments table');
  return connection.schema.dropTable('comments');
};
