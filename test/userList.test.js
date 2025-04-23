const request = require('supertest');
const app = require('../server');

describe('Get User List', () => {
    let adminToken;

    beforeAll((done) => {
        request(app)
            .post('/api/login')
            .send({ emailOrUsername: 'admin', password: 'admin123' })
            .end((err, res) => {
                if (err) return done(err);
                adminToken = res.body.token;
                done();
            });
    });

    it('Shouls get user list', (done) => {
        request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.statusCode).toEqual(200);
                expect(Array.isArray(res.body)).toBe(true);
                res.body.forEach(user => {
                    expect(user).toHaveProperty('id');
                    expect(user).toHaveProperty('name');
                    expect(user).toHaveProperty('email');
                    expect(user).toHaveProperty('role');
                });
                done();
            });
    });
});