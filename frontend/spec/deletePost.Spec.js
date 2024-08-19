import '../src/setupModalsTests';
import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import ProfilePosts from '../src/components/Profile/ProfilePosts';
import Modal from 'react-modal';

const API_URL = window.location.origin.replace("3000", "5000");

describe('ProfilePosts component tests', () => {
    let container;
    let mockUpdateNewPost;
    let updateNewPost;
    let posts;

    beforeEach(() => {
        // Create a div with id 'root' and append it to the document body
        const root = document.createElement('div');
        root.setAttribute('id', 'root');
        document.body.appendChild(root);

        // Set the app element to the newly created div
        Modal.setAppElement(root);

        mockUpdateNewPost = jasmine.createSpy('mockUpdateNewPost');
        updateNewPost = jasmine.createSpy('updateNewPost');

        // Mock fetch globally
        spyOn(window, 'fetch').and.callFake((url, options) => {
            if (url.endsWith(`/api/posts/delete/1`) && options.method === 'DELETE') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ success: true }),
                });
            }
            return Promise.resolve({
                ok: false,
                status: 500,
                json: () => Promise.resolve({ error: 'An error occurred' }),
            });
        });

        posts = [
            { id: 1, image: 'image1.jpg' },
            { id: 2, image: 'image2.jpg' }
        ];

        container = render(<ProfilePosts posts={posts} updateNewPost={mockUpdateNewPost} />);
    });

    afterEach(() => {
        cleanup();
        // Remove the 'root' element after each test
        const root = document.getElementById('root');
        if (root) {
            document.body.removeChild(root);
        }
        window.fetch.calls.reset();
    });

    it('[REQ045]_should_open_the_delete_modal_when_delete_icon_is_clicked', () => {
        const { getByAltText, getByTestId } = container;

        // Find the delete icon for the first post and click it
        const deleteIcon = getByAltText('Post 1').parentNode.querySelector('.group-hover\\:opacity-100');
        fireEvent.click(deleteIcon);

        // Verify that the delete modal is opened
        const modal = document.querySelector('.ReactModal__Content');
        expect(modal).toBeTruthy();
    });

    it('[REQ046]_should_delete_post_when_confirm_button_in_modal_is_clicked', async () => {
        // Render the component
        const { getByAltText, getByText, queryByText } = container;

        // Open the delete modal
        const deleteIcon = getByAltText('Post 1').parentNode.querySelector('.group-hover\\:opacity-100');
        fireEvent.click(deleteIcon);

        // Click the "Yes" button in the modal
        const confirmButton = getByText('Yes');
        fireEvent.click(confirmButton);

        // Wait for fetch to be called and modal to close
        await waitFor(() => {
            // Ensure fetch was called with correct parameters
            expect(window.fetch).toHaveBeenCalledWith(
                jasmine.stringMatching('/api/posts/delete/1'),
                jasmine.objectContaining({
                    method: 'DELETE',
                    headers: jasmine.objectContaining({
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    }),
                })
            );




        });

    });



    it('[REQ047]_should_close_the_delete_modal_when_cancel_button_is_clicked', () => {
        const { getByAltText, getByText } = container;

        // Open the delete modal
        const deleteIcon = getByAltText('Post 1').parentNode.querySelector('.group-hover\\:opacity-100');
        fireEvent.click(deleteIcon);

        // Find the cancel button in the delete modal and click it
        const cancelButton = getByText('Cancel');
        fireEvent.click(cancelButton);

        // Verify that the delete modal is closed
        const modal = document.querySelector('.ReactModal__Content');
        expect(modal).toBeFalsy();
    });
});
