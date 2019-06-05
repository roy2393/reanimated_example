import React, { Component } from 'react';
import { View, Text, Dimensions, Animated, Easing, Image } from 'react-native';

import { Events } from '../../handlers/eventemitter';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

interface Props {
  onComplete: () => void;
  onStart: () => void;
}

interface State {
  bonusReleased: number;
}

class BonusRelease extends React.PureComponent<Props, State> {
  /**
   *
   *
   * @private
   * @type {*}
   * @memberof BonusRelease
   */
  private logger: any;

  /**
   * Background Rays rotate value
   *
   * @private
   * @type {*}
   * @memberof BonusRelease
   */
  private bgRaySpin: any;

  /**
   * Bg Ray scale value
   *
   * @private
   * @type {*}
   * @memberof BonusRelease
   */
  private bgRayScale: any;

  /**
   * Bg Ray Opacity Value
   *
   * @private
   * @type {*}
   * @memberof BonusRelease
   */
  private rayOpacity: any;

  /**
   * Wallet image scale value
   *
   * @private
   * @type {*}
   * @memberof BonusRelease
   */
  private walletScale: any;

  /**
   * Wallet opacity value
   *
   * @private
   * @type {*}
   * @memberof BonusRelease
   */
  private walletOpacity: any;

  /**
   * Wallet Top position value
   *
   * @private
   * @type {*}
   * @memberof BonusRelease
   */
  private moveTop: any;

  /**
   * Wallet right position value
   *
   * @private
   * @type {*}
   * @memberof BonusRelease
   */
  private moveRight: any;

  /**
   * Queue that maintains message buffer
   *
   * @private
   * @type {*}
   * @memberof BonusRelease
   */
  private eventQueue: [] = [];

  constructor(props: Props) {
    super(props);

    this.state = {
      bonusReleased: 0,
    };

    this.bgRaySpin = new Animated.Value(0);
    this.bgRayScale = new Animated.Value(0);
    this.rayOpacity = new Animated.Value(0);
    this.walletScale = new Animated.Value(0);
    this.walletOpacity = new Animated.Value(0);
    this.moveTop = new Animated.Value(0);
    this.moveRight = new Animated.Value(0);
    this.animate = this.animate.bind(this);
    this.onAnimationComplete = this.onAnimationComplete.bind(this);
  }

  componentDidMount() {
    Events.addListener(
      'bonus',
      this.handleBonusRelease.bind(this)
    );
  }

