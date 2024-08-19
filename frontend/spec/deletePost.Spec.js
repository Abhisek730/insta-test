import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import PostDetailModal from '../src/components/Feed/PostDetailPage/PostDetailPage';
import Modal from 'react-modal';

const API_URL = window.location.origin.replace("3000", "8888");

describe('PostDetailModal - Delete Post Tests', () => {
  let container;
  let onClose;
  let fetchSpy;
  let feed;

  beforeEach(() => {
    // Create a div with id 'root' and append it to the document body
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);

    // Set the app element to the newly created div
    Modal.setAppElement(root);

    onClose = jasmine.createSpy('onClose');

    // Sample feed data
    feed = {
      id: '123',
      userId: '456', // Owner of the post
      username: 'testuser',
      profileImg: 'http://example.com/profile.jpg',
      postImg: 'http://example.com/post.jpg',
      caption: 'Test Caption'
    };

    // Mock fetch globally
    spyOn(window, 'fetch').and.callFake((url, options) => {
      if (url.endsWith(`/api/posts/delete/${feed.id}`) && options.method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({})
        });
      }
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'An error occurred' })
      });
    });

    // Set user ID in local storage to match the post owner
    localStorage.setItem('id', feed.userId);

    container = render(
      <PostDetailModal
        isOpen={true}
        onClose={onClose}
        feed={feed}
        handleAddComment={() => {}}
        newComment=""
        setNewComment={() => {}}
        getComments={() => {}}
      />
    );
  });

  afterEach(() => {
    cleanup();
    // Remove the 'root' element after each test
    const root = document.getElementById('root');
    if (root) {
      document.body.removeChild(root);
    }
    window.fetch.calls.reset();
    localStorage.removeItem('id');
  });

  it('[REQ032]_should_render_delete_button_when_user_is_post_owner', () => {
    const { getByText } = container;

    // Check if the Delete button is rendered
    const deleteButton = getByText('Delete');
    expect(deleteButton).toBeTruthy();
  });

  it('[REQ033]_should_not_render_delete_button_when_user_is_not_post_owner', () => {
    // Change the user ID in local storage to simulate a different user
    localStorage.setItem('id', 'differentUserId');

    cleanup(); // Cleanup previous render
    container = render(
      <PostDetailModal
        isOpen={true}
        onClose={onClose}
        feed={feed}
        handleAddComment={() => {}}
        newComment=""
        setNewComment={() => {}}
        getComments={() => {}}
      />
    );

    const { queryByText } = container;

    // Check if the Delete button is not rendered
    const deleteButton = queryByText('Delete');
    expect(deleteButton).toBeNull();
  });

  it('[REQ034]_should_call_delete_api_and_close_modal_on_successful_deletion', async () => {
    const { getByText } = container;

    const deleteButton = getByText('Delete');

    fireEvent.click(deleteButton);

    await waitFor(() => {
      // Assert fetch was called with the correct data
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/posts/delete/${feed.id}`, jasmine.objectContaining({
        method: 'DELETE',
        headers: jasmine.objectContaining({
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        })
      }));

      // Assert that the modal is closed
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('[REQ035]_should_show_alert_on_delete_failure', async () => {
    // Mock fetch to return a failed response
    fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'Delete failed' })
    }));

    const { getByText } = container;

    const deleteButton = getByText('Delete');

    // Spy on the window alert method
    spyOn(window, 'alert');

    fireEvent.click(deleteButton);

    await waitFor(() => {
      // Assert that alert is called with the correct message
      expect(window.alert).toHaveBeenCalledWith('Delete failed');
    });
  });

});
