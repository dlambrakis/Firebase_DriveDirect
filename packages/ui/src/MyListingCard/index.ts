import { Platform } from 'react-native';

let MyListingCard;

if (Platform.OS === 'web') {
  MyListingCard = require('../MyListingCard.web').MyListingCard;
} else {
  MyListingCard = require('../MyListingCard.native').MyListingCard;
}

export { MyListingCard };
