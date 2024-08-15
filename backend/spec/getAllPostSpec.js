const request = require('supertest');
const User = require('../models/User');
const Post = require('../models/Post');
const { app } = require('../app');
const jwt = require('jsonwebtoken');
require('./helpers/dbSetup'); // Import centralized setup

describe('Post API', () => {
    let user;
    let token;

    beforeAll(async () => {
        try {
            // Ensure unique email and username
            user = await User.create({
                username: 'testuser_' + Date.now(), // Ensure unique username
                email: 'testuser' + Date.now() + '@example.com', // Ensure unique email
                password: 'password123',
                fullname: 'Test User'
            });

            // Generate a JWT token for the created user
            token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'default_jwt_secret', { expiresIn: '1h' });

            // Create some posts to fetch later
            await Post.bulkCreate([
                {
                    caption: 'First post!',
                    image: 'https://example.com/image1.jpg',
                    hashtag: '#first',
                    userId: user.id
                },
                {
                    caption: 'Second post!',
                    image: 'https://example.com/image2.jpg',
                    hashtag: '#second',
                    userId: user.id
                },
                {
                    caption: 'Third post!',
                    image: 'https://example.com/image3.jpg',
                    hashtag: '#third',
                    userId: user.id
                }
            ]);
        } catch (error) {
            console.error('Error during beforeAll setup:', error);
            throw error;
        }
    });

    beforeEach(async () => {
        // Ensure no posts are left over from previous tests
        await Post.destroy({ truncate: true, cascade: true });
    });

    describe('GET /api/posts/getAll', () => {
        it('[REQ026]_fetch_all_posts_successfully', async () => {
            // Create some posts for the test
            await Post.bulkCreate([
                {
                    caption: 'Post 1',
                    image: 'https://example.com/post1.jpg',
                    hashtag: '#post1',
                    userId: user.id
                },
                {
                    caption: 'Post 2',
                    image: 'https://example.com/post2.jpg',
                    hashtag: '#post2',
                    userId: user.id
                }
            ]);

            const response = await request(app)
                .get('/api/posts/getAll')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(jasmine.arrayContaining([
                jasmine.objectContaining({
                    id: jasmine.any(Number),
                    username: user.username, // Use actual username
                    profileImg: jasmine.any(String), // Ensure it matches actual profile image URL if needed
                    postImg: 'https://example.com/post1.jpg',
                    caption: 'Post 1',
                    likeCount: jasmine.any(Number),
                    commentCount: jasmine.any(Number),
                    time: jasmine.any(String)
                }),
                jasmine.objectContaining({
                    id: jasmine.any(Number),
                    username: user.username, // Use actual username
                    profileImg: jasmine.any(String), // Ensure it matches actual profile image URL if needed
                    postImg: 'https://example.com/post2.jpg',
                    caption: 'Post 2',
                    likeCount: jasmine.any(Number),
                    commentCount: jasmine.any(Number),
                    time: jasmine.any(String)
                })
            ]));
        });

        it('[REQ027]_fetch_no_posts', async () => {
            const response = await request(app)
                .get('/api/posts/getAll')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        // it('[REQ028]_fetch_posts_with_invalid_token', async () => {
        //     const response = await request(app)
        //         .get('/api/posts/getAll')
        //         .set('Authorization', 'Bearer invalid_token');

        //     expect(response.status).toBe(401);
        //     expect(response.body).toEqual({
        //         success: false,
        //         message: 'Invalid credentials'
        //     });
        // });
    });
});
