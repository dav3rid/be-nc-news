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
  describe('/users/:username', () => {
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
    });
    describe('404 error', () => {
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
  describe('/articles', () => {
    describe('/:article_id', () => {
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
            expect(article.body).to.equal('I find this existence challenging');
            expect(article.topic).to.equal('mitch');
            expect(article.created_at).to.equal('2018-11-15T12:21:54.171Z');
            expect(article.votes).to.equal(100);
            expect(article.comment_count).to.equal(13);
          });
      });
    });
  });
  describe('404 errors', () => {
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
