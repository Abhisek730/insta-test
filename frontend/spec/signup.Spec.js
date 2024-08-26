import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jasmine-dom";
import { BrowserRouter } from "react-router-dom";
import SignUp from "../src/pages/SignUp";
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../src/context/AuthContext';

const API_URL = window.location.origin.replace("3000", "5000")

describe("SignUp component tests", () => {
  beforeEach(() => {
    // Mock fetch globally to spy on it
    spyOn(window, "fetch").and.callFake((url, options) => {
      if (url.endsWith("/api/users/register") && options.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: "Registered Successfully" }),
        });
      }
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "An error occurred" }),
      });
    });
  });

  afterEach(() => {
    // Reset spy after each test
    window.fetch.calls.reset();
  });


  it("[REQ001]_renders_SignUp_form_with_all_necessary_fields", () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/Full Name/i)).toBeTruthy(); // Use .toBeTruthy() instead of .toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Email/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Username/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Password/i)).toBeTruthy();
  });



  it("[REQ002]_register_new_user_and_displays_success_message", async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "geekyjha@gmail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: "johndoe" } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "m789456123M@" } });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    // Wait for the registration to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Assert that the success message is displayed
    expect(screen.getByText("Registered Successfully")).toBeTruthy();
  });

  it("[REQ006]_submits_form_with_all_fields_filled_and_sends_correct_data", async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "geekyjha@gmail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: "johndoe" } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "m789456123M@" } });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    // Wait for the form submission to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Assert that fetch was called with the correct data
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "johndoe",
        fullname: "John Doe",
        email: "geekyjha@gmail.com",
        password: "m789456123M@",

      }),
    });
  });
  it("[REQ007]__display_an_error_message_for_invalid_password", async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );


    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "geekyjha@gmail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: "johndoe" } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "short" } });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    // Wait for the form submission to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Assert that the success message is displayed
    expect(screen.getByText("Password must contain at least 8 characters, including at least 1 number and 1 includes both lower and uppercase letters and special characters for example #,?,!")).toBeTruthy();
  });

});

describe("Google Login functionality in SignUp component", () => {
  beforeEach(() => {
    // Mock fetch globally to spy on it
    spyOn(window, "fetch").and.callFake((url, options) => {
      if (url.endsWith("/api/users/googleLogin") && options.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: "Google Login Successful", token: "mockToken" }),
        });
      }
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Google Login failed" }),
      });
    });

    // Mock useAuth to test login function
    spyOn(useAuth(), "login").and.callThrough();
  });

  afterEach(() => {
    // Reset spies after each test
    window.fetch.calls.reset();
    useAuth().login.calls.reset();
  });

  it("[REQ001]_renders_Google_Login_button", () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    expect(screen.getByText("Continue With Google")).toBeTruthy();
  });

  it("[REQ002]_successfully_logs_in_with_Google_and_navigates_to_home", async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const googleButton = screen.getByText("Continue With Google");
    fireEvent.click(googleButton);

    // Mock the Google credential response
    const mockCredentialResponse = {
      credential: "mockCredentialToken",
    };

    // Simulate the GoogleLogin onSuccess function
    await waitFor(() => screen.getByText("Google Login Successful"));

    expect(window.fetch).toHaveBeenCalledWith(`${API_URL}/api/users/googleLogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_verified: undefined, // Extracted from the JWT
        email: undefined, // Extracted from the JWT
        name: undefined, // Extracted from the JWT
        clientId: undefined, // Extracted from the JWT
        username: undefined, // Extracted from the JWT
        Photo: undefined, // Extracted from the JWT
      }),
    });

    // Assert login function is called with correct data
    expect(useAuth().login).toHaveBeenCalledWith({
      message: "Google Login Successful",
      token: "mockToken",
    });

    // Assert that the success message is displayed
    expect(screen.getByText("Google Login Successful")).toBeTruthy();
  });

  it("[REQ003]_displays_error_message_on_failed_Google_login", async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const googleButton = screen.getByText("Continue With Google");
    fireEvent.click(googleButton);

    // Simulate the GoogleLogin onError function
    await waitFor(() => screen.getByText("Google Login failed"));

    // Assert that the error message is displayed
    expect(screen.getByText("Google Login failed. Please try again.")).toBeTruthy();
  });
});