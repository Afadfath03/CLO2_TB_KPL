const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const app = require('../server');

chai.use(chaiHttp);

describe('Login API', () => {
    it('Expect: Success', (done) => {
        chai.request(app)
            .post('/api/login')
            .send({ emailOrUsername: 'Admin', password: 'admin123' })
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('token');
                done();
            });
    });
});