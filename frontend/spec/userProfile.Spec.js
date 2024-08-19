import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import UserProfile from '../src/pages/UserProfile'; // Adjust path if needed

const API_URL = window.location.origin.replace("3000", "4000");

describe('UserProfile component tests', () => {
  let container;
  let mockFetch;

  beforeEach(() => {
    mockFetch = jasmine.createSpy('fetch');

    global.fetch = mockFetch;

    mockFetch.and.callFake((url, options) => {
      if (url.includes('/api/users/profile/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            user: {
              username: 'testuser',
              fullname: 'Test User'
            },
            posts: [
              { id: '1', image: 'image1.jpg', userId: '123' },
              { id: '2', image: 'image2.jpg', userId: '123' }
            ]
          }),
        });
      }
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'An error occurred' }),
      });
    });

    container = render(
      <Router>
        <Route path="/profile/:username">
          <UserProfile />
        </Route>
      </Router>
    );
  });

  afterEach(() => {
    cleanup();
    // Reset the global fetch mock
    global.fetch = undefined;
  });

  it('[REQ001]_should_render_UserProfile_component_correctly', async () => {
    const { getByText } = container;

    await waitFor(() => {
      expect(getByText('Test User')).toBeTruthy();
      expect(getByText('2 posts')).toBeTruthy();
    });
  });

  it('[REQ002]_should_fetch_and_display_user_profile_data', async () => {
    const { getByText } = container;

    await waitFor(() => {
      expect(getByText('Test User')).toBeTruthy();
      expect(getByText('2 posts')).toBeTruthy();
    });

    expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/api/users/profile/testuser`, jasmine.objectContaining({
      method: 'GET',
      headers: jasmine.objectContaining({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      })
    }));
  });

  it('[REQ003]_should_handle_fetch_error_gracefully', async () => {
    mockFetch.and.callFake(() => Promise.resolve({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'An error occurred' })
    }));

    const { getByText } = container;

    await waitFor(() => {
      expect(getByText('Test User')).toBeTruthy();
      expect(getByText('2 posts')).toBeTruthy();
    });
  });
});
