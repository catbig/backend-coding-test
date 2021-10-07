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

  describe('GET /rides', function () {
    it('should return rows', function (done) {
      request(app)
        .get('/rides')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /rides/1', function () {
    it('should return one row', function (done) {
      request(app)
        .get('/rides/1')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});
