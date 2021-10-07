'use strict';

const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

describe('API tests', function () {
  before(function (done) {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      // prettier-ignore
      let values = [
        1, 0, 0, 0, 'rider1',  'driver1',  'vehicle1', 
		2, 0, 0, 0, 'rider2',  'driver2',  'vehicle2', 
		3, 0, 0, 0, 'rider3',  'driver3',  'vehicle3', 
		4, 0, 0, 0, 'rider4',  'driver4',  'vehicle4', 
		5, 0, 0, 0, 'rider5',  'driver5',  'vehicle3', 
		6, 0, 0, 0, 'rider6',  'driver6',  'vehicle6', 
		7, 0, 0, 0, 'rider7',  'driver7',  'vehicle3', 
		8, 0, 0, 0, 'rider8',  'driver8',  'vehicle8', 
		9, 0, 0, 0, 'rider9',  'driver9',  'vehicle3', 
	   10, 0, 0, 0, 'rider10', 'driver10', 'vehicle10'
      ];

      let sql =
        'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)';
      for (var i = 0; i < 9; i++) {
        sql += ', (?, ?, ?, ?, ?, ?, ?)';
      }
      db.run(sql, values);

      done();
    });
  });

  describe('GET /developer', function () {
    it('should return developer portal', function (done) {
      request(app)
        .get('/developer')
        .expect('Content-Type', /html/)
        .expect(200, done);
    });
  });

  describe('GET /health', function () {
    it('should return health', function (done) {
      request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200, done);
    });
  });

  describe('POST /rides - success', function () {
    it('should return rows', function (done) {
      request(app)
        .post('/rides')
        .send({
          start_lat: '0',
          start_long: '0',
          end_lat: '1',
          end_long: '1',
          rider_name: 'rider',
          driver_name: 'driver',
          driver_vehicle: 'ABC123'
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('POST /rides - start_lat invalid', function () {
    it('should return rows', function (done) {
      request(app)
        .post('/rides')
        .send({
          start_lat: '181',
          start_long: '0',
          end_lat: '1',
          end_long: '1',
          rider_name: 'rider',
          driver_name: 'driver',
          driver_vehicle: 'ABC123'
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('POST /rides - end_lat invalid', function () {
    it('should return rows', function (done) {
      request(app)
        .post('/rides')
        .send({
          start_lat: '0',
          start_long: '0',
          end_lat: '181',
          end_long: '1',
          rider_name: 'rider',
          driver_name: 'driver',
          driver_vehicle: 'ABC123'
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('POST /rides - rider_name invalid', function () {
    it('should return rows', function (done) {
      request(app)
        .post('/rides')
        .send({
          start_lat: '0',
          start_long: '0',
          end_lat: '1',
          end_long: '1',
          rider_name: '',
          driver_name: 'driver',
          driver_vehicle: 'ABC123'
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('POST /rides - driver_name invalid', function () {
    it('should return rows', function (done) {
      request(app)
        .post('/rides')
        .send({
          start_lat: '0',
          start_long: '0',
          end_lat: '1',
          end_long: '1',
          rider_name: 'rider',
          driver_name: '',
          driver_vehicle: 'ABC123'
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('POST /rides - driver_vehicle invalid', function () {
    it('should return rows', function (done) {
      request(app)
        .post('/rides')
        .send({
          start_lat: '0',
          start_long: '0',
          end_lat: '1',
          end_long: '1',
          rider_name: 'rider',
          driver_name: 'driver',
          driver_vehicle: ''
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /rides/1/2', function () {
    it('should return rows', function (done) {
      request(app)
        .get('/rides/1/2')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /ride/1', function () {
    it('should return one row', function (done) {
      request(app)
        .get('/ride/1')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});
