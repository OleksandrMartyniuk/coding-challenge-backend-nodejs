const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, stop, start } = require('../dist/index');
const should = chai.should();
chai.use(chaiHttp)

let server;

describe('Tests', () => {
    before(async () => {
        server = await start;
    });

    after(() => {
        stop();
    });

    it('it should GET', (done) => {
        chai.request(app)
            .get('/hello')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.eql('World')
                done();
            });
    });
});
