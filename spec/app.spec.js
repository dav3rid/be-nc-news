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
      describe('QUERIES', () => {
        it('`host_id=2` responds with games belonging to a user', () => {
          return request(app)
            .get('/api/games?host_id=2')
            .expect(200)
            .then(({ body: { games } }) => {
              expect(games.length).to.equal(2);
            });
        });
        it('`available=true` responds with an array of available games', () => {
          const promises = [
            request(app).post('/api/games').send({
              title: 'a new test game',
              host_id: 1,
            }),
            request(app).post('/api/games').send({
              title: 'another game',
              host_id: 1,
            }),
            request(app).post('/api/games').send({
              title: 'getting lonely',
              host_id: 1,
            }),
          ];
          return Promise.all(promises).then(() => {
            return request(app)
              .get('/api/games?available=true')
              .expect(200)
              .then(({ body: { games } }) => {
                expect(games.length).to.equal(3);
              });
          });
        });
      });
    });
    describe('POST', () => {
      it('status: 201, responds with a new game - no game state', () => {
        return request(app)
          .post('/api/games')
          .send({
            title: 'a new test game',
            host_id: 1,
          })
          .expect(201)
          .then(({ body: { game } }) => {
            expect(game.game_id).to.equal(4);
            expect(game.host_id).to.equal(1);
            expect(game.opponent_id).to.equal(null);
            expect(game.current_turn_id).to.equal(null);
            expect(game.title).to.equal('a new test game');
            expect(game.game_state).to.eql({ msg: 'no game state' });
          });
      });
    });
    describe('INVALID METHODS', () => {
      it('status: 405, for methods DELETE, PUT, PATCH', () => {
        const invalidMethods = ['delete', 'put', 'patch'];
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
        describe('ERRORS', () => {
          it('staus: 404, GAME NOT FOUND', () => {
            return request(app)
              .get('/api/games/999')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Game not found.');
              });
          });
        });
      });
      describe('PATCH', () => {
        it('MOVE, responds with an updated game_state', () => {
          return request(app)
            .patch('/api/games/2')
            .send({
              game_state: {
                hostFinalThree: ['AC'],
                opponentFinalThree: ['AD', '4H', '6C'],
                hostPenultimateThree: [],
                opponentPenultimateThree: [],
                hostHand: [],
                opponentHand: [],
                playableDeck: [],
                pickUpDeck: [],
                burnedDeck: [],
              },
            })
            .expect(200)
            .then(({ body: { game } }) => {
              expect(game.game_id).to.equal(2);
              expect(game.host_id).to.equal(2);
              expect(game.opponent_id).to.equal(1);
              expect(game.current_turn_id).to.equal(2);
              expect(game.game_state).to.eql({
                hostFinalThree: ['AC'],
                opponentFinalThree: ['AD', '4H', '6C'],
                hostPenultimateThree: [],
                opponentPenultimateThree: [],
                hostHand: [],
                opponentHand: [],
                playableDeck: [],
                pickUpDeck: [],
                burnedDeck: [],
              });
            });
        });
        it('JOIN, joins available game - responds with updated opponent_id ', () => {
          return request(app)
            .post('/api/games')
            .send({
              title: 'a new test game',
              host_id: 1,
            })
            .then(() => {
              return request(app)
                .patch('/api/games/4')
                .send({ opponent_id: 2 })
                .expect(200)
                .then(({ body: { game } }) => {
                  expect(game.game_id).to.equal(4);
                  expect(game.host_id).to.equal(1);
                  expect(game.opponent_id).to.equal(2);
                  expect(game.current_turn_id).to.equal(null);
                  expect(game.game_state).to.eql({ msg: 'no game state' });
                });
            });
        });
      });
      describe('DELETE', () => {
        it('status: 204, deletes a game', () => {
          return request(app)
            .delete('/api/games/1')
            .expect(204)
            .then(() => {
              return request(app).get('/api/games/1').expect(404);
            });
        });
      });
      describe('INVALID METHODS', () => {
        it('status: 405, for methods DELETE, POST, PUT', () => {
          const invalidMethods = ['put', 'post'];
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
