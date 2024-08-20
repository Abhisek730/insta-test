const request = require('supertest');
const { app } = require('../app');
const { User, Follow } = require('../models');
const jwt = require('jsonwebtoken');

describe('User Controller Tests', () => {
  let token;
  let followerId;
  let followeeId;

  beforeAll(async () => {
    // Create test users
    const user1 = await User.create({ username: 'user1', email: 'user1@example.com', password: 'password1', fullname: 'User One' });
    const user2 = await User.create({ username: 'user2', email: 'user2@example.com', password: 'password2', fullname: 'User Two' });

    followerId = user1.id;
    followeeId = user2.id;

    // Generate JWT token
    token = jwt.sign({ id: followerId, username: 'user1' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  });

  afterAll(async () => {
    // Clean up test data
    await Follow.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  it('should follow a user successfully', async () => {
    const response = await request(app)
      .post('/api/users/follow')
      .set('Authorization', `Bearer ${token}`)
      .send({ followeeId });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User followed successfully');
  });

  it('should handle already following the user', async () => {
    // Follow the user first
    await request(app)
      .post('/api/users/follow')
      .set('Authorization', `Bearer ${token}`)
      .send({ followeeId });

    // Try to follow again
    const response = await request(app)
      .post('/api/users/follow')
      .set('Authorization', `Bearer ${token}`)
      .send({ followeeId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('You are already following this user');
  });

  it('should unfollow a user successfully', async () => {
    // Follow the user first
    await request(app)
      .post('/api/users/follow')
      .set('Authorization', `Bearer ${token}`)
      .send({ followeeId });

    // Unfollow the user
    const response = await request(app)
      .post('/api/users/unfollow')
      .set('Authorization', `Bearer ${token}`)
      .send({ followeeId });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User unfollowed successfully');
  });

  it('should handle not following the user', async () => {
    const response = await request(app)
      .post('/api/users/unfollow')
      .set('Authorization', `Bearer ${token}`)
      .send({ followeeId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('You are not following this user');
  });
});
