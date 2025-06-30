import React from "react";
import styles from "./Coin.module.css";
import { getStyleObject } from "../../utils";
import { COIN_SIZE } from "../../../globalConstants";

export class Coin extends React.PureComponent {
  render() {
    const { coinSize = COIN_SIZE } = this.props;
    return (
      <div
        className={styles.Container}
        style={getStyleObject(
          coinSize * 0.8,
          coinSize * 0.8,
          this.props.baseColor
        )}
        onClick={() => this.props.onCoinClicked()}
      />
    );
  }
}
