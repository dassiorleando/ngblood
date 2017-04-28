const express = require('express');
const router = express.Router();
var status = require('http-status');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ngblood');

var Point = require('../models/point');





/* GET all saved points. */
router.get('/', (req, res) => {
  console.log("Get all shared blood");

  Point.find({}, function(err, points) {
    if (err) return res.status(err.status).json(err);

    // object of all the points
    res.status(status.OK).json(points);
  });
});



/* POST all saved points. */
router.post('/byMapPoint', (req, res) => {
  console.log("Get a shared point");
  var body = req.body;
  console.log('Map data for request');
  console.log(body);

  Point.find({'latitude': body.latitude, 'longitude': body.longitude}, function(err, points) {
    if (err) return res.status(err.status).json(err);

    // object of all the points
    res.status(status.OK).json(points);
  });
});



/* POST: save a new point with donor details. */
router.post('/', (req, res) => {
  console.log("Share blood request");
  console.log(req.body);      // your JSON

  var data = req.body;
  // create a new point
  var newPoint = Point({
    latitude: data.latitude,
    longitude: data.longitude,
    blood_type: data.blood_type,
    contact: {
      firstName: data.contact.firstName,
      lastName: data.contact.lastName,
      phoneNumber: data.contact.phoneNumber,
      email: data.contact.email
    }
  });

  // save the point
  newPoint.save(function(err, point) {
    if (err) return res.status(err.status).json(err);
    console.log('Point created!');

    // res.setHeader('Content-Type', 'application/json');
    res.status(status.OK).json(point);
  });

});


module.exports = router;