  /**
   *
   *
   * @param {*} wsMsg
   * @memberof BonusRelease
   */
  handleBonusRelease(wsMsg: any) {
    console.log('handleBonusRelease::', wsMsg);
    if (wsMsg && wsMsg.type === 'bonus') {
        if (this.eventQueue.length === 0) {
          console.log('queue empty, event started');
          this.animate(wsMsg);
        }

        this.eventQueue.push(wsMsg);
        console.log('wsMsg pushed', wsMsg);
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
      bonusReleased: bonusReleased,
    });
    this.forceUpdate();
  }

  /**
   * Starts Bonus Animation
   *
   * @memberof BonusRelease
   */
  animate(data: any) {
    console.log('animation started', data);
    this.updateBonusText(data.bonusReleased);
    this.bgRaySpin.setValue(0);
    this.bgRayScale.setValue(0);
    this.walletScale.setValue(0);
    this.walletOpacity.setValue(0);
    this.moveTop.setValue(0);
    this.moveRight.setValue(0);
    this.rayOpacity.setValue(0);

    /**
     * Animation Builder function
     * @param value
     * @param duration
     * @param easing
     * @param delay
     * @returns {Object} Animated object wich configurations as passed in params
     */
    const createTimingAnimation = function(
      value: any,
      duration: number,
      easing: any,
      delay = 0
    ) {
      return Animated.timing(value, {
        toValue: 1,
        duration,
        easing,
        delay,
      });
    };

    this.props.onStart();

    /**
     * Animations are started in parallel with respective durations and
     * delays.
     * this.bgRaySpin - starts rays bg spin animation
     * this.bgRayScale - starts rays bg scale animation
     * this.rayOpacity - starts rays bg opacigy animation
     *
     * this.walletOpacity - starts wallet opacity animation with a delay of 2 sec
     * this.walletScale - starts wallet scale animation with a delay of 2 sec
     * this.moveTop - wallet top movement starts with a delay of 2 sec
     * this.moveRight - wallet right movement starts with a delay of 2 sec
     *
     */
    Animated.parallel([
      // createTimingAnimation(this.bgRaySpin, 4550, Easing.linear),
      // createTimingAnimation(this.bgRayScale, 4550, Easing.linear),
      // createTimingAnimation(this.rayOpacity, 4550, Easing.linear),
      createTimingAnimation(this.walletOpacity, 4000, Easing.linear, 2000),
      createTimingAnimation(this.walletScale, 4000, Easing.linear, 2000),
      createTimingAnimation(this.moveTop, 4000, Easing.linear, 2000),
      createTimingAnimation(this.moveRight, 4000, Easing.linear, 2000),
    ]).start(this.onAnimationComplete);
  }

  /**
   * Callback triggered once Bonus animation completes
   *
   * @memberof BonusRelease
   */
  onAnimationComplete() {
    this.eventQueue.shift();
    console.log('animation complete', this.eventQueue);

    if (this.eventQueue.length > 0) {
      console.log('next event started', this.eventQueue);
      this.animate(this.eventQueue[0]);
    }
    this.props.onComplete();
  }

  /**
   *
   *
   * @returns
   * @memberof BonusRelease
   */
  render() {
    console.log('Render Bonus', this.state.bonusReleased);
    const RAY_INPUT_RANGE = [0, 0.1, 0.9, 1];
    const walletXPos = WIDTH / 2 - 50;
    const walletYPos = (HEIGHT - 100) / 2 - 50;

    /**
     * bg Ray spin timings:
     *  anticlockwise spin from 0 - 0.1 i.e 1 sec
     *  wait from 0.1 - 0.9 i.e 3 sec
     *  clockwise spin from 0.9 - 1, i.e 1sec
     */
    const spin = this.bgRaySpin.interpolate({
      inputRange: RAY_INPUT_RANGE,
      outputRange: ['270deg', '360deg', '360deg', '270deg'],
    });

    /**
     * bg Ray scale timings:
     *  scale up from 0 - 0.1 i.e approx 0.5 sec
     *  wait from 0.1 - 0.9 i.e 3 sec
     *  scale down from 0.9 - 1, i.e approx 0.5 sec
     */
    const rayScale = this.bgRayScale.interpolate({
      inputRange: RAY_INPUT_RANGE,
      outputRange: [0, 1, 1, 0],
    });

    /**
     * bg Ray opacity timings:
     *  fade in from 0 - 0.1 i.e approx 0.5 sec
     *  wait from 0.1 - 0.9 i.e 3 sec
     *  fade out down from 0.9 - 1, i.e approx 0.5 sec
     */
    const rayOpacity = this.rayOpacity.interpolate({
      inputRange: RAY_INPUT_RANGE,
      outputRange: [0, 1, 1, 0],
    });

    /**
     * wallet top movement timings:
     *  wait at original poition from 0 - 0.80 i.e 3 sec
     *  move to -30 from 0.80 - 1, i.e approx 0.5 sec
     */
    const moveTop = this.moveTop.interpolate({
      inputRange: [0, 0.8, 0.95, 1],
      outputRange: [walletYPos, walletYPos, -35, -35],
    });

    /**
     * wallet right movement timings:
     *  wait at original poition from 0 - 0.80 i.e 3 sec
     *  move to 10 from 0.80 - 1, i.e approx 0.5 sec
     */
    const moveRight = this.moveRight.interpolate({
      inputRange: [0, 0.8, 0.95, 1],
      outputRange: [walletXPos, walletXPos, -10, -10],
    });

    /**
     * wallet opacity timings:
     *  fade in from 0 - 0.05, i.e 200 milliseconds
     *  wait from 0.05 - 0.80, i.e approx 3 seconds
     *  fade out while moving up from 0.80 - 1, i.e 1 second
     */
    const walletOpacity = this.walletOpacity.interpolate({
      inputRange: [0, 0.05, 0.1, 0.95, 1],
      outputRange: [0, 0.5, 1, 1, 0],
    });

    /**
     * wallet scale timings:
     *  scale down from 0 - 0.05 i.e 200 milliseconds
     *  scale up from 0.05 - 0.1, i.e 200 milliseconds
     *  wait from 0.05 - 0.80, i.e approx 3 seconds
     *  scale down while moving up from 0.80 - 1, i.e 1 second
     */
    const walletScale = this.walletScale.interpolate({
      inputRange: [0, 0.05, 0.1, 0.8, 0.95, 1],
      outputRange: [5, 0.5, 1, 1, 0.2, 0.2],
    });

    return (
      <React.Fragment>
        <Animated.Image
          style={{
            position: 'absolute',
            width: 220,
            height: 220,
            top: walletYPos - 65,
            right: walletXPos - 65,
            opacity: rayOpacity,
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ rotate: spin }, { scale: rayScale }],
          }}
          source={require('./rays.png')}
        />
        <Animated.View
          style={{
            position: 'absolute',
            top: moveTop,
            right: moveRight,
            width: 100,
            height: 100,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: walletOpacity,
            transform: [{ scale: walletScale }],
            elevation: 9,
          }}>
          <Image
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            source={require('./wallet.png')}
          />
          <View
            style={{
              position: 'absolute',
              top: 50,
              width: 70,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 15,
              }}
              numberOfLines={1}
              ellipsizeMode="tail">
              <Text style={{ fontWeight: 'normal' }}>₹</Text>
              {`${this.state.bonusReleased}`}
            </Text>
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 13,
              }}>
              {`BONUS`}
            </Text>
          </View>
        </Animated.View>
      </React.Fragment>
    );
  }
}

/**
 *
 */
export default BonusRelease;
