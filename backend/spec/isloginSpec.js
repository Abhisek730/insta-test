const request = require('supertest');
const sequelize = require('../config/db');
const User = require('../models/User');
const { app, server } = require('../app');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

describe('isLogin Middleware', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
        server.close();
    });

    beforeEach(async () => {
        await User.destroy({ truncate: true, cascade: true });
    });

    it('[REQ001]_should_return_401_if_no_authorization_header', (done) => {
        request(app)
            .get('/test')
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.success).toBe(false);
                expect(res.body.message).toBe('You have to login to create post');
                done();
            });
    });

    it('[REQ002]_should_return_401_if_invalid_token', (done) => {
        const invalidToken = jwt.sign({ id: 'invalid' }, 'wrongsecret');

        request(app)
            .get('/test')
            .set('Authorization', `Bearer ${invalidToken}`)
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.message).toBe('Error while Verification');
                done();
            });
    });

    it('[REQ003]_should_return_401_if_user_not_found', async () => {
        const validToken = jwt.sign({ id: 'nonexistentid' }, JWT_SECRET);

        const response = await request(app)
            .get('/test')
            .set('Authorization', `Bearer ${validToken}`)
            .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('User not found in db');
    });

    it('[REQ004]_should_call_next_if_token_is_valid_and_user_exists', async () => {
        const user = await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123', 
            fullname: 'Test User'
        });

        const validToken = jwt.sign({ id: user.id }, JWT_SECRET);

        const response = await request(app)
            .get('/test')
            .set('Authorization', `Bearer ${validToken}`)
            .expect(200);

        expect(response.text).toBe('Success');
    });
});
