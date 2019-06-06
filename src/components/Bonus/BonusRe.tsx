import React, { Component } from "react";
import { StyleSheet, View, Dimensions, Image, Text } from "react-native";

import Animated, { Easing } from "react-native-reanimated";

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
const {
  set,
  cond,
  eq,
  add,
  call,
  multiply,
  lessThan,
  startClock,
  stopClock,
  clockRunning,
  block,
  timing,
  debug,
  spring,
  Value,
  Clock,
  event
} = Animated;

function runSpring(clock, value, dest) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };

  const config = {
    toValue: new Value(0),
    damping: 7,
    mass: 1,
    stiffness: 121.6,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.velocity, -2500),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    spring(clock, state, config),
    cond(state.finished, debug("stop clock", stopClock(clock))),
    state.position
  ]);
}

function runTiming(clock, value, dest, duration) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: duration || 4000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, debug("stop clock", stopClock(clock))),
    state.position
  ]);
}

export default class BonusRe extends Component {
  constructor(props) {
    super(props);

    // const transX = new Value(0);
    const clock1 = new Clock();
    const clock2 = new Clock();
    const clock3 = new Clock();
    const clock4 = new Clock();
    const clock5 = new Clock();
    const clock6 = new Clock();
    // const twenty = new Value(20);
    // const thirty = new Value(30);
    // this._transX = cond(new Value(0), twenty, multiply(3, thirty));
    this._transX = runTiming(clock1, 0, -120, 3000);
    this._scale = runTiming(clock2, 0, 2, 3000);
    this._rotate = runTiming(clock3, 0, 3.14, 3000);
    this._rayOpacity = runTiming(clock4, 0, 1, 3000);
    this._walletOpacity = runTiming(clock5, 0, 1, 3000);
    this._walletScale = runTiming(clock5, 4, 0.5, 3000);
  }
  componentDidMount() {
    // Animated.spring(this._transX, {
    //   duration: 300,
    //   velocity: -300,
    //   toValue: 150,
    // }).start();
  }
  render() {
    const walletXPos = WIDTH / 2 - 50;
    const walletYPos = (HEIGHT - 100) / 2 - 50;
    return (
      <View style={styles.container}>
        <Animated.Image
          source={require("./rays.png")}
          style={[
            {
              position: "absolute",
              width: 220,
              height: 220,
              top: walletYPos - 65,
              right: walletXPos - 65,
              opacity: this._rayOpacity,
              justifyContent: "center",
              alignItems: "center"
            },
            { transform: [{ rotate: this._rotate }, { scale: this._scale }] }
          ]}
        />
        <Animated.View
          style={[
            {
              position: "absolute",
              width: 100,
              height: 100,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              opacity: this._walletOpacity,
              transform: [{ scale: this._walletScale }],
            },
            {
              transform: [
                { translateX: this._transX, translateY: this._transX }
              ]
            }
          ]}
        >
          <Image source={require("./wallet.png")} style={styles.box} />
          <View
            style={{
              position: "absolute",
              top: 50,
              width: 70,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 15
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              <Text style={{ fontWeight: "normal" }}>₹</Text>
              {`100`}
            </Text>
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 13
              }}
            >
              {`BONUS`}
            </Text>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const BOX_SIZE = 100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    alignSelf: "center",
    margin: BOX_SIZE / 2
  }
});
