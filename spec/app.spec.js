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
  });
});
