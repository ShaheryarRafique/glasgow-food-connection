// models/user.model.js
const Datastore = require('nedb');

// Define the path to the NeDB database file
const usersDb = new Datastore({ filename: './db/users.db', autoload: true });


// Assuming `usersDb` is your NeDB database instance for users
usersDb.ensureIndex({ fieldName: 'email', unique: true }, function (err) {
  if (err) console.log(err); // Handle potential errors
});


const User = {
  create: function (userData, callback) {
    // Insert new user data into the database
    usersDb.insert(userData, callback);
  },

  getAll: function (callback) {
    // Find all users in the database where accountType is not "admin"
    usersDb.find({ accountType: { $ne: "Admin" } }, callback);
  },

  findById: function (id, callback) {
    // Find a user by their _id
    usersDb.findOne({ _id: id }, callback);
  },

  findByEmail: function (email, callback) {
    // Find a user by their email
    usersDb.findOne({ email: email }, callback);
  },

  // Add a new method to check if an email already exists in the database
  isEmailUnique: function (email) {
    return new Promise((resolve, reject) => {
      usersDb.findOne({ email }, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(!user); // Resolve with true if email is unique (user not found), false otherwise
        }
      });
    });
  },

  update: function (id, newData, callback) {
    // Update user data by _id
    usersDb.update({ _id: id }, { $set: newData }, {}, callback);
  },

  delete: function (id, callback) {
    // Remove a user by _id
    usersDb.remove({ _id: id }, {}, callback);
  }
};

module.exports = User;
