import { Platform } from 'react-native';

let VehicleCard;

if (Platform.OS === 'web') {
  VehicleCard = require('../VehicleCard.web').VehicleCard;
} else {
  VehicleCard = require('../VehicleCard.native').VehicleCard;
}

export { VehicleCard };
