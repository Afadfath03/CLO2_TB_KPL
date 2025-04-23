const request = require('supertest');
const app = require('../server');

describe('Login User', () => {
    it('should login successfully', (done) => {
        request(app)
            .post('/api/login')
            .send({ emailOrUsername: 'user', password: '1234' })
            .end((err, res) => {
                if (err) return done(err);
                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty('token');
                done();
            }
            );
    });
});