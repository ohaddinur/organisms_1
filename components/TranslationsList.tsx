/* eslint-disable react/react-in-jsx-scope */
import {useState} from 'react';
import {
  Text,
  View,
  TouchableNativeFeedback,
  StyleSheet,
  Platform,
} from 'react-native';

interface Props {
  translations: Translation[];
}

export interface Translation {
  lang: string;
  translation: string;
}

export default function TranslationsList(props: Props) {
  return (
    <View>
      {props.translations.map(trans => (
        <Translation
          lang={trans.lang}
          text={trans.translation}
          key={trans.lang + '_' + trans.translation}
        />
      ))}
    </View>
  );
}

interface TransProps {
  lang: string;
  text?: string;
}
function Translation(props: TransProps) {
  const [covered, cover] = useState(true);
  return props.text ? (
    <View style={styles.langPanel}>
      {covered ? (
        <TouchableNativeFeedback onPress={() => cover(false)}>
          <View style={styles.cover}>
            <Text
              style={[
                styles.coverText,
                props.lang === 'he' ? styles.coverTextHe : null,
              ]}>
              {props.lang === 'he' ? 'עב' : props.lang.toUpperCase()}
            </Text>
          </View>
        </TouchableNativeFeedback>
      ) : null}

      <View>
        <Text style={styles.panelContentText}>{props.text}</Text>
      </View>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  langPanel: {
    minHeight: 95,
    marginHorizontal: 5,
    paddingHorizontal: 5,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cover: {
    position: 'absolute',
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
    backgroundColor: '#d4e1f7',
    borderWidth: 0,
    borderRadius: 5,
    zIndex: 100,
  },
  coverText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 65,
    fontFamily: 'Helvetica-Light',
    color: 'white',
    fontWeight: 300,
    margin: 0,
    marginTop: Platform.OS === 'android' ? -8 : 5,
  },
  coverTextHe: {
    fontSize: Platform.OS === 'android' ? 75 : 80,
    marginTop: Platform.OS === 'android' ? -20 : 8,
    fontWeight: Platform.OS === 'android' ? 100 : 100,
  },
  panelContentText: {
    textAlign: 'center',
    color: '#265180',
    fontSize: 30,
    fontFamily: 'Helvetica',
  },
});
