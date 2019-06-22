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

function runTiming(clock:any, value:any, dest:any, duration:number, callback?:any) {
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

interface Props {

};
interface State {
  bonusReleased?: number
}

export default class BonusRe extends Component<Props, State > {
  /**
   * Queue that maintains message buffer
   *
   * @private
   * @type {*}
   * @memberof BonusRelease
   */
  eventQueue: [] = [];

  rayanimation:any;
  walletAnimation:any;
  walletanimation: any;

  constructor(props:Props) {
    super(props);
    this.state = {};
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
    if (wsMsg && wsMsg.type === "bonus") {
      if (this.eventQueue.length === 0) {
        this.animate(wsMsg);
      }

      this.eventQueue.push(wsMsg);
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

    if (this.eventQueue.length > 0) {
      this.animate(this.eventQueue[0]);
    }
  };

  animate(data:any) {
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
    this.updateBonusText(data.bonusReleased);
  }

  render() {
    const scale = interpolate(this.rayanimation, {
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0, 1, 1, 0]
    });

    const rotate = interpolate(this.rayanimation, {
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [4.7, 3.14, 3.14, 4.7]
    });

    const rayOpacity = interpolate(this.rayanimation, {
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0, 1, 1, 0]
    });

    const walletScale = interpolate(this.walletAnimation, {
      inputRange: [0.2, 0.25, 0.3, 0.8, 1],
      outputRange: [5, 0.5, 1, 1, 0.3]
    });

    const walletOpacity = interpolate(this.walletAnimation, {
      inputRange: [0.2, 0.25, 0.3, 1],
      outputRange: [0, 0.7, 1, 1]
    });

    const transX = interpolate(this.walletAnimation, {
      inputRange: [0, 0.8, 1],
      outputRange: [0, 0, WIDTH / 2]
    });

    const transY = interpolate(this.walletAnimation, {
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
              opacity: rayOpacity,
              transform: [{ rotate: rotate }, { scale: scale }]
            }
          ]}
        />
        <Animated.View
          style={[
            styles.walletCont,
            {
              opacity: walletOpacity,
              transform: [
                {
                  translateX: transX,
                  translateY: transY,
                  scale: walletScale
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

