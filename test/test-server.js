var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

describe('Books', function() {
    it('should list ALL booklists on /api/books GET', function(done) {
        chai.request(server)
            .get('/api/books')
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    it('should add a SINGLE booklist on /books POST', function(done) {
        chai.request(server)
            .post('/api/books')
            .send({'Author': 'Joe', 'Title': 'Joe\'s book'})
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Book list saved!');
                done();
            });
    });
    it('should return the newest booklist on /api/books/newest GET', function(done) {
        chai.request(server)
            .get('/api/books/newest')
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });

    it('should return the newest booklist on /api/books/newest GET', function(done) {
        chai.request(server)
            .get('/api/books/newest')
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
});
