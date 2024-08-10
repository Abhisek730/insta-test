import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfilePosts from '../src/components/Profile/ProfilePosts.js';
import ProfileHeader from '../src/components/Profile/ProfileHeader.js';
import '@testing-library/jasmine-dom'; // Ensure this is correctly set up

describe('ProfilePosts Component', () => {
  it('[REQ016]_should_render_username_correctly', () => {
    const username = 'testuser'; // Replace with your test username
    const postCount = 10; // Replace with your test post count

    render(<ProfileHeader username={username} postCount={postCount} />);

    const usernameElement = screen.getByText(username);

    // Ensure the username element is present and contains the correct text
    expect(usernameElement.textContent).toBe(username);
  });
  it('[REQ017]_should_render_posts_with_correct_src_and_alt_attributes', () => {
    const posts = [
      { id: 1, image: "https://via.placeholder.com/150" },
      { id: 2, image: "https://via.placeholder.com/150" },
      { id: 3, image: "https://via.placeholder.com/150" }
    ];

    render(<ProfilePosts posts={posts} />);
    const postElements = screen.getAllByRole('img');

    postElements.forEach((postElement, index) => {
      // Check if the 'src' attribute exists and matches the expected value
      expect(postElement.getAttribute('src')).toBeTruthy();
      expect(postElement.getAttribute('src')).toBe('https://via.placeholder.com/150');

      // Check if the 'alt' attribute exists and matches the expected value
      expect(postElement.getAttribute('alt')).toBeTruthy();
      expect(postElement.getAttribute('alt')).toBe(`Post ${posts[index].id}`);
    });
  });
});
