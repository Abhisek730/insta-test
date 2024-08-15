// import '../src/setupModalsTests';
// import React from 'react';
// import Modal from "react-modal";
// import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
// import PostDetailsModal from '../src/components/PostDetailsModal/PostDetailsModal';
// import { FaTimes, FaArrowLeft } from 'react-icons/fa';

// describe('PostDetailsModal Component', () => {
//   let closeModal;
//   let handleAddComment;
//   let setNewComment;
//   let handleKeyDown;
//   let newComment;
//   let feed;
//   let comments;

//   beforeEach(() => {
//     closeModal = jasmine.createSpy('closeModal');
//     handleAddComment = jasmine.createSpy('handleAddComment');
//     setNewComment = jasmine.createSpy('setNewComment');
//     handleKeyDown = jasmine.createSpy('handleKeyDown');
//     newComment = '';
//     feed = {
//       id: '1',
//       postImg: 'image_url',
//       profileImg: 'profile_img_url',
//       username: 'user1',
//       caption: 'Post caption',
//     };
//     comments = [
//       { id: '1', postedBy: { username: 'user2' }, comment: 'Nice post!' },
//     ];

//     setNewComment.and.callFake((value) => {
//       newComment = value;
//     });
//   });

//   afterEach(() => {
//     cleanup();
//   });

//   it('[REQ0038]_calls_onClose_when_the_back_button_is_clicked_on_mobile', async () => {
//     render(
//       <PostDetailsModal
//         isOpen={true}
//         onClose={closeModal}
//         feed={{ postImg: '', caption: '', profileImg: '', username: '' }}
//         comments={[]}
//         handleAddComment={() => {}}
//         newComment=""
//         setNewComment={() => {}}
//         handleKeyDown={() => {}}
//       />
//     );

//     // Debug output to verify the rendered HTML
//     screen.debug();

//      // Ensure the mobile back button is rendered correctly
//      const backButton = screen.getByRole('button', { name: /comments/i });
//      expect(backButton).toBeInTheDocument();
 
//      fireEvent.click(backButton);
 

//     await waitFor(() => {
//       expect(closeModal).toHaveBeenCalled();
//     });
//   });
  
  

//   it('[REQ0039]_calls_onClose_when_the_desktop_close_button_is_clicked', async () => {
//     render(
//       <PostDetailsModal
//         isOpen={true}
//         onClose={closeModal}
//         feed={{ postImg: '', caption: '', profileImg: '', username: '' }}
//         comments={[]}
//         handleAddComment={() => {}}
//         newComment=""
//         setNewComment={() => {}}
//         handleKeyDown={() => {}}
//       />
//     );

//     // Debug output to verify the rendered HTML
//     screen.debug();

//     // Ensure the desktop close button is rendered correctly
//     const closeButton = screen.getByRole('button', { name: /close/i });
//     expect(closeButton).toBeInTheDocument();

//     fireEvent.click(closeButton);

//     await waitFor(() => {
//       expect(closeModal).toHaveBeenCalled();
//     });
//   });
  
  

//   it('[REQ0040]_calls_handleAddComment_when_the_Post_button_is_clicked', async () => {
//     render(
//       <PostDetailsModal
//         isOpen={true}
//         onClose={closeModal}
//         feed={feed}
//         comments={comments}
//         handleAddComment={handleAddComment}
//         newComment={newComment}
//         setNewComment={setNewComment}
//         handleKeyDown={handleKeyDown}
//       />
//     );

//     // Ensure the Post button is present and clickable
//     const postButton = screen.getByText('Post');
//     expect(postButton).toBeTruthy();

//     fireEvent.click(postButton);

//     await waitFor(() => {
//       expect(handleAddComment).toHaveBeenCalled();
//     });
//   });

//   it('[REQ0041]_updates_newComment_state_on_input_change', async () => {
//     render(
//       <PostDetailsModal
//         isOpen={true}
//         onClose={closeModal}
//         feed={feed}
//         comments={comments}
//         handleAddComment={handleAddComment}
//         newComment={newComment}
//         setNewComment={setNewComment}
//         handleKeyDown={handleKeyDown}
//       />
//     );

//     // Ensure the input field is present
//     const inputField = screen.getByPlaceholderText('Add a Comment ....');
//     expect(inputField).toBeTruthy();

//     // Simulate input change
//     fireEvent.change(inputField, { target: { value: 'New comment' } });

//     // Verify that the setNewComment was called with the new value
//     await waitFor(() => {
//       expect(setNewComment).toHaveBeenCalledWith('New comment');
//     });
//   });

//   it('[REQ0042]_calls_handleKeyDown_when_a_key_is_pressed_in_the_input', async () => {
//     render(
//       <PostDetailsModal
//         isOpen={true}
//         onClose={closeModal}
//         feed={feed}
//         comments={comments}
//         handleAddComment={handleAddComment}
//         newComment={newComment}
//         setNewComment={setNewComment}
//         handleKeyDown={handleKeyDown}
//       />
//     );

//     // Ensure the input field is present
//     const inputField = screen.getByPlaceholderText('Add a Comment ....');
//     expect(inputField).toBeTruthy();

//     // Simulate key down event
//     fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter', charCode: 13 });

//     await waitFor(() => {
//       expect(handleKeyDown).toHaveBeenCalled();
//     });
//   });
// });
