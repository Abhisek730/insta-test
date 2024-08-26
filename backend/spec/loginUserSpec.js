// spec/testFile2.spec.js
const request = require('supertest');
const {User,Post,Comment,Like,Follow} = require('../models');
const { app } = require('../app');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret'; // Use a default for testing
require('./helpers/dbSetup'); // Import centralized setup

describe('User API - Login', () => {
    beforeEach(async () => {
        await User.destroy({ truncate: true, cascade: true }); // Clear all users before each test
    });

    describe('POST /api/users/login', () => {
        beforeAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; // Set timeout to 10 seconds globally
        });

        it('[REQ009]_login_successfully_with_correct_credentials', async () => {
            // Hash the password before storing
            const hashedPassword = await bcryptjs.hash('password123', 10);

            await User.create({
                username: 'testuser',
                email: 'testuser@example.com',
                password: hashedPassword,
                fullname: 'abhi ag'
            });

            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'testuser@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: jasmine.any(Number),
                username: jasmine.any(String),
                token: jasmine.any(String), // Use jasmine.any for object comparison
                message: 'Login Successfully'
            });
        });

        it('[REQ007]_fail_login_with_incorrect_password', async () => {
            const hashedPassword = await bcryptjs.hash('password123', 10);

            await User.create({
                username: 'testuser',
                email: 'testuser@example.com',
                password: hashedPassword,
                fullname: 'abhi ag'
            });

            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'testuser@example.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                error: 'Invalid password'
            });
        });

        it('[REQ008]_fail_login_with_non_existent_email', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'nonexistentuser@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                error: 'User Not Found with Given email'
            });
        });
    });
});

describe('User API - Google Login', () => {
    beforeEach(async () => {
        await User.destroy({ truncate: true, cascade: true }); // Clear all users before each test
    });

    it('[REQ010]_login_or_register_successfully_with_valid_google_credentials', async () => {
        const validGoogleCredential = {
            email: 'googleuser@example.com',
            email_verified: true,
            name: 'Google User',
            sub: 'google_client_id',
            picture: 'https://example.com/photo.jpg'
        };
    
        const response = await request(app)
            .post('/api/users/googleLogin')
            .send({
                email: validGoogleCredential.email,
                email_verified: validGoogleCredential.email_verified,
                name: validGoogleCredential.name,
                clientId: validGoogleCredential.sub,
                username: 'googleuser',
                Photo: validGoogleCredential.picture,
            });
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            user: jasmine.objectContaining({
                id: jasmine.any(Number),
                username: jasmine.any(String),
                fullname: jasmine.any(String),
                email: jasmine.any(String),
                // Ignoring other properties
            }),
            token: jasmine.any(String),
            message: 'Registered and Logged in Successfully'
        });
    });
    

    it('[REQ011]_fail_login_with_invalid_google_credentials', async () => {
        // Simulate an invalid Google credential response
        const invalidGoogleCredential = {
            email: 'invaliduser@example.com',
            email_verified: false, // Email not verified
            name: 'Invalid User',
            sub: 'invalid_client_id',
            picture: 'https://example.com/photo.jpg'
        };

        const response = await request(app)
            .post('/api/users/googleLogin')
            .send({
                email: invalidGoogleCredential.email,
                email_verified: invalidGoogleCredential.email_verified,
                name: invalidGoogleCredential.name,
                clientId: invalidGoogleCredential.sub,
                username: 'invaliduser',
                Photo: invalidGoogleCredential.picture,
            });

        expect(response.status).toBe(400); // Assuming 400 Bad Request for unverified email
        expect(response.body).toEqual({
            error: 'Email not verified'
        });
    });
});



