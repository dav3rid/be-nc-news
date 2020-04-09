const gameState = {
  hostFinalThree: ['JC', '3S', '9D'],
  opponentFinalThree: ['AD', '4H', '6C'],
  hostPenultimateThree: [],
  opponentPenultimateThree: [],
  hostHand: ['9C', '4S', '7D', '2H', '5H', '3H'],
  opponentHand: ['AS', '2S', '5S', '6S', '7S', '8S'],
  playableDeck: [],
  pickUpDeck: [],
  burnedDeck: [],
};

module.exports = [
  {
    title: 'game 1',
    host_id: 1,
    opponent_id: 2,
    current_turn_id: 1,
    game_state: JSON.stringify(gameState),
  },
  {
    title: 'game 2',
    host_id: 2,
    opponent_id: 1,
    current_turn_id: 2,
    game_state: JSON.stringify(gameState),
  },
  {
    title: 'rando game',
    host_id: 2,
    opponent_id: 1,
    current_turn_id: 1,
    game_state: JSON.stringify(gameState),
  },
];
