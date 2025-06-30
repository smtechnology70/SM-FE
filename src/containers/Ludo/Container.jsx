import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Home } from "../Home/Container";
import { Player } from "../Player/Container";
import { Walkway } from "../Walkway/Container";
import { getStyleObject } from "../utils";
import { getInitialGameData, setPlayers } from "./state/actions";
import { BaseID, BoardEntities } from "./state/interfaces";
import {
  basesSelector,
  currentTurnSelector,
  relationshipsSelector,
  walkwaysSelector,
} from "./state/selectors";

import styles from "./Container.module.css";
import { Base } from "../Base/Container";
import { BOARD_SIZE } from "../../globalConstants";
import { ContextMenu } from "../../services/contextMenu/Container";
// import { ContextMenu } from "../../services/contextMenu/components/ContextMenu";

const mapStateToProps = createStructuredSelector({
  bases: basesSelector,
  currentTurn: currentTurnSelector,
  relationships: relationshipsSelector,
  walkways: walkwaysSelector,
});

const mapDispatchToProps = {
  setPlayers,
  getInitialGameData,
};

class LudoBare extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { showPlayerConfiguration: true };
  }

  componentDidMount() {
    this.props.getInitialGameData();
  }

  render() {
    const { currentTurn } = this.props;
    return (
      <div className={styles.Container}>
        <div className={styles.GameContainer}>
          <div className={styles.PlayerContainer}>
            <Player
              baseID={BaseID.BASE_1}
              placement="top"
              disabled={currentTurn !== BaseID.BASE_1}
            />
            <Player
              baseID={BaseID.BASE_3}
              placement="bottom"
              disabled={currentTurn !== BaseID.BASE_3}
            />
          </div>
          <div
            className={styles.Board}
            style={getStyleObject(BOARD_SIZE, BOARD_SIZE)}
          >
            {this.renderBoardEntities()}
          </div>
          <div className={styles.PlayerContainer}>
            <Player
              baseID={BaseID.BASE_2}
              placement="top"
              disabled={currentTurn !== BaseID.BASE_2}
            />
            <Player
              baseID={BaseID.BASE_4}
              placement="bottom"
              disabled={currentTurn !== BaseID.BASE_4}
            />
          </div>
        </div>
        {this.state.showPlayerConfiguration ? (
          <div className={styles.GameConfiguration}>
            <button className={styles.Button} onClick={() => this.startGame(2)}>
              2 Players
            </button>
            <button className={styles.Button} onClick={() => this.startGame(3)}>
              3 Players
            </button>
            <button className={styles.Button} onClick={() => this.startGame(4)}>
              4 Players
            </button>
          </div>
        ) : null}
        {process.env.NODE_ENV === "development" ? <ContextMenu /> : null}
      </div>
    );
  }

  renderBoardEntities = () => {
    const { bases, relationships, walkways } = this.props;

    return relationships.map((relationship, index) => {
      const base = bases[relationship.ID];
      const walkway = walkways[relationship.ID];
      switch (relationship.type) {
        case BoardEntities.BASE:
          return (
            <Base
              baseID={base.ID}
              key={index}
              enabled={base.enabled}
              hasWon={base.hasWon}
            />
          );
        case BoardEntities.HOME:
          return <Home baseIDs={relationship.baseIDs} key={index} />;
        case BoardEntities.WALKWAY:
          return <Walkway walkway={walkway} key={index} />;
        default:
          return null;
      }
    });
  };

  startGame = (playerCount) => {
    this.props.setPlayers(playerCount);
    this.setState({
      showPlayerConfiguration: false,
    });
  };
}

export const Ludo = connect(mapStateToProps, mapDispatchToProps)(LudoBare);
