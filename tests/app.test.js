process.env.NODE_ENV = 'test';
var app = require('../app');
var request = require('supertest');
var assert = require('assert');

describe('GET /', function(){
  it('respond with json', function(done){
    request(app)
      .get('/')
      .expect(405, done);
  })
})

describe('GET /devices/deviceid/150234', function(){
  it('respond with json', function(done){
    request(app)
      .get('/devices/deviceid/150234')
      .expect(200, done);
  })
})

describe('GET /devices/deviceid/150234/tickets', function(){
  it('respond with json', function(done){
    request(app)
      .get('/devices/deviceid/150234/tickets')
      .expect(200, done);
  })
})

describe('GET /devices/hostname/unittest01.example.org', function(){
  it('should return code 200', function(done) {
    request(app)
      .get('/devices/hostname/unittest01.example.org')
      .expect(200)
      .end(function(err, res){
        if(err) {
          done(err);
        } else {
          done();
        }
      });
  });
  it('should respond with json', function(done){
    request(app)
      .get('/devices/hostname/test.example.org')
      .expect('Content-Type', /json/)
      .end(function(err, res){
        if(err) {
          done(err);
        } else {
          done();
        }
      });
  });
  it('should return the same sent params concatenated', function(done) {
    request(app)
      .get('/devices/hostname/unittest01.example.org')
      .expect(200, 'Hello World')
      .end(function(err, res){
        if(err) {
          done(err);
        } else {
          done();
        }
      });
  });
})

describe('GET /devices/rack/1', function(){
  it('respond with json', function(done){
    request(app)
      .get('/devices/rack/1')
      .expect(200, done);
  })
})

describe('GET /devices/clientid/1', function(){
  it('respond with json', function(done){
    request(app)
      .get('/devices/clientid/1')
      .expect(200, done);
  })
})

describe('GET /devices/typegroup/1', function(){
  it('respond with json', function(done){
    request(app)
      .get('/devices/typegroup/1')
      .expect(200, done);
  })
})

describe('GET /devices/meta/typelist', function(){
  it('respond with json', function(done){
    request(app)
      .get('/devices/meta/typelist')
      .expect(200, done);
  })
})

describe('GET /devices/meta/hostnames', function(){
  it('respond with json', function(done){
    request(app)
      .get('/devices/meta/hostnames')
      .expect(200, done);
  })
})

/*
app.get('/tickets/deviceid/:deviceid', function (req, res, next) {
app.get('/tickets/clientid/:clientid', function (req, res, next) {
app.get('/tickets/ticketid/:ticketid/posts', function (req, res, next) {
app.get('/tickets/ticketid/:ticketid', function (req, res, next) {
app.get('/tickets', function (req, res, next) {
app.get('/clients', function (req, res, next) {
app.get('/clients/clientid/:clientid', function (req, res, next) {
app.get('/clients/clientid/:clientid/tickets', function (req, res, next) {
app.get('/clients/clientid/:clientid/contacts', function (req, res, next) {
app.get('/contacts/contactid/:contactid', function (req, res, next) {
app.get('/admins', function (req, res, next) {
app.get('/'
*/
