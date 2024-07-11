import React, {PureComponent} from 'react';
import {SafeAreaView, Platform} from 'react-native';
import {SafeAreaView as AndroidSafeAreaView} from 'react-native-safe-area-context';

interface IRecipeProps {
  children: JSX.Element;
}

class DuoSafeAreaView extends PureComponent<IRecipeProps> {
  render() {
    return false && Platform.OS === 'android' ? (
      <AndroidSafeAreaView>{this.props.children}</AndroidSafeAreaView>
    ) : (
      <SafeAreaView>{this.props.children}</SafeAreaView>
    );
  }
}

export default DuoSafeAreaView;
