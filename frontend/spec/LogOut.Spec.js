// Import setupTests.js to ensure the #root element is available
import '../src/setupModalsTests';
import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jasmine-dom';
import AppLayout from '../src/pages/AppLayout';
import LogoutModal from '../src/components/LogOut/LogOut';
import { AuthProvider } from '../src/context/AuthContext';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter

// describe('AppLayout Component', () => {
//   let closeModal;
//   let onConfirm;

//   beforeEach(() => {
//     closeModal = jasmine.createSpy('closeModal');
//     onConfirm = jasmine.createSpy('onConfirm');

//     // Render the AppLayout with the mock context
//     render(
//       <AuthProvider value={{ logout: jasmine.createSpy('logout') }}>
//         <AppLayout />
//       </AuthProvider>
//     );
//   });

//   afterEach(() => {
//     cleanup();
//   });

//   it('[REQ0033]_shows_logout_modal_after_logout_button_click', async () => {
//     // Click the logout button
//     const logoutButton = screen.getByText('Log Out');
//     fireEvent.click(logoutButton);
  
//     // Add a log to check if the logout button was clicked
//     console.log('Logout button clicked');
  
//     // Check if the LogoutModal is rendered
//     await waitFor(() => {
//       const modalTitle = screen.getByText('Confirm Logout');
//       console.log('Modal title found:', modalTitle);
//       expect(modalTitle).toBeTruthy();
//     });
  
//     // Optionally, log the entire document body for further inspection
//     console.log(document.body.innerHTML);
//   });
// });


describe('AppLayout Component', () => {
  let closeModal;
  let onConfirm;

  beforeEach(() => {
    closeModal = jasmine.createSpy('closeModal');
    onConfirm = jasmine.createSpy('onConfirm');

    // Render the AppLayout with the mock context
    render(
      <AuthProvider value={{ logout: jasmine.createSpy('logout') }}>
        <MemoryRouter> {/* Wrap with MemoryRouter */}
          <AppLayout />
        </MemoryRouter>
      </AuthProvider>
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('[REQ0033]_shows_logout_modal_after_logout_button_click', async () => {
    // Click the logout button
    const logoutButton = screen.getByText('Log Out');
    expect(logoutButton).toBeTruthy();
    fireEvent.click(logoutButton);
  
    // Add a log to check if the logout button was clicked
    console.log('Logout button clicked');
  
    // Check if the LogoutModal is rendered
    await waitFor(() => {
      const modalTitle = screen.getByText('Confirm Logout');
      console.log('Modal title found:', modalTitle);
      expect(modalTitle).toBeTruthy();
    });
  
    // Optionally, log the entire document body for further inspection
    console.log(document.body.innerHTML);
  });
});




describe('LogoutModal Component', () => {
  let closeModal;
  let onConfirm;

  beforeEach(() => {
    closeModal = jasmine.createSpy('closeModal');
    onConfirm = jasmine.createSpy('onConfirm');
  });

  afterEach(() => {
    cleanup();
  });

  it('calls onConfirm when the Logout button is clicked', async () => {
    render(<LogoutModal onClose={closeModal} onConfirm={onConfirm} />);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalled();
    });
  });

  it('calls onClose when the Cancel button is clicked', async () => {
    render(<LogoutModal onClose={closeModal} onConfirm={onConfirm} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });
  });

  it('calls onClose when the modal close button is clicked', async () => {
    render(<LogoutModal onClose={closeModal} onConfirm={onConfirm} />);

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });
  });
});



















// import React from 'react';
// import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
// import '@testing-library/jasmine-dom';
// import AppLayout from '../src/pages/AppLayout';
// import LogoutModal from '../src/components/LogOut/LogOut';
// import { AuthProvider } from '../src/context/AuthContext';
// import Modal from 'react-modal';

// // Ensure Modal is set up correctly
// const setupModal = () => {
//   // Create a div with id 'root' and append it to the document body
//   const root = document.createElement('div');
//   root.setAttribute('id', 'root');
//   document.body.appendChild(root);

//   // Set the app element to the newly created div
//   Modal.setAppElement(root);
// };

// describe('AppLayout Component', () => {
//   let closeModal;
//   let onConfirm;

//   beforeAll(() => {
//     // Set up the modal app element before all tests
//     setupModal();
//   });

