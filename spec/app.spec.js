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
