'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = (db) => {
	
	/**
	 * Publish API doc
	 */
    app.get('/developer', (req, res) => {
		res.sendFile(__dirname+'/index.html');
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
     * @api {post} /rides /ride - post
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

        if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (typeof riderName !== 'string' || riderName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverName !== 'string' || driverName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Driver name must be a non empty string'
            });
        }

        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Vehicle must be a non empty string'
            });
        }

        var values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];
        
        const result = db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
                if (err) {
                    return res.send({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error'
                    });
                }

                res.send(rows);
            });
        });
    });

    /**
     * @api {get} /rides /rides - get
	 * @apiDescription Get all ride records
     * @apiGroup Rides
     * @apiName getRides
     *
     * @apiSuccess {Number} start_lat Origin latitude.
     * @apiSuccess {Number} start_long Origin longitude.
     * @apiSuccess {Number} end_lat Destination latitude.
     * @apiSuccess {Number} end_long Destination longitude.
     * @apiSuccess {String} rider_name Rider's name.
     * @apiSuccess {String} driver_name Driver's name.
     * @apiSuccess {String} driver_vehicle Driver's vehicle.
     */
    app.get('/rides', (req, res) => {
        db.all('SELECT * FROM Rides', function (err, rows) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }

            res.send(rows);
        });
    });

    /**
     * @api {get} /rides/:id /rides/:id - get
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
    app.get('/rides/:id', (req, res) => {
        db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, function (err, rows) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }

            res.send(rows);
        });
    });

    return app;
};
