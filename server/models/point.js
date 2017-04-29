// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var pointSchema = new Schema({
  latitude: {
      type: String,
      required: true
  },
  longitude: {
      type: String,
      required: true
  },
  longitude: {
      type: String,
      required: true
  },
  contact: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    ip: {
      type: String
    }
  },
  blood_type: String,
  created_at: Date,
  updated_at: Date
});

// on every save, add the date
pointSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

// the schema is useless so far
// we need to create a model using it
var Point = mongoose.model('Point', pointSchema);

// make this available in our Node applications
module.exports = Point;