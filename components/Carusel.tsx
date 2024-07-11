/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  FlatList,
  Dimensions,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  Platform,
} from 'react-native';

interface Props {
  uris: string[];
  preFetchUris: string[];
  id: number;
}

export default function Carousel(props: Props) {
  const [index, setIndex] = useState(0);
  const imagesCount = useRef(0);
  const flatListRef = useRef<FlatList>();
  const firstRender = useRef(true);
  const lastId = useRef<number | null>(null);
  const uris = props.uris.concat(
    //Image.prefetch is not working on IOS,
    //so we render the future images at the end of the FlatList,
    //with an empty image as seperator.
    Platform.OS === 'android' ? [] : '',
    Platform.OS === 'android' ? [] : props.preFetchUris,
  );

  if (Platform.OS === 'android') {
    //Preload next item images (Android)
    if (firstRender.current) {
      firstRender.current = false;
      Promise.all(
        props.uris?.map(
          async uri => await Image.prefetch(uri).catch(e => console.log(e)),
        ),
      );
    }
    Promise.all(
      props.preFetchUris?.map(
        async uri => await Image.prefetch(uri).catch(e => console.log(e)),
      ),
    );
  }

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      event.persist();
      const slideSize = event.nativeEvent.layoutMeasurement.width;
      let roundIndex = Math.round(
        event.nativeEvent.contentOffset.x / slideSize,
      );

      if (roundIndex >= imagesCount.current) {
        //On IOS, prevent scrolling to future images.
        roundIndex = imagesCount.current > 0 ? imagesCount.current - 1 : 0;
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: roundIndex,
            animated: false,
          });
        }, 10);
      }

      setIndex(roundIndex);
    },
    [],
  );

  const width = Dimensions.get('window').width;

  //detect new item and reset index
  if (props.id !== lastId.current) {
    lastId.current = props.id;
    imagesCount.current = props.uris.length;
    setIndex(0);
    flatListRef.current?.scrollToIndex({index: 0, animated: false});
  }

  return (
    <View>
      <FlatList
        data={uris}
        renderItem={item => (
          <Image
            style={{
              marginTop: 10,
              marginHorizontal: 10,
              width: width - 20,
              height: width - 20,
            }}
            src={item.item}
            key={item.item}
          />
        )}
        ref={flatListRef as any}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
      />
      {imagesCount.current > 1 ? (
        <View style={styles.indexerRow}>
          {[...Array(imagesCount.current).keys()].map((n, i) => {
            return (
              <View
                key={i}
                style={[
                  styles.imageIndexer,
                  i === index ? styles.active : null,
                ]}
              />
            );
          })}
        </View>
      ) : (
        <View style={styles.indexerPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  indexerRow: {
    marginVertical: 5,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageIndexer: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#d4e1f7',
    margin: 5,
    opacity: 0.5,
  },
  active: {opacity: 1},
  indexerPlaceholder: {
    height: 20,
  },
});
