'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const logger = require('./logger');

module.exports = (db) => {
  /**
   * Publish API doc
   */
  app.get('/developer', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  /**
   * @api {get} /health /health
   * @apiDescription Test health of server
   * @apiGroup Maintenance
   * @apiName getHealth
   *
   * @apiSuccess {String} none The server will response `Healthy` string and response code `200`
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     Healthy
   */
  app.get('/health', (req, res) => res.send('Healthy'));

  /**
   * @api {post} /rides /ride - postRide
   * @apiDescription Submit new rides consist of origin, destination, rider and driver detail
   * @apiGroup Rides
   * @apiName postRide
   *
   * @apiBody {Number} start_lat Origin latitude.
   * @apiBody {Number} start_long Origin longitude.
   * @apiBody {Number} end_lat Destination latitude.
   * @apiBody {Number} end_long Destination longitude.
   * @apiBody {String} rider_name Rider's name.
   * @apiBody {String} driver_name Driver's name.
   * @apiBody {String} driver_vehicle Driver's vehicle.
   *
   * @apiSuccess {Number} start_lat Origin latitude.
   * @apiSuccess {Number} start_long Origin longitude.
   * @apiSuccess {Number} end_lat Destination latitude.
   * @apiSuccess {Number} end_long Destination longitude.
   * @apiSuccess {String} rider_name Rider's name.
   * @apiSuccess {String} driver_name Driver's name.
   * @apiSuccess {String} driver_vehicle Driver's vehicle.
   */
  app.post('/rides', jsonParser, (req, res) => {
    const startLatitude = Number(req.body.start_lat);
    const startLongitude = Number(req.body.start_long);
    const endLatitude = Number(req.body.end_lat);
    const endLongitude = Number(req.body.end_long);
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;
    const logPrefix = '[app.postRide] ';

    if (
      startLatitude < -90 ||
      startLatitude > 90 ||
      startLongitude < -180 ||
      startLongitude > 180
    ) {
      //logger.warn(logPrefix + 'start latitude invalid: ' + startLatitude);
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message:
          'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
      });
    }

    if (
      endLatitude < -90 ||
      endLatitude > 90 ||
      endLongitude < -180 ||
      endLongitude > 180
    ) {
      //logger.warn(logPrefix + 'end latitude invalid: ' + endLatitude);
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message:
          'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
      });
    }

    if (typeof riderName !== 'string' || riderName.length < 1) {
      //logger.warn(logPrefix + 'riderName invalid: ' + riderName);
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string'
      });
    }

    if (typeof driverName !== 'string' || driverName.length < 1) {
      //logger.warn(logPrefix + 'driverName invalid: ' + driverName);
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Driver name must be a non empty string'
      });
    }

    if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
      //logger.warn(logPrefix + 'driverVehicle invalid: ' + driverVehicle);
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Vehicle must be a non empty string'
      });
    }

    var values = [
      req.body.start_lat,
      req.body.start_long,
      req.body.end_lat,
      req.body.end_long,
      req.body.rider_name,
      req.body.driver_name,
      req.body.driver_vehicle
    ];

    const result = db.run(
      'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
      values,
      function (err) {
        if (err) {
          //logger.error(logPrefix + 'insert failed: ' + err);
          return res.send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error'
          });
        }

        db.all(
          'SELECT * FROM Rides WHERE rideID = ?',
          this.lastID,
          function (err, rows) {
            if (err) {
              //logger.error(
              //  logPrefix + 'failure on select record: ' + err
              //);
              return res.send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error'
              });
            }

            res.send(rows);
          }
        );
      }
    );
  });

  /**
   * @api {get} /rides/:page/:pageSize /rides - getRides
   * @apiDescription Get all ride records
   * @apiGroup Rides
   * @apiName getRides
   *
   * @apiParam {Number} page Page numer.
   * @apiParam {Number} pageSize Page size.
   *
   * @apiSuccess {Number} start_lat Origin latitude.
   * @apiSuccess {Number} start_long Origin longitude.
   * @apiSuccess {Number} end_lat Destination latitude.
   * @apiSuccess {Number} end_long Destination longitude.
   * @apiSuccess {String} rider_name Rider's name.
   * @apiSuccess {String} driver_name Driver's name.
   * @apiSuccess {String} driver_vehicle Driver's vehicle.
   */
  app.get('/rides/:page/:pageSize', (req, res) => {
    const logPrefix = '[app.getRides] ';
    let page = req.params.page;
    let pageSize = req.params.pageSize;
    let offset = (page - 1) * pageSize;
    let sql = 'SELECT * FROM Rides LIMIT ? OFFSET ?';
    let values = [pageSize, offset];
    //logger.debug(logPrefix + 'page:' + page + ', pageSize: ' + pageSize);
    //logger.debug(logPrefix + 'sql:' + sql);
    db.all(sql, values, function (err, rows) {
      if (err) {
        //logger.error(logPrefix + 'select record failed: ' + err);
        return res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error'
        });
      }

      if (rows.length === 0) {
        //logger.warn(logPrefix + 'ride not found');
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides'
        });
      }

      res.send(rows);
    });
  });

  /**
   * @api {get} /ride/:id /ride - getRideById
   * @apiDescription Get ride detail by rideID
   * @apiGroup Rides
   * @apiName getRideById
   *
   * @apiParam {Number} id rideID.
   *
   * @apiSuccess {Number} start_lat Origin latitude.
   * @apiSuccess {Number} start_long Origin longitude.
   * @apiSuccess {Number} end_lat Destination latitude.
   * @apiSuccess {Number} end_long Destination longitude.
   * @apiSuccess {String} rider_name Rider's name.
   * @apiSuccess {String} driver_name Driver's name.
   * @apiSuccess {String} driver_vehicle Driver's vehicle.
   */
  app.get('/ride/:id', (req, res) => {
    const logPrefix = '[app.getRideById] ';
    var id = req.params.id;
    db.all(
      `SELECT * FROM Rides WHERE rideID='${req.params.id}'`,
      function (err, rows) {
        if (err) {
          //logger.error(logPrefix + 'failure on select record by id: ' + err);
          return res.send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error'
          });
        }

        if (rows.length === 0) {
          //logger.warn(logPrefix + 'record not found for id: ' + id);
          return res.send({
            error_code: 'RIDES_NOT_FOUND_ERROR',
            message: 'Could not find any rides'
          });
        }

        res.send(rows);
      }
    );
  });

  return app;
};
