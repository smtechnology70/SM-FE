import { call, delay, put, select, takeLatest } from "redux-saga/effects";
import { mapByProperty } from "../../../common/utils";
import { GAMEDATA } from "../../../constants";
import { WINNING_MOVES } from "../../../globalConstants";
import { enableDie, invalidateDieRoll } from "../../Dice/state/actions";
import { Rolls } from "../../Dice/state/interfaces";
import { currentDieRollSelector } from "../../Dice/state/selectors";
import {
  ActionTypes,
  disqualifyCoin,
  enableBase,
  getInitialGameDataSuccess,
  homeCoin,
  liftCoin,
  markWinner,
  moveCoinFailure,
  moveCoinSuccess,
  nextTurn,
  passTurnTo,
  placeCoin,
  spawnCoinSuccess,
} from "./actions";
import { BaseID, CellType } from "./interfaces";
import {
  basesSelector,
  cellsSelector,
  coinsSelector,
  currentTurnSelector,
  linksSelector,
  walkwaysSelector,
} from "./selectors";

function* watchForGetInitialGameData() {
  yield takeLatest(ActionTypes.GET_INITIAL_GAME_DATA, getInitialGameDataSaga);
}

function* getInitialGameDataSaga() {
  const data = GAMEDATA;
  const basesArray = data.bases.map((base) => ({ ...base, spawnable: false }));
  const bases = mapByProperty(basesArray, "ID");
  const coins = data.coins.map((coin) => ({
    ...coin,
    color: bases[coin.baseID].color,
  }));
  const gameData = {
    bases,
    cells: data.cells,
    coins: mapByProperty(coins, "coinID"),
    currentTurn: BaseID.BASE_3,
    links: data.links,
    relationships: data.relationships,
    walkways: mapByProperty(data.walkways, "ID"),
  };
  yield put(getInitialGameDataSuccess(gameData));
}

function* watchForSpawnCoin() {
  yield takeLatest(ActionTypes.SPAWN_COIN, spawnCoinSaga);
}

function* spawnCoinSaga(action) {
  const { baseID, coinID } = action.data;
  const bases = yield select(basesSelector);
  const walkways = yield select(walkwaysSelector);
  const cells = yield select(cellsSelector);
  const base = bases[baseID];
  const walkway = Object.values(walkways).find(
    (walkway) => walkway.baseID === baseID
  );
  const walkwayCells = cells[walkway.position];
  const spawnCellForCoin = Object.values(walkwayCells).find(
    (cell) => cell.cellType === CellType.SPAWN
  );
  const coinIDToSpawn = base.coinIDs.find((ID) => ID === coinID);

  yield put(
    spawnCoinSuccess(
      spawnCellForCoin.cellID,
      coinIDToSpawn,
      baseID,
      walkway.position
    )
  );
  yield put(invalidateDieRoll());
}

function* watchForMoveCoin() {
  yield takeLatest(ActionTypes.MOVE_COIN, moveCoinSaga);
}

function* isCurrentMoveValid(coinID, stepsToTake) {
  const coins = yield select(coinsSelector);
  const coin = coins[coinID];
  return coin.steps + stepsToTake <= WINNING_MOVES;
}

export function* getMovableCoins(stepsToTake) {
  const coins = yield select(coinsSelector);
  const currentTurnBase = yield select(currentTurnSelector);
  const bases = yield select(basesSelector);
  const movableCoins = bases[currentTurnBase].coinIDs.filter(
    (coinID) =>
      coins[coinID].isSpawned &&
      !coins[coinID].isRetired &&
      coins[coinID].steps + stepsToTake <= WINNING_MOVES
  );
  return movableCoins;
}

