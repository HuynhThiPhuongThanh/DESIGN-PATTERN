const mongoose = require('mongoose');

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose.connect(process.env.MONGO_URI)
      .then(() => {
        console.log('DATABASE CONNECTED SUCCESS');
      })
      .catch(err => {
        console.error('DATABASE CONNECTION ERROR:', err.message);
      });
  }
}

module.exports = new Database();