var app = require('../app');
var request = require('supertest');
describe('GET /', function(){
  it('respond with json', function(done){
    request(app)
      .get('/')
      .expect(405, done);
  })
})
