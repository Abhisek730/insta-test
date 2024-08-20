// spec/followUnfollowSpec.js
const request = require('supertest');
const { User, Follow } = require('../models');
const { app } = require('../app');
const jwt = require('jsonwebtoken');
require('./helpers/dbSetup'); // Import centralized setup

describe('Follow/Unfollow API', () => {
    let user, followee, token;

    beforeAll(async () => {
        user = await User.create({
            username: 'testuser' + Date.now(),
            email: 'testuser' + Date.now() + '@example.com',
            password: 'password123',
            fullname: 'Test User'
        });

        followee = await User.create({
            username: 'followee' + Date.now(),
            email: 'followee' + Date.now() + '@example.com',
            password: 'password123',
            fullname: 'Followee User'
        });

        token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'default_jwt_secret', { expiresIn: '1h' });
    });

    afterAll(async () => {
        await Follow.destroy({ where: {}, truncate: true });
        await User.destroy({ where: {}, truncate: true });
    });

    describe('POST /follow', () => {
        it('[REQ041]_follow_user_successfully', async () => {
            const response = await request(app)
                .post('/follow')
                .set('Authorization', `Bearer ${token}`)
                .send({ followeeId: followee.id });
    
            console.log('Response Status:', response.status);
            console.log('Response Body:', response.body);

            expect(response.status).toEqual(200);
            expect(response.body.message).toEqual('User followed successfully');
    
            const follow = await Follow.findOne({ where: { followerId: user.id, followeeId: followee.id } });
            expect(follow).not.toBeNull();
        });
    });

    describe('POST /unfollow', () => {
        beforeEach(async () => {
            await Follow.create({ followerId: user.id, followeeId: followee.id });
        });

        it('[REQ042]_unfollow_user_successfully', async () => {
            const response = await request(app)
                .post('/unfollow')
                .set('Authorization', `Bearer ${token}`)
                .send({ followeeId: followee.id });

            console.log('Response Status:', response.status);
            console.log('Response Body:', response.body);

            expect(response.status).toEqual(200);
            expect(response.body.message).toEqual('User unfollowed successfully');

            const follow = await Follow.findOne({ where: { followerId: user.id, followeeId: followee.id } });
            expect(follow).toBeNull();
        });
    });

    describe('GET /followers/:userId', () => {
        beforeEach(async () => {
            await Follow.create({ followerId: followee.id, followeeId: user.id });
        });

        it('[REQ043]_fetch_followers_successfully', async () => {
            const response = await request(app)
                .get(`/followers/${user.id}`)
                .set('Authorization', `Bearer ${token}`);

            console.log('Response Status:', response.status);
            console.log('Response Body:', response.body);

            expect(response.status).toEqual(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /following/:userId', () => {
        beforeEach(async () => {
            await Follow.create({ followerId: user.id, followeeId: followee.id });
        });

        it('[REQ044]_fetch_following_successfully', async () => {
            const response = await request(app)
                .get(`/following/${user.id}`)
                .set('Authorization', `Bearer ${token}`);

            console.log('Response Status:', response.status);
            console.log('Response Body:', response.body);

            expect(response.status).toEqual(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });
});
