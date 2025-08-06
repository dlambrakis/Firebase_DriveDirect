/**
 * Represents a province.
 */
export interface Province {
  id: string;
  name: string;
}

/**
 * Represents a city, which belongs to a province.
 */
export interface City {
  id: string;
  province_id: string;
  name: string;
}

/**
 * Represents a suburb, which belongs to a city.
 */
export interface Suburb {
  id: string;
  city_id: string;
  name: string;
}
