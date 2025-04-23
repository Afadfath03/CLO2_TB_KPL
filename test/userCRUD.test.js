const request = require('supertest');
const app = require('../server');

const name = 'test'
const email = 'test@gmail.com'
const password = 'test123'

describe('User CRUD Operations', () => {
    let adminToken;
    let userId;

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

    it('Should create new user', (done) => {
        request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: name, email: email, password: password, role: 1 })
            .end((err, res) => {
                if (err) return done(err);
                expect(res.statusCode).toEqual(201);
                done();
            });
    });

    it('Should get new user info', (done) => {
        request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.statusCode).toEqual(200);
                userId = res.body[res.body.length - 1].id;
                done();
            });
    });

    it('Should update an existing user', (done) => {
        request(app)
            .put(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'updateduser', email: 'updated@example.com', password: 'newpassword', role: 0 })
            .end((err, res) => {
                if (err) return done(err);
                expect(res.statusCode).toEqual(200);
                done();
            });
    });

    it('Should delete user', (done) => {
        request(app)
            .delete(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.statusCode).toEqual(200);
                done();
            });
    });

    it('Should not get deleted user', (done) => {
        request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .end((err, res) => {
                expect(res.statusCode).toEqual(404);
                done();
            });
    });
});