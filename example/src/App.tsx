import memoize from 'lodash/memoize';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import ImageModal from '../../src/ImageModal';
import ImageList from './components/ImageList';

import { dumpImages } from './data/images';

import type { ImageSource } from '../../src/@types';
const SCREEN = Dimensions.get('screen');
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;

export default function App() {
  const [currentImageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState(dumpImages);
  const [imagesSingle, setImagesSingle] = useState(null);
  const [listState, setListState] = useState(null);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const [isVisible, setIsVisible] = useState(false);
  const img = {
    uri: 'https://images.aposto.com/600xauto/2023/4/2/1683028799060.jpeg',
  };

  const onSelect = (images, index) => {
    setListState(true);
    setImageIndex(index);
    setImages(images);
    setIsVisible(true);
  };

  const onSelectSingle = (imagesUri, index) => {
    setListState(false);
    setImageIndex(index);
    setImagesSingle(imagesUri);
    setIsVisible(true);
  };

  const onRequestClose = () => setIsVisible(false);
  const getImageSource = memoize((images): ImageSource[] =>
    images.map((image) =>
      typeof image.original === 'number'
        ? image.original
        : { uri: image.original as string }
    )
  );
  const getSingleImageSource = memoize((imageData): ImageSource[] => {
    return imageData.original === 'number'
      ? imageData.original
      : { uri: imageData.original as string };
  });

  const onLongPress = (image) => {
    Alert.alert('Long Pressed', image.uri);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ImageList
        images={dumpImages.map((image) => image.thumbnail)}
        onPress={(index) => onSelect(dumpImages, index)}
        shift={0.75}
      />
      <View style={styles.listItem}>
        <TouchableWithoutFeedback
          onPress={(index) => onSelectSingle(img, index)}
        >
          <Image
            source={img}
            style={{ width: windowWidth, height: windowHeight / 3 }}
          />
        </TouchableWithoutFeedback>
      </View>

      <ImageModal
        isList={listState}
        imageUri={imagesSingle}
        images={getImageSource(images)}
        imageIndex={currentImageIndex}
        presentationStyle="overFullScreen"
        visible={isVisible}
        onRequestClose={onRequestClose}
        onLongPress={onLongPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    ...Platform.select({
      android: { paddingTop: StatusBar.currentHeight },
      default: null,
    }),
    justifyContent: 'center',
    alignItems: 'center',
  },
  about: {
    flex: 1,
    marginTop: -12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '200',
    color: '#FFFFFFEE',
  },
  listItem: {
    backgroundColor: 'pink',
  },
});
