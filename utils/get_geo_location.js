const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'openstreetmap'
};

const geocoder = NodeGeocoder(options);

// Helper function to parse latitude and longitude from the pickupPoint string
const parseLatLong = (pickupPointString) => {
  const latLongMatch = pickupPointString.match(/Lat: ([\d.-]+) Long: ([\d.-]+)/);
  if (latLongMatch) {
    return { lat: parseFloat(latLongMatch[1]), lon: parseFloat(latLongMatch[2]) };
  }
  return null;
};

// Function to add or update a food item with city name based on its latitude and longitude
const addOrUpdateFoodItemWithCity = async (foodItem) => {
  try {
    console.log(" foodItem :::: ", foodItem);
    
    // Adjusted to handle the pickupPoint format "Lat: <latitude> Long: <longitude>"
    const latLon = parseLatLong(foodItem.pickupPoint);
    if (!latLon) {
      console.error('Invalid pickupPoint format');
      foodItem.locationName = 'Invalid location format';
      return foodItem;
    }

    const res = await geocoder.reverse(latLon);
    
    // Assuming the first result is the desired one and attempting to extract city name
    if (res.length > 0) {
      const city = res[0].city || (res[0].administrativeLevels ? res[0].administrativeLevels.level2long : null);
      foodItem.locationName = city ? city : 'Unknown city';
    } else {
      foodItem.locationName = 'Unknown location';
    }

    // Here you would typically save the foodItem, including its locationName, to your database
    return foodItem;

  } catch (error) {
    console.error('Geocoding error:', error);
    throw error; // Or handle it as per your application's error handling policy
  }
};

module.exports = addOrUpdateFoodItemWithCity;
