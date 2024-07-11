/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState, useRef} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Pressable,
  Text,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Carousel from './Carusel';
import SlideUpPanel from './SlideUpPanel';
import InfoPanel from './InfoPanel';
import TranslationsList, {Translation} from './TranslationsList';
import StarsRow from './StartsRow';
import LanguagesPicker from './LanguagesPicker';
import Icon from '@react-native-vector-icons/ionicons';

interface ResponseData {
  status: string;
  error?: string;
  organism: Organism[];
  levels_count: number[];
}

interface Organism {
  id: number;
  pageid: number;
  translations: Translation[];
  photos?: string[];
  level: number;
}

function Organisms({version}: {version: string}) {
  const [data, setData] = useState<Organism[]>([]);
  const [currentOrganism, setCurrentOrganism] = useState<Organism | null>(null);
  const [levelsCounts, setLevelsCounts] = useState<number[] | null>(null);
  const [activeLanguages, setActiveLanguages] = useState<string[]>([
    'he',
    'en',
    'de',
  ]);
  const [starsRowVisible, showStarsRow] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const apiUrl = useRef(
    'https://webdev-solutions.com/organism/organismsControler.php',
  );
  const scrollViewRef = useRef<ScrollView>();

  const settingsPanelRef = useRef<SlideUpPanel>();
  const infoPanelRef = useRef<SlideUpPanel>();
  const errorPanelRef = useRef<SlideUpPanel>();

  const getNext = () => {
    if (!activeLanguages.length) {
      setError('No languages selected');
      return;
    }

    const dataClone = [...data];
    const current = dataClone.shift();
    setData(dataClone);

    if (current) {
      setCurrentOrganism(current);
      scrollViewRef.current?.scrollTo({y: 0});
    }
  };

  const getDataSet = () => {
    const url = apiUrl.current;
    fetch(apiUrl.current + '?action=get-rows', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then((responsData: ResponseData) => {
        if (responsData.status === 'OK') {
          setData(data.concat(filterLanguages(responsData.organism)));
          setLevelsCounts(responsData.levels_count);
        } else {
          throw new Error(responsData.error ?? 'Error');
        }
      })
      .catch(async () => {
        if (url.includes('https://')) {
          apiUrl.current = url.replace('https://', 'http://');
          getDataSet();
        } else {
          const response = await NetInfo.fetch();
          if (!response.isConnected) {
            apiUrl.current = url.replace('http://', 'https://');
            setError('No internet connection');
            setTimeout(async () => {
              //Try again after 5sec.
              getDataSet();
            }, 5000);
          } else {
            setError('No data available');
          }
        }
      });
  };

  const filterLanguages = (oData: Organism[]): Organism[] => {
    return oData.filter(organism =>
      activeLanguages.some(lang =>
        organism.translations.map(trans => trans.lang).includes(lang),
      ),
    );
  };

  const setOrganismLevel = (level: number) => {
    const url = apiUrl.current;
    const postData = {
      action: 'set-level',
      data: {level: level, id: currentOrganism!.id},
    };
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(postData), // The actual body
    }).catch(async () => {
      const response = await NetInfo.fetch();
      if (!response.isConnected) {
        setError('No internet connection');
      } else {
        setError('Unable to connect');
      }
    });
    getDataSet();
  };

  const setLanguageActive = async (lang: string) => {
    const activeLanguagesClone: string[] = [...activeLanguages];
    if (activeLanguages.includes(lang)) {
      activeLanguagesClone.splice(activeLanguages.indexOf(lang), 1);
    } else {
      activeLanguagesClone.push(lang);
    }
    setActiveLanguages(activeLanguagesClone);
    await AsyncStorage.setItem(
      'languages',
      JSON.stringify(activeLanguagesClone),
    );
    setData(filterLanguages(data));
  };

  useEffect(() => {
    if (data.length < 11) {
      getDataSet();
    } else {
      if (data.length && !currentOrganism) {
        getNext();
      }
    }
  }, [data]);

  useEffect(() => {
    getDataSet();
    getLanguages();
  }, []);

  const setError = (message: string) => {
    setErrorMessage(message);
    errorPanelRef.current?.open();
  };

  const getLanguages = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('languages');
      if (jsonValue != null) {
        setActiveLanguages(JSON.parse(jsonValue));
      }
    } catch (e) {
      // error reading value
    }
  };

  const photos: string[] = currentOrganism?.photos ?? [];
  return (
    <View>
      {currentOrganism ? (
        <SafeAreaView>
          <View>
            <View>
              <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                ref={scrollViewRef as any}>
                <View style={styles.main}>
                  <View>
                    {photos.length ? (
                      <Carousel
                        uris={photos}
                        preFetchUris={data[0]?.photos ?? []}
                        id={currentOrganism.id}
                      />
                    ) : null}
                    <TranslationsList
                      translations={currentOrganism.translations.filter(trans =>
                        activeLanguages.includes(trans.lang),
                      )}
                    />
                    <View style={styles.horizontalLine} />
                    <Pressable onPress={getNext}>
                      <View style={styles.nextButton}>
                        <Text style={styles.nextButtonText}>NEXT</Text>
                      </View>
                    </Pressable>
                    {levelsCounts != null && starsRowVisible ? (
                      <StarsRow
                        level={currentOrganism.level}
                        levelsCounts={levelsCounts}
                        levelSelected={async i => setOrganismLevel(i)}
                      />
                    ) : null}
                  </View>
                  <View>
                    <Pressable
                      onLongPress={() => showStarsRow(true)}
                      delayLongPress={3000}>
                      <View style={styles.footer}>
                        <Text style={styles.itemIdText}>
                          {currentOrganism.id}
                        </Text>
                        <Pressable
                          onPress={() => settingsPanelRef.current?.open()}>
                          <Icon
                            name="settings-outline"
                            size={25}
                            color="black"
                          />
                        </Pressable>
                        <Pressable onPress={() => infoPanelRef.current?.open()}>
                          <Icon
                            name="information-circle-outline"
                            size={28}
                            color="black"
                            style={{marginTop: 2}}
                          />
                        </Pressable>
                      </View>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      ) : (
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color="#d4e1f7" />
        </View>
      )}
      <SlideUpPanel ref={settingsPanelRef as any}>
        <LanguagesPicker
          languages={activeLanguages}
          setLanguageActive={async lang => setLanguageActive(lang)}
        />
      </SlideUpPanel>
      <SlideUpPanel ref={infoPanelRef as any}>
        <InfoPanel version={version} />
      </SlideUpPanel>
      <SlideUpPanel ref={errorPanelRef as any}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      </SlideUpPanel>
    </View>
  );
}

export default Organisms;

const styles = StyleSheet.create({
  main: {
    justifyContent: 'space-between',
    minHeight: Dimensions.get('window').height - 20,
    backgroundColor: 'white',
  },
  loadingView: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalLine: {
    marginHorizontal: 10,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
  nextButton: {
    alignSelf: 'center',
    marginVertical: 25,
    borderColor: '#265180',
    backgroundColor: '#265180',
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Light',
    letterSpacing: 1,
  },
  itemIdText: {
    color: 'black',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ededed',
  },
  errorText: {
    fontFamily: 'Helvetica-Light',
    fontSize: 16,
    color: 'red',
    lineHeight: 24,
  },
});
