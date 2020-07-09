const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const application = require('../app');

describe('/GET invalid route',() => {

    it('should return a 404 error', (done) => {
        chai.request(application)
            .get('/invalid')
            .end( (err,res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should return a 404 error with Origin header too', (done) => {
        chai.request(application)
            .get('/invalid')
            .set('Origin', 'from appTest')
            .end( (err,res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should return a 404 error with Access-Control-Request-Method header too', (done) => {
        chai.request(application)
            .get('/invalid')
            .set('Origin', 'from appTest')
            .set('Access-Control-Request-Method', 'GET')
            .end( (err,res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should return a 404 error with Access-Control-Request-Headers header too', (done) => {
        chai.request(application)
            .get('/invalid')
            .set('Origin', 'from appTest')
            .set('Access-Control-Request-Headers', 'X-Custom-Header')
            .end( (err,res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should return a 200 for OPTIONS method', (done) => {
        chai.request(application)
            .options('/invalid')
            .set('Origin', 'from appTest')
            .end( (err,res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('/GET index default route',() => {

    it('should return a name and api version', (done) => {
        chai.request(application)
            .get('/')
            .end( (err,res) => {
                expect(res).to.have.status(200);
                expect(res.body.name).to.be.equals('PATENA api');
                expect(res.body.version).to.be.equals('v1');
                done();
            });
    });
});

