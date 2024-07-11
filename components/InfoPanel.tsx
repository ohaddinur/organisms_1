/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

export default function InfoPanel({version}: {version: string}) {
  return (
    <View style={styles.infoPanel}>
      <View>
        <Text style={styles.infoText}>Organisms</Text>
        <Text style={styles.infoText}>Version {version}</Text>
        <Text style={styles.infoText}>Photos by Wikipedia</Text>
      </View>
      <Image
        style={{margin: 3}}
        source={require('../assets/plant_80X80.png')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  infoPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginLeft: 20,
    marginRight: 5,
  },
  infoText: {
    fontFamily: 'Helvetica-Light',
    fontSize: 16,
    color: 'gray',
    lineHeight: 24,
  },
});
