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
import BonusRe from './src/components/Bonus/BonusRe';


interface Props {}
export default class App extends Component<Props> {
  startBonusAnimation() {
    Events.emit('bonus', { "type": "bonus", "userId":1028386, "bonusReleased": 100})
  }

  render() {
    return (
      <View style={styles.container}>
        <BonusRe />
        <Bonus onStart={() => console.log('STARTED')} onComplete={()=> console.log('COMPLETED')}/>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.tsx</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.button}
          onPress={this.startBonusAnimation.bind(this)}>
          <Text>Bonus</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'red'
  }
});