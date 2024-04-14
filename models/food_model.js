const Datastore = require('nedb');
const foodsDb = new Datastore({ filename: './db/foods.db', autoload: true });

const Food = {
    create: function (foodData, callback) {
        // Insert new food data into the database
        foodsDb.insert(foodData, callback);
    },

    getAll: function (query, callback) {
        // Use the query if provided, or default to fetching all documents
        foodsDb.find(query || {}, callback);
    },

    findById: function (id, callback) {
        // Find a food item by its _id
        foodsDb.findOne({ _id: id }, callback);
    },

    updateById: function (id, foodData, callback) {
        // Update a food item by its _id
        foodsDb.update({ _id: id }, { $set: foodData }, {}, callback);
    },

    deleteById: function (id, callback) {
        // Delete a food item by its _id
        foodsDb.remove({ _id: id }, {}, callback);
    }
};

module.exports = Food;