//   afterAll(() => {
//     // Clean up the 'root' element after all tests
//     const root = document.getElementById('root');
//     if (root) {
//       document.body.removeChild(root);
//     }
//   });

//   beforeEach(() => {
//     closeModal = jasmine.createSpy('closeModal');
//     onConfirm = jasmine.createSpy('onConfirm');

//     // Render the AppLayout with the mock context
//     render(
//       <AuthProvider value={{ logout: jasmine.createSpy('logout') }}>
//         <AppLayout />
//       </AuthProvider>
//     );
//   });

//   afterEach(() => {
//     cleanup();
//   });

//   it('[REQ0033]_shows_logout_modal_after_logout_button_click', async () => {
//     // Click the logout button
//     const logoutButton = screen.getByText('Log Out');
//     fireEvent.click(logoutButton);

//     // Check if the LogoutModal is rendered
//     await waitFor(() => {
//       const modalTitle = screen.getByText('Confirm Logout');
//       expect(modalTitle).toBeTruthy();
//     });
//   });
// });

// describe('LogoutModal Component', () => {
//   let closeModal;
//   let onConfirm;

//   beforeAll(() => {
//     // Set up the modal app element before all tests
//     setupModal();
//   });

//   afterAll(() => {
//     // Clean up the 'root' element after all tests
//     const root = document.getElementById('root');
//     if (root) {
//       document.body.removeChild(root);
//     }
//   });

//   beforeEach(() => {
//     closeModal = jasmine.createSpy('closeModal');
//     onConfirm = jasmine.createSpy('onConfirm');
//   });

//   afterEach(() => {
//     cleanup();
//   });

//   it('calls onConfirm when the Logout button is clicked', async () => {
//     render(<LogoutModal onClose={closeModal} onConfirm={onConfirm} />);

//     const logoutButton = screen.getByText('Logout');
//     fireEvent.click(logoutButton);

//     await waitFor(() => {
//       expect(onConfirm).toHaveBeenCalled();
//     });
//   });

//   it('calls onClose when the Cancel button is clicked', async () => {
//     render(<LogoutModal onClose={closeModal} onConfirm={onConfirm} />);

//     const cancelButton = screen.getByText('Cancel');
//     fireEvent.click(cancelButton);

//     await waitFor(() => {
//       expect(closeModal).toHaveBeenCalled();
//     });
//   });

//   it('calls onClose when the modal close button is clicked', async () => {
//     render(<LogoutModal onClose={closeModal} onConfirm={onConfirm} />);

//     const closeButton = screen.getByText('×');
//     fireEvent.click(closeButton);

//     await waitFor(() => {
//       expect(closeModal).toHaveBeenCalled();
//     });
//   });
// });




























// import React from 'react';
// import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
// import '@testing-library/jasmine-dom';
// import AppLayout from '../src/pages/AppLayout';
// import LogoutModal from '../src/components/LogOut/LogOut';
// import { AuthProvider } from '../src/context/AuthContext';
// import Modal from 'react-modal';

// // Ensure Modal is set up correctly
// const setupModal = () => {
//   // Create a div with id 'root' and append it to the document body
//   const root = document.createElement('div');
//   root.setAttribute('id', 'root');
//   document.body.appendChild(root);

//   // Set the app element to the newly created div
//   Modal.setAppElement(root);

//   return root;
// };

// describe('AppLayout Component', () => {
//   let closeModal;
//   let container;

//   beforeEach(() => {
//     // Set up the modal app element
//     setupModal();

//     closeModal = jasmine.createSpy('closeModal');

//     // Render the AppLayout with the mock context
//     container = render(
//       <AuthProvider value={{ logout: jasmine.createSpy('logout') }}>
//         <AppLayout />
//       </AuthProvider>
//     );
//   });

//   afterEach(() => {
//     cleanup();
//     // Remove the 'root' element after each test
//     const root = document.getElementById('root');
//     if (root) {
//       document.body.removeChild(root);
//     }
//   });

//   it('[REQ0033]_shows_logout_modal_after_logout_button_click', async () => {
//     // Click the logout button
//     const logoutButton = screen.getByText('Log Out');
//     fireEvent.click(logoutButton);

//     // Check if the LogoutModal is rendered
//     await waitFor(() => {
//       const modalTitle = screen.getByText('Confirm Logout');
//       expect(modalTitle).toBeTruthy();
//     });
//   });
// });
