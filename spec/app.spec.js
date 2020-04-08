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
  describe('/users', () => {
    describe('GET', () => {
      it('status: 200, responds with an array of all users', () => {
        return request(app)
          .get('/api/users')
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users.length).to.equal(2);
          });
      });
    });
    describe('POST', () => {
      it('status: 201, responds with a new user', () => {
        return request(app)
          .post('/api/users')
          .send({ name: 'Barry' })
          .expect(201)
          .then(({ body: { user } }) => {
            expect(user).to.eql({ user_id: 3, name: 'Barry' });
          });
      });
    });
    describe('INVALID METHODS', () => {
      it('status: 405, for methods DELETE, PATCH, PUT', () => {
        const invalidMethods = ['delete', 'patch', 'put'];
        const promises = invalidMethods.map(method => {
          return request(app)
            [method]('/api/users')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Method not allowed.');
            });
        });
        return Promise.all(promises);
      });
    });
    describe('/user_id', () => {
      describe('GET', () => {
        it('status: 200, responds with an single user', () => {
          return request(app)
            .get('/api/users/1')
            .expect(200)
            .then(({ body: { user } }) => {
              expect(user.name).to.equal('Dave');
            });
        });
      });
      describe('INVALID METHODS', () => {
        it('status: 405, for methods DELETE, PATCH, POST, PUT', () => {
          const invalidMethods = ['delete', 'patch', 'put', 'post'];
          const promises = invalidMethods.map(method => {
            return request(app)
              [method]('/api/users/1')
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
  describe('/games', () => {
    describe('GET', () => {
      it('status: 200, responds with an array of all games', () => {
        return request(app)
          .get('/api/games')
          .expect(200)
          .then(({ body: { games } }) => {
            expect(games.length).to.equal(3);
          });
      });
      it('status: 200, responds with games belonging to a user', () => {
        return request(app)
          .get('/api/games?host_id=2')
          .expect(200)
          .then(({ body: { games } }) => {
            expect(games.length).to.equal(2);
          });
      });
    });
    describe('POST', () => {
      it('status: 201, responds with a new game', () => {
        return request(app)
          .post('/api/games')
          .send({
            title: 'a new test game',
            host_id: 1,
            game_state: {
              hostFinalThree: ['JC', '3S', '9D'],
              opponentFinalThree: ['AD', '4H', '6C'],
              hostPenultimateThree: [],
              opponentPenultimateThree: [],
              hostHand: ['9C', '4S', '7D', '2H', '5H', '3H'],
              opponentHand: ['AS', '2S', '5S', '6S', '7S', '8S'],
              playableDeck: [],
              pickUpDeck: [],
              burnedDeck: [],
            },
          })
          .expect(201)
          .then(({ body: { game } }) => {
            expect(game.game_state).to.eql({
              hostFinalThree: ['JC', '3S', '9D'],
              opponentFinalThree: ['AD', '4H', '6C'],
              hostPenultimateThree: [],
              opponentPenultimateThree: [],
              hostHand: ['9C', '4S', '7D', '2H', '5H', '3H'],
              opponentHand: ['AS', '2S', '5S', '6S', '7S', '8S'],
              playableDeck: [],
              pickUpDeck: [],
              burnedDeck: [],
            });
            expect(game.game_id).to.equal(4);
            expect(game.host_id).to.equal(1);
          });
      });
    });
    describe('INVALID METHODS', () => {
      it('status: 405, for methods DELETE, PATCH, PUT', () => {
        const invalidMethods = ['delete', 'patch', 'put'];
        const promises = invalidMethods.map(method => {
          return request(app)
            [method]('/api/games')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Method not allowed.');
            });
        });
        return Promise.all(promises);
      });
    });
    describe('/game_id', () => {
      describe('GET', () => {
        it('status: 200, responds with a single game', () => {
          return request(app)
            .get('/api/games/1')
            .expect(200)
            .then(({ body: { game } }) => {
              expect(game).to.contain.keys('title', 'host_id', 'game_state');
            });
        });
      });

      describe('INVALID METHODS', () => {
        it('status: 405, for methods DELETE, PATCH, POST, PUT', () => {
          const invalidMethods = ['delete', 'patch', 'put', 'post'];
          const promises = invalidMethods.map(method => {
            return request(app)
              [method]('/api/games/1')
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
