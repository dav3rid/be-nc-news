exports.up = connection => {
  console.log('Creating articles table...');
  return connection.schema.createTable('articles', articlesTable => {
    articlesTable.increments('article_id').primary();
    articlesTable.string('title').notNullable();
    articlesTable.text('body').notNullable();
    articlesTable.integer('votes').defaultsTo(0);
    articlesTable
      .string('topic')
      .references('topics.slug')
      .notNullable();
    articlesTable
      .string('author')
      .references('users.username')
      .notNullable();
    articlesTable.timestamp('created_at').defaultsTo(connection.fn.now());
  });
};

exports.down = connection => {
  console.log('Removing articles table');
  return connection.schema.dropTable('articles');
};
