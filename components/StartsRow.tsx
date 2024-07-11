import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';

interface Props {
  level: number;
  levelsCounts: number[];
  levelSelected: (level: number) => {};
}
export default function StarsRow(props: Props) {
  return (
    <View style={styles.starsRow}>
      {[...Array(6).keys()].map(i => (
        <Pressable onPress={() => props.levelSelected(i)} key={i}>
          <View>
            <StarCol
              zero={i === 0}
              active={i === props.level}
              count={props.levelsCounts[i]}
            />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

interface StarColProps {
  zero: boolean;
  active: boolean;
  count: number;
}
function StarCol(props: StarColProps) {
  return (
    <View style={styles.starCol}>
      <Icon
        name="star"
        size={24}
        style={[
          styles.star,
          props.active ? styles.starActive : null,
          props.zero ? styles.starZero : null,
        ]}
      />
      <Text style={styles.countText}>{props.count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  starsRow: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  starCol: {
    marginHorizontal: 10,
  },
  star: {
    marginVertical: 2,
    color: '#d4e1f7',
    opacity: 0.5,
  },
  starActive: {opacity: 1},
  indexerPlaceholder: {
    height: 20,
  },
  starZero: {
    color: '#f1d4d4',
  },
  countText: {
    fontSize: 9,
    color: '#ccc',
    textAlign: 'center',
  },

  roundCorners: {
    borderRadius: 20,
  },
});
