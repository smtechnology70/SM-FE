import { integer, MersenneTwister19937 } from "random-js";
import { call, put, select, take, takeLatest } from "redux-saga/effects";

import {
  markCurrentBase,
  moveCoin,
  nextTurn,
  spawnCoin,
  ActionTypes as LudoActionTypes,
} from "../../Ludo/state/actions";
import {
  basesSelector,
  coinsSelector,
  currentTurnSelector,
} from "../../Ludo/state/selectors";
import {
  enableDie,
  invalidateDieRoll,
  rollDieComplete,
  ActionTypes,
} from "./actions";
import { Rolls } from "./interfaces";
import { getMovableCoins } from "../../Ludo/state/sagas";

function* watchForRollDie() {
  yield takeLatest(ActionTypes.ROLL_DIE, rollDieSaga);
}

function* rollDieSaga() {
  const mt = MersenneTwister19937.autoSeed();
  const dieRoll = integer(Rolls.ONE, Rolls.SIX)(mt);
  yield put(rollDieComplete(dieRoll));
}

function* watchForRollDieComplete() {
  yield takeLatest(ActionTypes.ROLL_DIE_COMPLETE, rollDieCompleteSaga);
}

function* rollDieCompleteSaga(action) {
  const { value } = action.data;
  const currentTurn = yield select(currentTurnSelector);
  const bases = yield select(basesSelector);
  const coins = yield select(coinsSelector);
  const currentTurnBase = bases[currentTurn];
  const spawnedCoinIDs = currentTurnBase.coinIDs.filter(
    (coinID) => coins[coinID].isSpawned && !coins[coinID].isRetired
  );
  const movableCoins = yield call(getMovableCoins, value);
  const spawnableCoins = bases[currentTurn].coinIDs.filter(
    (coinID) => !coins[coinID].isSpawned && !coins[coinID].isRetired
  );
  if (
    value === Rolls.SIX &&
    (spawnableCoins.length > 0 || movableCoins.length > 0)
  ) {
    if (
      (spawnedCoinIDs.length === 0 || movableCoins.length === 0) &&
      spawnableCoins.length > 0
    ) {
      yield put(spawnCoin(currentTurnBase.ID, spawnableCoins[0]));
      yield take([
        LudoActionTypes.SPAWN_COIN_SUCCESS,
        LudoActionTypes.MOVE_COIN_SUCCESS,
      ]);
    } else {
      yield put(markCurrentBase(true));
      yield take([
        LudoActionTypes.SPAWN_COIN_SUCCESS,
        LudoActionTypes.MOVE_COIN_SUCCESS,
      ]);
      yield put(markCurrentBase(false));
    }
    yield put(enableDie());
  } else if (spawnedCoinIDs.length > 0) {
    // Automove if only one coin is spawned
    if (spawnedCoinIDs.length === 1) {
      const coinID = spawnedCoinIDs[0];
      const coin = coins[coinID];
      yield put(moveCoin(coinID, coin.position, coin.cellID));
    } else if (movableCoins.length === 1) {
      const coinID = movableCoins[0];
      const coin = coins[coinID];
      yield put(moveCoin(coinID, coin.position, coin.cellID));
    }
  } else {
    yield put(invalidateDieRoll());
    yield put(nextTurn());
    yield put(enableDie());
  }
}

export const sagas = [watchForRollDie, watchForRollDieComplete];
