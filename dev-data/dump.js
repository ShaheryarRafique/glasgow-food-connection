// const bcrypt = require('bcrypt');
// // models/user.model.js
// const Datastore = require('nedb');

// // Define the path to the NeDB database file
// const usersDb = new Datastore({ filename: './db/users.db', autoload: true });

// // Admin user details
// const adminUser = {
//     "name": "Admin",
//     "email": "admin@gmail.com",
//     "password": "", // Will be set after hashing
//     "accountType": "Admin"
// };

// // Hash the password
// bcrypt.hash('admin123', 10, function(err, hash) {
//     if (err) {
//         // Handle error
//         console.error('Error hashing password:', err);
//         return;
//     }

//     // Set the hashed password in the admin user object
//     adminUser.password = hash;

//     // Insert the admin record into the NeDB database
//     usersDb.insert(adminUser, function (err, newDoc) {
//         if (err) {
//             // Handle error
//             console.error('Error inserting document:', err);
//             return;
//         }

//         // Success
//         console.log('Admin record added:', newDoc);
//     });
// });