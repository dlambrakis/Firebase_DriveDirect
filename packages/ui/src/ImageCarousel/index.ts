import { Platform } from 'react-native';

let ImageCarousel;

if (Platform.OS === 'web') {
  ImageCarousel = require('../ImageCarousel.web').ImageCarousel;
} else {
  ImageCarousel = require('../ImageCarousel.native').ImageCarousel;
}

export { ImageCarousel };
