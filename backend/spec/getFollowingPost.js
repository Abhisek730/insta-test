const request = require('supertest');
const User = require('../models/User');
const Post = require('../models/Post');
const Follow = require('../models/Follow');
const { app } = require('../app');
const jwt = require('jsonwebtoken');
require('./helpers/dbSetup'); // Import centralized setup

describe('Following Posts API', () => {
    let user;
    let followingUser;
    let token;
    let followingUserToken;

    beforeAll(async () => {
        try {
            // Create main user
            user = await User.create({
                username: 'mainuser_' + Date.now(),
                email: 'mainuser' + Date.now() + '@example.com',
                password: 'password123',
                fullname: 'Main User'
            });
    
            // Create a following user
            followingUser = await User.create({
                username: 'followuser_' + Date.now(),
                email: 'followuser' + Date.now() + '@example.com',
                password: 'password123',
                fullname: 'Follow User'
            });
    
            // Generate JWT tokens
            token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'default_jwt_secret', { expiresIn: '1h' });
    
            // Create some posts for the following user
            await Post.bulkCreate([
                {
                    caption: 'Follow User Post 1',
                    image: 'https://example.com/followuser1.jpg',
                    hashtag: '#followuser1',
                    userId: followingUser.id
                },
                {
                    caption: 'Follow User Post 2',
                    image: 'https://example.com/followuser2.jpg',
                    hashtag: '#followuser2',
                    userId: followingUser.id
                }
            ]);

            console.log('Follower ID:', user.id);
console.log('Following User ID:', followingUser.id);

    
            // Follow the following user
            await Follow.create({
                followerId: user.id,
                followingId: followingUser.id
            });
        } catch (error) {
            console.error('Error during beforeAll setup:', error);
            throw error;
        }
    });
    

    beforeEach(async () => {
        // Ensure no posts are left over from previous tests
        await Post.destroy({ truncate: true, cascade: true });
    });

    it('[REQXXX]_fetch_following_posts_successfully', async () => {
        // Create posts for the following user
        await Post.bulkCreate([
            {
                caption: 'Follow User Post 1',
                image: 'https://example.com/followuser1.jpg',
                hashtag: '#followuser1',
                userId: followingUser.id
            },
            {
                caption: 'Follow User Post 2',
                image: 'https://example.com/followuser2.jpg',
                hashtag: '#followuser2',
                userId: followingUser.id
            }
        ]);

        const response = await request(app)
            .get('/api/following-posts')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(jasmine.arrayContaining([
            jasmine.objectContaining({
                id: jasmine.any(Number),
                profileImg: 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png',
                username: followingUser.username,
                time: jasmine.any(String),
                postImg: 'https://example.com/followuser1.jpg',
                caption: 'Follow User Post 1',
                likeCount: jasmine.any(Number),
                commentCount: jasmine.any(Number),
                likedByUserIds: jasmine.any(Array)
            }),
            jasmine.objectContaining({
                id: jasmine.any(Number),
                profileImg: 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png',
                username: followingUser.username,
                time: jasmine.any(String),
                postImg: 'https://example.com/followuser2.jpg',
                caption: 'Follow User Post 2',
                likeCount: jasmine.any(Number),
                commentCount: jasmine.any(Number),
                likedByUserIds: jasmine.any(Array)
            })
        ]));
    });

   
});











// it('[REQXXX]_fetch_no_posts_when_not_following', async () => {
//     // Ensure no posts are available if not following anyone
//     const response = await request(app)
//         .get('/api/following-posts')
//         .set('Authorization', `Bearer ${followingUserToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toEqual([]);
// });