function* moveCoinSaga(action) {
  let { cellID, walkwayPosition } = { ...action.data };
  const { coinID } = action.data;
  const currentDieRoll = yield select(currentDieRollSelector);

  const movableCoins = yield call(getMovableCoins, currentDieRoll);
  const isCurrentMovePossible = yield call(
    isCurrentMoveValid,
    coinID,
    currentDieRoll
  );

  if (movableCoins.length === 0) {
    yield put(moveCoinFailure());
    yield put(nextTurn());
    yield put(enableDie());
    return;
  } else if (!isCurrentMovePossible) {
    yield put(moveCoinFailure());
    return;
  }

  yield put(invalidateDieRoll());

  let bonusChanceForHomeCoin = false;

  for (let i = 0; i < currentDieRoll; i++) {
    const coins = yield select(coinsSelector);
    const cells = yield select(cellsSelector);
    const links = yield select(linksSelector);
    const nextCells = links[cellID];
    let nextCell;

    // Possibility of entering HOMEPATH
    nextCell =
      nextCells.length > 1
        ? nextCells.find(
            (cell) =>
              cells[cell.position][cell.cellID].cellType ===
                CellType.HOMEPATH &&
              coins[coinID].baseID === cells[cell.position][cell.cellID].baseID
          ) || nextCells[0]
        : nextCells[0];

    yield put(liftCoin(cellID, coinID, walkwayPosition));
    if (nextCell.cellID === "HOME") {
      yield put(homeCoin(coinID));
      bonusChanceForHomeCoin = true;
    } else {
      yield put(placeCoin(nextCell.cellID, coinID, nextCell.position));
    }

    yield delay(100);

    cellID = nextCell.cellID;
    walkwayPosition = nextCell.position;
  }

  const bonusChance =
    bonusChanceForHomeCoin ||
    (yield call(
      performDisqualificationCheck,
      action.data.coinID,
      walkwayPosition,
      cellID
    )) ||
    currentDieRoll === Rolls.SIX;
  yield put(moveCoinSuccess(bonusChance, coinID, currentDieRoll));

  if (!bonusChance) {
    yield put(nextTurn());
  }
  yield put(enableDie());
}

function* performDisqualificationCheck(activeCoinID, walkwayPosition, cellID) {
  if (cellID === "HOME") {
    return false;
  }
  const cells = yield select(cellsSelector);
  const coins = yield select(coinsSelector);

  const activeCoin = coins[activeCoinID];
  const cellInWhichCoinLanded = cells[walkwayPosition][cellID];
  console.log(cellInWhichCoinLanded, activeCoin);
  if (cellInWhichCoinLanded.cellType === CellType.NORMAL) {
    // Check if the coin disqualifies another of a different base
    for (const coinID of cellInWhichCoinLanded.coinIDs) {
      const coin = coins[coinID];
      if (activeCoin.baseID !== coin.baseID) {
        yield put(disqualifyCoin(coinID, walkwayPosition, cellID));
        return true;
      }
    }
  }

  return false;
}

function* watchForNextTurn() {
  yield takeLatest(ActionTypes.NEXT_TURN, nextTurnSaga);
}

function* nextTurnSaga() {
  const currentTurnBase = yield select(currentTurnSelector);
  const bases = yield select(basesSelector);
  let nextTurn = bases[currentTurnBase].nextTurn;
  let nextBaseID = currentTurnBase;
  for (const key in bases) {
    if (bases[key]) {
      nextBaseID = bases[nextBaseID].nextTurn;
      const nextBase = bases[nextBaseID];
      if (nextBase.enabled && !nextBase.hasWon) {
        nextTurn = nextBaseID;
        break;
      }
    }
  }
  yield put(passTurnTo(nextTurn));
}

function* watchForSetPlayers() {
  yield takeLatest(ActionTypes.SET_PLAYERS, setPlayersSaga);
}

function* setPlayersSaga(action) {
  const { playerCount } = action.data;
  switch (playerCount) {
    case 2:
      yield put(enableBase(BaseID.BASE_2));
      yield put(enableBase(BaseID.BASE_3));
      break;
    case 3:
      yield put(enableBase(BaseID.BASE_2));
      yield put(enableBase(BaseID.BASE_3));
      yield put(enableBase(BaseID.BASE_4));
      break;
    case 4:
      yield put(enableBase(BaseID.BASE_1));
      yield put(enableBase(BaseID.BASE_2));
      yield put(enableBase(BaseID.BASE_3));
      yield put(enableBase(BaseID.BASE_4));
      break;
    default:
      return;
  }
}

function* watchForHomeCoin() {
  yield takeLatest(ActionTypes.HOME_COIN, homeCoinSaga);
}

function* homeCoinSaga(action) {
  const { coinID } = action.data;

  const coins = yield select(coinsSelector);
  const bases = yield select(basesSelector);
  const { baseID } = coins[coinID];
  const base = bases[baseID];
  const retiredCoins = base.coinIDs.filter((coinID) => coins[coinID].isRetired);

  const hasWon = retiredCoins.length === base.coinIDs.length;
  if (hasWon) {
    yield put(markWinner(baseID));
  }
}

export const sagas = [
  watchForGetInitialGameData,
  watchForSpawnCoin,
  watchForMoveCoin,
  watchForNextTurn,
  watchForSetPlayers,
  watchForHomeCoin,
];
