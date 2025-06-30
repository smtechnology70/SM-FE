import classnames from "classnames";
import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { isDieRollValidSelector } from "../Dice/state/selectors";
import { spawnCoin } from "../Ludo/state/actions";
import { basesSelector, coinsSelector } from "../Ludo/state/selectors";
import { getStyleObject } from "../utils";
import { BASE_SIZE, INNER_BASE_SIZE } from "../../globalConstants";
import styles from "./Container.module.css";
import { CoinPlaceholder } from "./components/CoinPlaceholder";

const mapDispatchToProps = {
  spawnCoin,
};

const mapStateToProps = createStructuredSelector({
  bases: basesSelector,
  coins: coinsSelector,
  isDieRollValid: isDieRollValidSelector,
});

class BaseBare extends React.PureComponent {
  render() {
    const { baseID, bases } = this.props;
    const base = bases[baseID];
    const spawnableClass = base.spawnable ? styles.Spawnable : null;

    return (
      <div
        className={styles.OuterContainer}
        style={getStyleObject(BASE_SIZE, BASE_SIZE, base.color)}
      >
        <div
          className={classnames(styles.InnerContainer, spawnableClass)}
          style={getStyleObject(INNER_BASE_SIZE, INNER_BASE_SIZE)}
        >
          {base.coinIDs.map((coinID, index) => {
            const coin = this.props.coins[coinID];
            return (
              <CoinPlaceholder
                key={index}
                baseColor={base.color}
                isCoinHidden={
                  !this.props.enabled || coin.isSpawned || coin.isRetired
                }
                onCoinClicked={() => this.onCoinClicked(base, coin)}
              />
            );
          })}
        </div>
      </div>
    );
  }

  onCoinClicked = (base, coin) => {
    if (base.spawnable && this.props.isDieRollValid) {
      this.props.spawnCoin(base.ID, coin.coinID);
    }
  };
}

export const Base = connect(mapStateToProps, mapDispatchToProps)(BaseBare);
