import classnames from "classnames";
import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { PlayerAvatar } from "./components/PlayerAvatar";
import { Coin } from "../Base/components/Coin";
import { Dice } from "../Dice/Container";
import { basesSelector, coinsSelector } from "../Ludo/state/selectors";

import styles from "./Container.module.css";

const mapStateToProps = createStructuredSelector({
  bases: basesSelector,
  coins: coinsSelector,
});

class PlayerBare extends React.PureComponent {
  render() {
    const { baseID, bases, placement, disabled } = this.props;
    const placementClass =
      placement === "top" ? styles.TopPlacement : styles.BottomPlacement;
    const disabledClass = disabled ? styles.Disabled : null;
    const base = bases[baseID];
    return base && base.enabled ? (
      <div
        className={classnames(styles.Container, placementClass, disabledClass)}
      >
        <PlayerAvatar baseColor={base.color} />
        {!disabled && <Dice baseColor={base.color} />}
        <div className={styles.RetiredCoins}>
          {base.coinIDs
            .filter((coinID) => this.props.coins[coinID].isRetired)
            .map((coin, index) => (
              <Coin
                baseColor={base.color}
                onCoinClicked={() => null}
                key={index}
              />
            ))}
        </div>
      </div>
    ) : null;
  }
}

export const Player = connect(mapStateToProps)(PlayerBare);
