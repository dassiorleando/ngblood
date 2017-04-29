const express = require('express');
const router = express.Router();
var status = require('http-status');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ngblood');
var Point = require('../models/point');


/* GET a point by his ID. */
router.get('/point/:pointId', (req, res) => {
  var pointId = req.params.pointId;

  // Check first if it is a valid Id
  if (!mongoose.Types.ObjectId.isValid(pointId)) {
    return res.status(400).send({
      message: 'Point Id is invalid'
    });
  }

  Point.findById(pointId, function(err, pointFounded) {
    if (err) return res.status(err.status).json(err);

    // We serve as json the point founded
    res.status(status.OK).json(pointFounded);
  });
});
/* POST: save a new point with donor details. */
router.post('/point/update', (req, res) => {
  var data = req.body;
  var id = data._id;

  // Properties to update on an exiting point
  var pointDataTopUpdate = {
    blood_type: data.blood_type,
    contact: {
      firstName: data.contact.firstName,
      lastName: data.contact.lastName,
      phoneNumber: data.contact.phoneNumber,
      email: data.contact.email,
      address: data.contact.address
    }
  };

  // find the user with id :id
  // all others properties but not position and Ip
  Point.findByIdAndUpdate(id, pointDataTopUpdate, function(err, point) {
    if (err) return res.status(err.status).json(err);

    // The point has been updated
    res.status(status.OK).json(point);
  });
});

/* POST all saved points. */
router.post('/byMapPoint', (req, res) => {
  var body = req.body;

  Point.find({'latitude': body.latitude, 'longitude': body.longitude}, function(err, points) {
    if (err) return res.status(err.status).json(err);

    // object of all the points
    res.status(status.OK).json(points);
  });
});

/* POST: save a new point with donor details. */
router.post('/', (req, res) => {
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
      email: data.contact.email,
      address: data.contact.address,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    }
  });

  // save the point
  newPoint.save(function(err, point) {
    if (err) return res.status(err.status).json(err);

    // res.setHeader('Content-Type', 'application/json');
    res.status(status.OK).json(point);
  });

});

/* GET all saved points. */
router.get('/', (req, res) => {
  Point.find({}, function(err, points) {
    if (err) return res.status(err.status).json(err);

    // object of all the points
    res.status(status.OK).json(points);
  });
});

module.exports = router;