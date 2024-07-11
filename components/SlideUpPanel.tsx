/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, {PureComponent} from 'react';
import {
  Animated,
  Easing,
  View,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import Icon from '@react-native-vector-icons/ionicons';

interface IRecipeProps {
  children: JSX.Element;
}

class SlideUpPanel extends PureComponent<IRecipeProps> {
  state = {
    visible: false,
    height: new Animated.Value(0),
    maxViewHeight: Dimensions.get('window').height / 2,
    viewHeight: Dimensions.get('window').height / 2,
  };
  ref = {panelRef: React.createRef<View>()};

  open = () => {
    this.setState({visible: true});
    const {height} = this.state;
    Animated.timing(height, {
      toValue: 1,
      duration: 400,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    const {maxViewHeight: screenHeight, viewHeight} = this.state;
    if (screenHeight === viewHeight) {
      setTimeout(
        () =>
          this.ref.panelRef.current?.measure(
            (x, y, width, newHeight, _pageX) => {
              this.setState({viewHeight: newHeight});
            },
          ),
        450,
      );
    }
  };

  close = () => {
    const {height} = this.state;

    Animated.timing(height, {
      toValue: 0,
      duration: 400,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    setTimeout(() => this.setState({visible: false}), 500);
  };

  render() {
    const {height, viewHeight} = this.state;
    const maxHeight = height.interpolate({
      inputRange: [0, 1],
      outputRange: [0, viewHeight],
    });

    return this.state.visible ? (
      <View style={styles.fill}>
        <Pressable
          style={styles.topTransperant}
          onPress={() => this.close()}></Pressable>
        <View>
          <GestureRecognizer onSwipeDown={() => this.close()}>
            <Animated.View
              style={[styles.bottomPanel, {maxHeight: maxHeight}]}
              ref={this.ref.panelRef}>
              <View style={{height: 5}} />
              <Pressable onPress={() => this.close()}>
                <Icon
                  name="chevron-down"
                  size={26}
                  color="#ccc"
                  style={{alignSelf: 'center'}}
                />
              </Pressable>
              {this.props.children}
              <View style={{height: 20}} />
            </Animated.View>
          </GestureRecognizer>
        </View>
      </View>
    ) : null;
  }
}

export default SlideUpPanel;

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  topTransperant: {flexGrow: 1, backgroundColor: 'transperant'},
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 2,
  },
});
