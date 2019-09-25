process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest');
const connection = require('../db/connection');

after(() => connection.destroy());
beforeEach(() => connection.seed.run());

describe('/api', () => {
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
                expect(msg).to.equal(
                  'Unprocessable entity - article does not exist.'
                );
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
