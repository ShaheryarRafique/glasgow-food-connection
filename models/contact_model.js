const Datastore = require('nedb');
const contactsDb = new Datastore({ filename: './db/contacts.db', autoload: true });

const Contact = {
    create: function (contactData, callback) {
      // Insert new contact data into the database
      contactsDb.insert(contactData, callback);
    },
  
    getAll: function (callback) {
      // Find all contacts in the database
      contactsDb.find({}, callback);
    }
  };
  
  module.exports = Contact;