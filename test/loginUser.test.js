const request = require('supertest');
const app = require('../server');

describe('Login Admin', () => {
    it('should login successfully', (done) => {
        request(app)
            .post('/api/login')
            .send({ emailOrUsername: 'admin', password: 'admin123' })
            .end((err, res) => {
                if (err) return done(err);
                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty('token');
                done();
            }
            );
    });
});