import React, { Component } from "react";
import { StyleSheet, View, Dimensions, Image, Text } from "react-native";

import { Events } from "../../handlers/eventemitter";

import Animated, { Easing } from "react-native-reanimated";
import styles from './Bonus.style';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
const {
  set,
  cond,
  eq,
  and,
  interpolate,
  startClock,
  clockRunning,
  block,
  timing,
  Value,
  Clock,
  call,
  debug,
  stopClock
} = Animated;

function runTiming(clock, value, dest, duration, callback) {
  const onComplete = callback || function() {};
  const state = {
    finished: new Value(0),
    position: new Value(value),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: duration || 4000,
    toValue: new Value(dest || 0),
    easing: Easing.inOut(Easing.ease)
  };

  const reset = [
    set(state.finished, 0),
    set(state.time, 0),
    set(state.frameTime, 0)
  ];

  return block([
    cond(and(state.finished, eq(state.position, value)), [
      ...reset,
      set(config.toValue, dest)
    ]),
    cond(clockRunning(clock), 0, startClock(clock)),
    timing(clock, state, config),
    cond(state.finished, [
      debug("stop clock", stopClock(clock)),
      call([state.finished], onComplete)
    ]),
    state.position
  ]);
}

export default class BonusRe extends Component {
  /**
   * Queue that maintains message buffer
   *
   * @private
   * @type {*}
   * @memberof BonusRelease
   */
  private eventQueue: [] = [];

  constructor(props) {
    super(props);

    this.state = {
      bonusReleased: null
    };
  }

  componentDidMount() {
    Events.addListener("bonus", this.handleBonusRelease.bind(this));
  }

  /**
   *
   *
   * @param {*} wsMsg
   * @memberof BonusRelease
   */
  handleBonusRelease(wsMsg: any) {
    console.log("handleBonusRelease::", wsMsg);
    if (wsMsg && wsMsg.type === "bonus") {
      if (this.eventQueue.length === 0) {
        console.log("queue empty, event started");
        this.animate(wsMsg);
      }

      this.eventQueue.push(wsMsg);
      console.log("wsMsg pushed", wsMsg);
    }
  }

  /**
   * Update State and render animated component
   *
   * @param {number} bonusReleased
   * @memberof BonusRelease
   */
  updateBonusText(bonusReleased: number) {
    this.setState({
      bonusReleased: bonusReleased
    });
  }
  /**
   * Callback triggered once Bonus animation completes
   *
   * @memberof BonusRelease
   */
  onAnimationComplete = () => {
    this.eventQueue.shift();
    console.log("animation complete", this.eventQueue);

    if (this.eventQueue.length > 0) {
      console.log("next event started", this.eventQueue);
      this.animate(this.eventQueue[0]);
    }
  };

  animate(data) {
    // const transX = new Value(0);
    const clock1 = new Clock();
    const clock2 = new Clock();

    this.rayanimation = runTiming(clock2, 0, 1, 5000);
    this.walletAnimation = runTiming(
      clock1,
      0,
      1,
      5000,
      this.onAnimationComplete
    );
    console.log("ANIMATE::", this.rayanimation, this.walletanimation);
    this.updateBonusText(data.bonusReleased);
  }

  render() {
    console.log("RE RENDER");
    this._scale = interpolate(this.rayanimation, {
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0, 1, 1, 0]
    });

    this._rotate = interpolate(this.rayanimation, {
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [4.7, 3.14, 3.14, 4.7]
    });

    this._rayOpacity = interpolate(this.rayanimation, {
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0, 1, 1, 0]
    });

    this._walletScale = interpolate(this.walletAnimation, {
      inputRange: [0.2, 0.25, 0.3, 0.8, 1],
      outputRange: [5, 0.5, 1, 1, 0.3]
    });

    this._walletOpacity = interpolate(this.walletAnimation, {
      inputRange: [0.2, 0.25, 0.3, 1],
      outputRange: [0, 0.7, 1, 1]
    });

    this._transX = interpolate(this.walletAnimation, {
      inputRange: [0, 0.8, 1],
      outputRange: [0, 0, WIDTH / 2]
    });

    this._transY = interpolate(this.walletAnimation, {
      inputRange: [0, 0.8, 1],
      outputRange: [0, 0, -HEIGHT / 2]
    });
    return this.state.bonusReleased ? (
      <React.Fragment>
        <Animated.Image
          source={require("./rays.png")}
          style={[
            styles.rayImg,
            {
              opacity: this._rayOpacity,
              transform: [{ rotate: this._rotate }, { scale: this._scale }]
            }
          ]}
        />
        <Animated.View
          style={[
            styles.walletCont,
            {
              opacity: this._walletOpacity,
              transform: [
                {
                  translateX: this._transX,
                  translateY: this._transY,
                  scale: this._walletScale
                }
              ]
            }
          ]}
        >
          <Image source={require("./wallet.png")} style={styles.box} />
          <View style={styles.bonusAmountCont}>
            <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
              {`₹ ${this.state.bonusReleased}`}
            </Text>
            <Text style={styles.text}>{`BONUS`}</Text>
          </View>
        </Animated.View>
      </React.Fragment>
    ) : null;
  }
}

