const ActionTypes = {
  GET_INITIAL_GAME_DATA: "ludo/GET_INITIAL_GAME_DATA",
  GET_INITIAL_GAME_DATA_SUCCESS: "ludo/GET_INITIAL_GAME_DATA_SUCCESS",
  SPAWN_COIN: "ludo/SPAWN_COIN",
  SPAWN_COIN_SUCCESS: "ludo/SPAWN_COIN_SUCCESS",
  MOVE_COIN: "ludo/MOVE_COIN",
  MOVE_COIN_SUCCESS: "ludo/MOVE_COIN_SUCCESS",
  MOVE_COIN_FAILURE: "ludo/MOVE_COIN_FAILURE",
  LIFT_COIN: "ludo/LIFT_COIN",
  PLACE_COIN: "ludo/PLACE_COIN",
  DISQUALIFY_COIN: "ludo/DISQUALIFY_COIN",
  HOME_COIN: "ludo/HOME_COIN",
  NEXT_TURN: "ludo/NEXT_TURN",
  PASS_TURN_TO: "ludo/PASS_TURN_TO",
  MARK_CURRENT_BASE: "ludo/MARK_CURRENT_BASE",
  MARK_WINNER: "ludo/MARK_WINNER",
  SET_PLAYERS: "ludo/SET_PLAYERS",
  ENABLE_BASE: "ludo/ENABLE_BASE",
};

export { ActionTypes };

export const getInitialGameData = () => ({
  type: ActionTypes.GET_INITIAL_GAME_DATA,
});

export const getInitialGameDataSuccess = (gameData) => ({
  data: { gameData },
  type: ActionTypes.GET_INITIAL_GAME_DATA_SUCCESS,
});

export const spawnCoin = (baseID, coinID) => ({
  data: { baseID, coinID },
  type: ActionTypes.SPAWN_COIN,
});

export const spawnCoinSuccess = (cellID, coinID, baseID, position) => ({
  data: { cellID, coinID, position },
  type: ActionTypes.SPAWN_COIN_SUCCESS,
});

export const moveCoin = (coinID, walkwayPosition, cellID) => ({
  data: { cellID, coinID, walkwayPosition },
  type: ActionTypes.MOVE_COIN,
});

export const placeCoin = (cellID, coinID, walkwayPosition) => ({
  data: { cellID, coinID, walkwayPosition },
  type: ActionTypes.PLACE_COIN,
});

export const liftCoin = (cellID, coinID, walkwayPosition) => ({
  data: { cellID, coinID, walkwayPosition },
  type: ActionTypes.LIFT_COIN,
});

export const nextTurn = () => ({
  type: ActionTypes.NEXT_TURN,
});

export const passTurnTo = (baseID) => ({
  data: { baseID },
  type: ActionTypes.PASS_TURN_TO,
});

export const markCurrentBase = (spawnable) => ({
  data: { spawnable },
  type: ActionTypes.MARK_CURRENT_BASE,
});

export const markWinner = (baseID) => ({
  data: { baseID },
  type: ActionTypes.MARK_WINNER,
});

export const moveCoinSuccess = (bonusChance, coinID, currentDieRoll) => ({
  data: { bonusChance, currentDieRoll, coinID },
  type: ActionTypes.MOVE_COIN_SUCCESS,
});

export const moveCoinFailure = () => ({
  type: ActionTypes.MOVE_COIN_FAILURE,
});

export const disqualifyCoin = (coinID, walkwayPosition, cellID) => ({
  data: { coinID, walkwayPosition, cellID },
  type: ActionTypes.DISQUALIFY_COIN,
});

export const homeCoin = (coinID) => ({
  data: { coinID },
  type: ActionTypes.HOME_COIN,
});

export const setPlayers = (playerCount) => ({
  data: { playerCount },
  type: ActionTypes.SET_PLAYERS,
});

export const enableBase = (baseID) => ({
  data: { baseID },
  type: ActionTypes.ENABLE_BASE,
});
