import classnames from "classnames";
import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { rollDie } from "./state/actions";
import { CONFIGURATIONS } from "./state/constants";
import {
  currentDieRollSelector,
  isDieRollAllowedSelector,
} from "./state/selectors";
import styles from "./Container.module.css";
import { getStyleObject } from "../utils";
import { DICE_SIZE } from "../../globalConstants";

const mapStateToProps = createStructuredSelector({
  currentDieRoll: currentDieRollSelector,
  isDieRollAllowed: isDieRollAllowedSelector,
});

const mapDispatchToProps = {
  rollDie,
};

class DiceBare extends React.PureComponent {
  state = {
    isRolling: false,
    rollingValue: null,
  };

  handleDieClick = () => {
    if (!this.props.isDieRollAllowed || this.state.isRolling) return;
    this.setState({ isRolling: true });
    this.rollingInterval = setInterval(() => {
      // Show random value between 1 and 6
      const randomValue = Math.floor(Math.random() * 6) + 1;
      this.setState({ rollingValue: randomValue });
    }, 100);
    setTimeout(() => {
      clearInterval(this.rollingInterval);
      this.setState({ isRolling: false, rollingValue: null });
      this.props.rollDie();
    }, 2000);
  };

  render() {
    const { baseColor } = this.props;
    const dieClassNames =
      this.props.isDieRollAllowed && !this.state.isRolling
        ? styles.Die
        : [styles.Die, styles.Disabled];
    const displayValue = this.state.isRolling
      ? this.state.rollingValue || 1
      : this.props.currentDieRoll;
    return (
      <div className={styles.Container}>
        <div
          className={classnames(dieClassNames)}
          style={getStyleObject(DICE_SIZE, DICE_SIZE, baseColor)}
          onClick={this.handleDieClick}
        >
          {this.renderDots(displayValue)}
        </div>
      </div>
    );
  }

  renderDots = (value) => {
    const elements = [];
    const configurationForCurrentRoll = CONFIGURATIONS[value];

    for (let i = 0; i < configurationForCurrentRoll.length; i++) {
      const isVisible = Boolean(configurationForCurrentRoll[i]);
      const classNames = isVisible
        ? styles.Dot
        : [styles.Dot, styles.Invisible];
      elements.push(<div className={classnames(classNames)} key={i} />);
    }

    return elements;
  };

  componentWillUnmount() {
    if (this.rollingInterval) {
      clearInterval(this.rollingInterval);
    }
  }
}

export const Dice = connect(mapStateToProps, mapDispatchToProps)(DiceBare);
