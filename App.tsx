/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import {Events} from './src/handlers/eventemitter';

import Bonus from './src/components/Bonus/Bonus';
import BonusRe from "./src/components/Bonus/BonusRe";


interface Props {}
export default class App extends Component<Props> {
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
      Events.emit('bonus', { "type": "bonus", "userId":1028386, "bonusReleased": 100})
    }, 8000)
  }

  renderAnimatedBonus() {
    return (
        <Bonus
          onStart={() => console.log("STARTED")}
          onComplete={() => console.log("COMPLETED")}
        />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <BonusRe/>
        {/* {this.renderAnimatedBonus()} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});