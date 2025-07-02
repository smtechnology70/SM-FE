import React from "react";

import { getStyleObject } from "../../utils";
import { COIN_PLACEHOLDER_SIZE, COIN_SIZE } from "../../../globalConstants";

import { Coin } from "./Coin";

import styles from "./CoinPlaceholder.module.css";

export class CoinPlaceholder extends React.PureComponent {
  render() {
    const { baseColor, isCoinHidden } = this.props;
    return (
      <div
        className={styles.Container}
        style={getStyleObject(COIN_PLACEHOLDER_SIZE, COIN_PLACEHOLDER_SIZE)}
      >
        <div
          className={styles.Circle}
          style={getStyleObject(COIN_SIZE, COIN_SIZE, baseColor)}
        >
          {isCoinHidden ? null : (
            <Coin
              baseColor={baseColor}
              onCoinClicked={() => this.props.onCoinClicked()}
            />
          )}
        </div>
      </div>
    );
  }
}
