const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const url= 'http://localhost:3000';

describe('/GET invalid route',()=>{
    it('should return a 404 error', (done) => {
        chai.request(url)
            .get('/invalid')
            .end( (err,res) => {
                expect(res).to.have.status(404);
                done();
            });
    });
});