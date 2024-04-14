const Food = require('../models/food_model');
const addOrUpdateFoodItemWithCity = require('../utils/get_geo_location');

const createFood = (req, res) => {
    const { name, quantity, expiry, foodCategory, pickupPoint, description } = req.body;
    console.log("Req.body", req.body);

    // Basic validations
    if (!name || !quantity || !expiry || !foodCategory || !pickupPoint || !description) {
        return res.status(400).json({ error: true, message: 'All fields are required.' });
    }

    // Callback function to handle the database operation result
    const callback = (error, newFood) => {
        if (error) {
            console.error('Server error during food item creation:', error);
            return res.status(500).json({ error: true, message: 'Server error during food item creation. Please try again later.' });
        }
        console.log('New food item created successfully:', newFood);
        return res.status(200).json({ success: true, message: 'New food item created successfully.', food: newFood });
    };

    // Call the model's create method and pass the callback
    Food.create({ name, quantity, expiry, foodCategory, pickupPoint, description }, callback);
};

const getAllFoods = async (req, res) => {
    const { quantity, foodCategory, expiry } = req.query;

    // Constructing the query based on filters
    let query = {};
    if (quantity) {
        // Ensure quantity is treated as a number for comparison
        query.quantity = { $lte: parseInt(quantity, 10) };
    }
    if (foodCategory && foodCategory !== 'All Categories') {
        // Split the foodCategory string into an array
        const categoriesArray = foodCategory.split(',');
        // Use the $in operator to find documents where the foodCategory is in categoriesArray
        query.foodCategory = { $in: categoriesArray };
    }
    
    if (expiry) {
        // Assuming expiry is stored in YYYY-MM-DD format and you want items expiring after the specified date
        query.expiry = { $gte: expiry };
    }

    Food.getAll(query, async (error, foods) => {
        if (error) {
            console.error('Error while fetching food items:', error);
            return res.status(500).json({ error: true, message: 'Server error while fetching food items.' });
        }

        try {
            // Proceed with any additional processing, if necessary
            // Consider caching or optimizing addOrUpdateFoodItemWithCity if it's impacting performance
            const foodsWithProcessedData = await Promise.all(foods.map(foodItem => addOrUpdateFoodItemWithCity(foodItem)));

            return res.status(200).json({ success: true, foods: foodsWithProcessedData });
        } catch (error) {
            console.error('Error processing data:', error);
            return res.status(500).json({ error: true, message: 'Error processing food item data.' });
        }
    });
};



// Get a single food item by ID
const getFoodById = (req, res) => {
    const { id } = req.params;

    const callback = (error, food) => {
        if (error) {
            console.error(`Error while fetching food item with ID ${id}:`, error);
            return res.status(500).json({ error: true, message: `Server error while fetching food item with ID ${id}.` });
        }
        if (!food) {
            return res.status(404).json({ error: true, message: 'Food item not found.' });
        }
        console.log(`Food item fetched successfully:`, food);
        return res.status(200).json({ success: true, food });
    };

    Food.findById(id, callback);
};

// Update a food item by ID
const updateFoodById = (req, res) => {
    const { id } = req.params;

    const callback = (error, numReplaced) => {
        if (error) {
            console.error(`Error while updating food item with ID ${id}:`, error);
            return res.status(500).json({ error: true, message: `Server error during the update of food item with ID ${id}. Please try again later.` });
        }
        if (numReplaced === 0) {
            return res.status(404).json({ error: true, message: 'Food item not found or no change detected.' });
        }
        console.log(`Food item with ID ${id} updated successfully.`);
        return res.status(200).json({ success: true, message: 'Food item updated successfully.' });
    };

    Food.updateById(id, req.body, callback);
};

// Delete a food item by ID
const deleteFoodById = (req, res) => {
    const { id } = req.params;

    const callback = (error, numRemoved) => {
        if (error) {
            console.error(`Error while deleting food item with ID ${id}:`, error);
            return res.status(500).json({ error: true, message: `Server error during the deletion of food item with ID ${id}. Please try again later.` });
        }
        if (numRemoved === 0) {
            return res.status(404).json({ error: true, message: 'Food item not found.' });
        }
        console.log(`Food item with ID ${id} deleted successfully.`);
        return res.status(200).json({ success: true, message: 'Food item deleted successfully.' });
    };

    Food.deleteById(id, callback);
};


module.exports = {
    createFood,
    getAllFoods,
    getFoodById,
    updateFoodById,
    deleteFoodById
};
