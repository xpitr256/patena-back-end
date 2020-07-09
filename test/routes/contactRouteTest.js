const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const application = require('../../app');
const proxyquire  =  require('proxyquire');

describe('/POST contact route',() => {

    const validEmail = 'valid@test.com';
    const validName = 'TestName';
    const validMessage = 'Test Message Wit hMore Than Fifty Characters Required';

    it('should return a 400 error for empty contact information', (done) => {
        chai.request(application)
            .post('/contact')
            .send({})
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 error for invalid mail in contact information', (done) => {
        chai.request(application)
            .post('/contact')
            .send({
                email: 'invalid',
                name: validName,
                message: validMessage
            })
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 error for invalid name in contact information', (done) => {
        chai.request(application)
            .post('/contact')
            .send({
                email: validEmail,
                name: '    ',
                message: validMessage
            })
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 error for less than 50 characters message in contact information', (done) => {
        chai.request(application)
            .post('/contact')
            .send({
                email: validEmail,
                name: validName,
                message: 'Too short message'
            })
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should send valid contact information', (done) => {
        const emailServiceMock = {
            sendContactMail : async function(email, name, message) {}
        }
        const contactWithMockedMailService = proxyquire('../../routes/contact', {
            '../services/mail/mailService.js': emailServiceMock
        });

        const application = proxyquire('../../app',{
            './routes/contact': contactWithMockedMailService
        });

        chai.request(application)
            .post('/contact')
            .send({
                email: validEmail,
                name: validName,
                message: validMessage
            })
            .end( (err,res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return 500 error if it cannot send email', (done) => {
        const emailServiceMock = {
            sendContactMail : async function(email, name, message) {
                return new Promise(((resolve, reject) => {
                    reject("Mail service failing on purpose");
                }))
            }
        }
        const contactWithMockedMailService = proxyquire('../../routes/contact', {
            '../services/mail/mailService.js': emailServiceMock
        });

        const application = proxyquire('../../app',{
            './routes/contact': contactWithMockedMailService
        });

        chai.request(application)
            .post('/contact')
            .send({
                email: validEmail,
                name: validName,
                message: validMessage
            })
            .end( (err,res) => {
                expect(res).to.have.status(500);
                done();
            });
    });
});