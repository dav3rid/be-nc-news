process.env.NODE_ENV = 'test';
const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-sorted'));
const app = require('../app');
const request = require('supertest');
const connection = require('../db/connection');

after(() => connection.destroy());
beforeEach(() => connection.seed.run());

describe('/api', () => {
  describe('GET', () => {
    it('status: 200, responds with a JSON object describing all available endpoints', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body: { apiInfo } }) => {
          expect(apiInfo).to.contain.keys(
            '/api',
            '/api/topics',
            '/api/users/:username',
            '/api/articles',
            '/api/articles/:article_id',
            '/api/articles/:article_id/comments',
            '/api/comments/:comment_id'
          );
        });
    });
  });
  describe('INVALID METHODS', () => {
    it('status: 405, for methods DELETE, PATCH, POST, PUT', () => {
      const invalidMethods = ['delete', 'patch', 'post', 'put'];
      const promises = invalidMethods.map(method => {
        return request(app)
          [method]('/api')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Method not allowed.');
          });
      });
      return Promise.all(promises);
    });
  });
  describe('/topics', () => {
    describe('GET', () => {
      it('status: 200, responds with an array of all topics', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics.length).to.equal(3);
          });
      });
    });
    describe('INVALID METHODS', () => {
      it('status: 405, for methods DELETE, PATCH, POST, PUT', () => {
        const invalidMethods = ['delete', 'patch', 'post', 'put'];
        const promises = invalidMethods.map(method => {
          return request(app)
            [method]('/api/topics')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Method not allowed.');
            });
        });
        return Promise.all(promises);
      });
    });
  });
  describe('/users', () => {
    describe('/:username', () => {
      describe('GET', () => {
        it('status 200, responds with object of requested user', () => {
          return request(app)
            .get('/api/users/butter_bridge')
            .expect(200)
            .then(({ body: { user } }) => {
              expect(user.username).to.equal('butter_bridge');
              expect(user.name).to.equal('jonny');
              expect(user.avatar_url).to.equal(
                'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
              );
            });
        });
        it('status: 404, where user does not exist', () => {
          return request(app)
            .get('/api/users/fakeUser99')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('User not found.');
            });
        });
      });
      describe('INVALID METHODS', () => {
        it('status: 405, for methods DELETE, PATCH, POST, PUT', () => {
          const invalidMethods = ['delete', 'patch', 'post', 'put'];
          const promises = invalidMethods.map(method => {
            return request(app)
              [method]('/api/users/butter_bridge')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Method not allowed.');
              });
          });
          return Promise.all(promises);
        });
      });
    });
  });
  describe('/articles', () => {
    describe('GET', () => {
      it('status: 200, responds with an array of all article objects (no query)', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an('array');
            expect(articles.length).to.equal(12);
            expect(articles[0]).to.contain.keys('comment_count');
          });
      });
      describe('QUERIES', () => {
        describe('status: 200', () => {
          it('defaults to `sort_by=created_at&order=desc', () => {
            return request(app)
              .get('/api/articles')
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).to.be.descendingBy('created_at');
              });
          });
          it('accepts `sort_by=author`', () => {
            return request(app)
              .get('/api/articles?sort_by=author')
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).to.be.descendingBy('author');
              });
          });
          it('accepts `sort_by=title`', () => {
            return request(app)
              .get('/api/articles?sort_by=title')
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).to.be.descendingBy('title');
              });
          });
          it('accepts `sort_by=article_id&order=asc`', () => {
            return request(app)
              .get('/api/articles?sort_by=article_id&order=asc')
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).to.be.ascendingBy('article_id');
              });
          });
          it('accepts `sort_by=topic`', () => {
            return request(app)
              .get('/api/articles?sort_by=topic')
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).to.be.descendingBy('topic');
              });
          });
          it('accepts `sort_by=created_at`', () => {
            return request(app)
              .get('/api/articles?sort_by=created_at')
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).to.be.descendingBy('created_at');
              });
          });
          it('accepts `sort_by=votes`', () => {
            return request(app)
              .get('/api/articles?sort_by=votes')
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).to.be.descendingBy('votes');
              });
          });
          it('accepts `sort_by=comment_count`', () => {
            return request(app)
              .get('/api/articles?sort_by=comment_count')
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).to.be.descendingBy('comment_count');
              });
          });
          it('accepts `author=*******`', () => {
            return request(app)
              .get('/api/articles?author=butter_bridge')
              .expect(200)
              .then(({ body: { articles } }) => {
                const promises = articles.map(article => {
                  expect(article.author).to.equal('butter_bridge');
                });
                return Promise.all(promises);
              });
          });
          it('accepts `topic=*******`', () => {
            return request(app)
              .get('/api/articles?topic=cats')
              .expect(200)
              .then(({ body: { articles } }) => {
                const promises = articles.map(article => {
                  expect(article.topic).to.equal('cats');
                });
                return Promise.all(promises);
              });
          });
          it('accepts `author=******* AND topic=*******`', () => {
            return request(app)
              .get('/api/articles?topic=mitch&author=icellusedkars')
              .expect(200)
              .then(({ body: { articles } }) => {
                const promises = articles.map(article => {
                  expect(article.topic).to.equal('mitch');
                  expect(article.author).to.equal('icellusedkars');
                });
                return Promise.all(promises);
              });
          });
          it('accepts multiple queries', () => {
            return request(app)
              .get(
                '/api/articles?topic=mitch&author=icellusedkars&sort_by=votes&order=asc'
              )
              .expect(200)
              .then(({ body: { articles } }) => {
                const promises = articles.map(article => {
                  expect(article.topic).to.equal('mitch');
                  expect(article.author).to.equal('icellusedkars');
                });
                expect(articles).to.be.ascendingBy('votes');
                return Promise.all(promises);
              });
          });
        });
        describe('errors', () => {
          it('status: 200, ignores invalid query and defaults', () => {
            return request(app)
              .get('/api/articles?sortEverything=author')
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).to.be.descendingBy('created_at');
              });
          });
          it('status: 400, where query value is invalid column name', () => {
            return request(app)
              .get('/api/articles?sort_by=tallest_author')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Bad request - invalid query.');
              });
          });
          it('status: 404, where author does not exist', () => {
            return request(app)
              .get('/api/articles?author=TEST_AUTHOR')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Author not found.');
              });
          });
          it('status: 404, where topic does not exist', () => {
            return request(app)
              .get('/api/articles?topic=TEST_TOPIC')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Topic not found.');
              });
          });
        });
      });
    });
    describe('INVALID METHODS', () => {
      it('status: 405, for methods DELETE, PATCH, PUT, POST', () => {
        const invalidMethods = ['delete', 'patch', 'put', 'post'];
        const promises = invalidMethods.map(method => {
          return request(app)
            [method]('/api/articles')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Method not allowed.');
            });
        });
        return Promise.all(promises);
      });
    });
    describe('/:article_id', () => {
      describe('GET', () => {
        it('status: 200, responds with object of requested article', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.author).to.equal('butter_bridge');
              expect(article.title).to.equal(
                'Living in the shadow of a great man'
              );
              expect(article.article_id).to.equal(1);
              expect(article.body).to.equal(
                'I find this existence challenging'
              );
              expect(article.topic).to.equal('mitch');
              expect(article.created_at).to.equal('2018-11-15T12:21:54.171Z');
              expect(article.votes).to.equal(100);
              expect(article.comment_count).to.equal(13);
            });
        });
        it('status: 400, where given article_id is invalid', () => {
          return request(app)
            .get('/api/articles/notValid')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Bad request.');
            });
        });
        it('status: 404, where article does not exist', () => {
          return request(app)
            .get('/api/articles/9999')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Article not found.');
            });
        });
      });
      describe('PATCH', () => {
        it('status: 200, responds with the updated article (increment votes)', () => {
          const input = { inc_votes: 50 };
          return request(app)
            .patch('/api/articles/1')
            .send(input)
            .expect(200)
            .then(({ body: { updatedArticle } }) => {
              expect(updatedArticle.votes).to.equal(150);
              expect(updatedArticle.topic).to.equal('mitch');
              expect(updatedArticle.comment_count).to.equal(13);
            });
        });
        it('status: 200, responds with the updated article (decrement votes)', () => {
          const input = { inc_votes: -5 };
          return request(app)
            .patch('/api/articles/1')
            .send(input)
            .expect(200)
            .then(({ body: { updatedArticle } }) => {
              expect(updatedArticle.votes).to.equal(95);
              expect(updatedArticle.topic).to.equal('mitch');
              expect(updatedArticle.comment_count).to.equal(13);
            });
        });
        it('status: 400, where given article_id is invalid', () => {
          return request(app)
            .patch('/api/articles/notValid')
            .send({ inc_votes: 10 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Bad request.');
            });
        });
        it('status: 400, where request body object has no `inc_votes` key', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ testKey: 10 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                'Bad request - `inc_votes` must be a number.'
              );
            });
        });
        it('status: 400, where request body object has invalid value for `inc_votes`', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 'hello' })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                'Bad request - `inc_votes` must be a number.'
              );
            });
        });
        it('status: 404, where article does not exist', () => {
          return request(app)
            .patch('/api/articles/9999')
            .send({ inc_votes: 10 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Article not found.');
            });
        });
      });
      describe('INVALID METHODS', () => {
        it('status: 405, for methods DELETE, POST, PUT', () => {
          const invalidMethods = ['delete', 'post', 'put'];
          const promises = invalidMethods.map(method => {
            return request(app)
              [method]('/api/articles/1')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Method not allowed.');
              });
          });
          return Promise.all(promises);
        });
      });
      describe('/comments', () => {
        describe('POST', () => {
          it('status: 201, returns the posted comment', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({
                username: 'butter_bridge',
                body: 'This is a test comment, a comment about testing'
              })
              .expect(201)
              .then(({ body: { comment } }) => {
                expect(comment.comment_id).to.equal(19);
                expect(comment.author).to.equal('butter_bridge');
                expect(comment.article_id).to.equal(1);
                expect(comment.body).to.equal(
                  'This is a test comment, a comment about testing'
                );
              });
          });
          it('status: 400, where given article_id is invalid', () => {
            return request(app)
              .post('/api/articles/INVALID/comments')
              .send({
                username: 'butter_bridge',
                body: 'This is a test comment, a comment about testing'
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal(
                  'Bad request - `article_id` must be a number.'
                );
              });
          });
          it('status: 400, where request body object contains invalid values', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({
                username: 12,
                body: 'This is a test comment, a comment about testing'
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal(
                  'Bad request - input values must be strings.'
                );
              });
          });
          it('status: 400, where request body object is missing `username` or `body` keys', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({
                invalidKey: 'butter_bridge',
                body: 'This is a test comment, a comment about testing'
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal(
                  'Bad request - input must have keys `username` and `body`.'
                );
              });
          });
          it('status: 422, where article referenced in another table does not exist', () => {
            return request(app)
              .post('/api/articles/9999/comments')
              .send({
                username: 'butter_bridge',
                body: 'This is a test comment, a comment about testing'
              })
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Unprocessable entity.');
              });
          });
        });
        describe('GET', () => {
          it('status: 200, returns the requested comments', () => {
            return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.an('array');
                expect(comments.length).to.equal(13);
                expect(comments[0].article_id).to.equal(1);
              });
          });
          it('status: 400, where given article_id is invalid', () => {
            return request(app)
              .get('/api/articles/INVALID/comments')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal(
                  'Bad request - `article_id` must be a number.'
                );
              });
          });
          it('status: 404, where given article_id is valid but does not exist', () => {
            return request(app)
              .get('/api/articles/9999/comments')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Article not found.');
              });
          });
          describe('QUERIES', () => {
            it('defaults to `sort_by=created_at&order=desc', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.descendingBy('created_at');
                });
            });
            it('accepts `sort_by=comment_id`', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=comment_id')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.descendingBy('comment_id');
                });
            });
            it('accepts `sort_by=votes&order=asc`', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=votes&order=asc')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.ascendingBy('votes');
                });
            });
            it('accepts `sort_by=author`', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=author')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.descendingBy('author');
                });
            });
            it('status: 200, ignores invalid query and defaults', () => {
              return request(app)
                .get('/api/articles/1/comments?filter_by=author')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.descendingBy('created_at');
                });
            });
            it('status: 400, where query value is invalid column name', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=tallest_author')
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('Bad request - invalid query.');
                });
            });
          });
        });
        describe('INVALID METHODS', () => {
          it('status: 405, for methods DELETE, PATCH, PUT', () => {
            const invalidMethods = ['delete', 'patch', 'put'];
            const promises = invalidMethods.map(method => {
              return request(app)
                [method]('/api/articles/1/comments')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('Method not allowed.');
                });
            });
            return Promise.all(promises);
          });
        });
      });
    });
  });
  describe('/comments', () => {
    describe('/:comment_id', () => {
      describe('PATCH', () => {
        it('status: 200, responds with the updated comment (increment votes)', () => {
          const input = { inc_votes: 50 };
          return request(app)
            .patch('/api/comments/1')
            .send(input)
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment.votes).to.equal(66);
            });
        });
        it('status: 200, responds with the updated comment (decrement votes)', () => {
          const input = { inc_votes: -100 };
          return request(app)
            .patch('/api/comments/1')
            .send(input)
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment.votes).to.equal(-84);
            });
        });
        it('status: 400, where given article_id is invalid', () => {
          return request(app)
            .patch('/api/comments/INVALID')
            .send({ inc_votes: 10 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Bad request.');
            });
        });
        it('status: 400, where request body object has no `inc_votes` key', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ testKey: 10 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                'Bad request - `inc_votes` must be a number.'
              );
            });
        });
        it('status: 400, where request body object has invalid value for `inc_votes`', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 'hello' })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                'Bad request - `inc_votes` must be a number.'
              );
            });
        });
        it('status: 404, where comment does not exist', () => {
          return request(app)
            .patch('/api/comments/9999')
            .send({ inc_votes: 10 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Comment not found.');
            });
        });
      });
      describe('DELETE', () => {
        it('status: 204, no content to respond with', () => {
          return request(app)
            .delete('/api/comments/1')
            .expect(204);
        });
        it('status: 400, where given `comment_id` is invalid', () => {
          return request(app)
            .delete('/api/comments/DELETE_COMMENT')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Bad request.');
            });
        });
        it('status: 404, where comment does not exist', () => {
          return request(app)
            .delete('/api/comments/9999')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Comment not found.');
            });
        });
      });
      describe('INVALID METHODS', () => {
        it('status: 405, for methods GET, POST, PUT', () => {
          const invalidMethods = ['get', 'post', 'put'];
          const promises = invalidMethods.map(method => {
            return request(app)
              [method]('/api/comments/1')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Method not allowed.');
              });
          });
          return Promise.all(promises);
        });
      });
    });
  });
  describe('General 404 errors', () => {
    it('status:404, (general) path not found', () => {
      return request(app)
        .get('/api/not_found')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal('Page not found.');
        });
    });
  });
});
