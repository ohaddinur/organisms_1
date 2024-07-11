/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, Pressable, StyleSheet} from 'react-native';

interface Props {
  languages: string[];
  setLanguageActive: (lang: string) => {};
}

export interface Language {
  name: string;
  shortName: string;
  active: Boolean;
}

const shortToLong: Record<string, string> = {
  he: 'עברית',
  en: 'English',
  de: 'Deutsch',
};

export default function LanguagesPicker(props: Props) {
  return (
    <View style={{marginLeft: 20}}>
      <Text style={[styles.text, {color: 'black', marginBottom: 10}]}>
        Languages:
      </Text>
      <View style={styles.flexRow}>
        <View>
          {Object.keys(shortToLong).map(lang => (
            <Pressable onPress={() => props.setLanguageActive(lang)} key={lang}>
              <View style={styles.flexRow}>
                <View style={styles.checkbox}>
                  <View
                    style={
                      props.languages.includes(lang) ? styles.checked : null
                    }
                  />
                </View>
                <Text style={[styles.text, {color: '#265180'}]}>
                  {shortToLong[lang] ?? 'Unknown'}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 5,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1,
    padding: 3,
    marginRight: 8,
  },
  checked: {
    width: '100%',
    height: '100%',
    backgroundColor: '#265180',
    borderRadius: 20,
  },
  text: {
    fontFamily: 'Helvetica-Light',
    fontSize: 16,
    alignSelf: 'flex-start',
  },
});
