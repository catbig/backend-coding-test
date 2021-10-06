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
        .expect('Content-Type', /text/)
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
});
