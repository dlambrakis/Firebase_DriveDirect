import { Platform } from 'react-native';

let OfferModal;

if (Platform.OS === 'web') {
  OfferModal = require('../OfferModal.web').OfferModal;
} else {
  OfferModal = require('../OfferModal.native').OfferModal;
}

export { OfferModal };
