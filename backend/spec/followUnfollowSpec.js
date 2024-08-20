const request = require('supertest');
const User = require('../models/User');
const Post = require('../models/Post');
const Follow = require('../models/Follow');
const { app } = require('../app');
const jwt = require('jsonwebtoken');
require('./helpers/dbSetup');

describe('Profile and Follow/Unfollow API', () => {
    let user, otherUser, token;

    beforeAll(async () => {
        user = await User.create({
            username: 'testuser' + Date.now(),
            email: 'testuser' + Date.now() + '@example.com',
            password: 'Password123',
            fullname: 'Test User'
        });

        otherUser = await User.create({
            username: 'otheruser' + Date.now(),
            email: 'otheruser' + Date.now() + '@example.com',
            password: 'Password123',
            fullname: 'Other User'
        });

        token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'default_jwt_secret', { expiresIn: '1h' });

        await Post.create({
            caption: 'Test Caption',
            image: 'test-image.jpg',
            hashtag: '#test',
            userId: otherUser.id
        });
    });

    describe('GET /api/users/profile/:username', () => {
        it('[REQ047]_fetch_user_profile_by_username_successfully', async () => {
            const response = await request(app)
                .get(`/api/users/profile/${otherUser.username}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.user.username).toBe(otherUser.username);
            expect(response.body.posts.length).toBe(1);
        });

        it('[REQ048]_fetch_non_existing_user_profile', async () => {
            const response = await request(app)
                .get('/api/users/profile/nonexistentuser')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('User not found');
        });
    });

    describe('POST /api/users/follow', () => {
        it('[REQ049]_follow_user_successfully', async () => {
            const response = await request(app)
                .post(`/api/users/follow/${otherUser.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ followeeId: otherUser.id });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Successfully followed the user');
        });

    
    });

    describe('POST /api/users/unfollow', () => {
        it('[REQ051]_unfollow_user_successfully', async () => {
            const response = await request(app)
                .post(`/api/users/unfollow/${otherUser.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ followeeId: otherUser.id });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Successfully unfollowed the user');
        });

     
    });
});
