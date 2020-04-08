const gameState = {
  hostHand: ['AH', '3C'],
  opponentHand: ['5D', '9S'],
};

module.exports = [
  {
    title: 'game 1',
    host_id: 1,
    game_state: JSON.stringify(gameState),
  },
  {
    title: 'game 2',
    host_id: 2,
    game_state: JSON.stringify(gameState),
  },
  {
    title: 'rando game',
    host_id: 2,
    game_state: JSON.stringify(gameState),
  },
];
