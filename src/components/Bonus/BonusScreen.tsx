import React, { Component } from 'react';
import { StyleSheet, View, Text, Switch } from "react-native";
import { Events } from '../../handlers/eventemitter';

import Bonus from './Bonus';
import BonusRe from "./BonusRe";


interface Props { }
interface State {
  reanimated: boolean;
}

export default class App extends Component<Props, State> {
  constructor(props:Props){
    super(props);
    this.state = {
      reanimated: false
    };
  }

  componentDidMount() {
    Events.emit("bonus", {
      type: "bonus",
      userId: 1028386,
      bonusReleased: 100
    });
    this.startBonusAnimation();
  }

  startBonusAnimation() {
    setInterval(() => {
      Events.emit('bonus', { "type": "bonus", "userId": 1028386, "bonusReleased": 100 })
    }, 8000)
  }

  renderAnimatedBonus() {
    if(this.state.reanimated) {
      return <BonusRe />
    }
    return (
      <Bonus
        onStart={() => console.log("STARTED")}
        onComplete={() => console.log("COMPLETED")}
      />
    );
  }


  render() {
    const { reanimated } = this.state;
    return (
      <View style={styles.container}>
        <View style={[styles.switchCont, {flex: 4}]}>
        {this.renderAnimatedBonus()}
        </View>

        <View style={styles.switchCont}>
          <Text>Reanimated Api</Text>
          <Switch
            onValueChange={() => this.setState({ reanimated: !reanimated })}
            value={this.state.reanimated}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  switchCont: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  }
});