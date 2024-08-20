import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jasmine-dom';
import ProfileHeader from "../src/components/Profile/ProfileHeader";

// Mock localStorage
beforeAll(() => {
    global.localStorage.setItem("username", "currentuser");
    global.localStorage.setItem("token", "fakeToken");
});

describe("ProfileHeader Component", () => {
    const mockUsername = "testuser";
    const mockUserId = 1;
    const mockPostCount = 10;

    // Mock fetch response for follow/unfollow
    beforeEach(() => {
        global.fetch = jasmine.createSpy("fetch");
    });

    // Test case for checking initial follow status
    it("[REQ051]_should_display_follow_button_initially_if_the_user_is_not_following", async () => {
        // Mock API response for follow status check (not following)
        global.fetch.and.returnValue(Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ isFollowing: false }),
        }));

        // Render the component
        render(
            <ProfileHeader username={mockUsername} userId={mockUserId} postCount={mockPostCount} />
        );

        // Wait for the follow status to be set
        await waitFor(() => {
            const followButton = screen.getByText("Follow");
            expect(followButton).toBeTruthy(); // Verify the "Follow" button is displayed
        });
    });

    // Test case for checking initial unfollow status
    it("[REQ052]_should_display_unfollow_button_initially_if_the_user_is_following", async () => {
        // Mock API response for follow status check (following)
        global.fetch.and.returnValue(Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ isFollowing: true }),
        }));

        // Render the component
        render(
            <ProfileHeader username={mockUsername} userId={mockUserId} postCount={mockPostCount} />
        );

        // Wait for the follow status to be set
        await waitFor(() => {
            const unfollowButton = screen.getByText("Unfollow");
            expect(unfollowButton).toBeTruthy(); // Verify the "Unfollow" button is displayed
        });
    });

    // Test case for following a user
    it("[REQ053]_should_call_follow_api_and_display_unfollow_button_when_follow_button_is_clicked", async () => {
        // Mock API response for follow status check (not following)
        global.fetch.and.returnValue(Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ isFollowing: false }),
        }));

        // Render the component
        render(
            <ProfileHeader username={mockUsername} userId={mockUserId} postCount={mockPostCount} />
        );

        // Wait for the component to load
        await waitFor(() => {
            const followButton = screen.getByText("Follow");
            expect(followButton).toBeTruthy(); // Verify the "Follow" button is displayed
        });

        // Mock API response for follow action
        global.fetch.and.returnValue(Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
        }));

        // Click the follow button
        fireEvent.click(screen.getByText("Follow"));

        // Verify that the fetch was called with the correct API endpoint and method
        expect(global.fetch).toHaveBeenCalledWith(`${window.location.origin.replace("3000", "4000")}/api/follow/${mockUserId}`, jasmine.any(Object));

        // Wait for the follow status to be updated
        await waitFor(() => {
            const unfollowButton = screen.getByText("Unfollow");
            expect(unfollowButton).toBeTruthy(); // Verify the "Unfollow" button is displayed after following
        });
    });

    // Test case for unfollowing a user
    it("[REQ054]_should_call_unfollow_api_and_display_follow_button_when_unfollow_button_is_clicked", async () => {
        // Mock API response for follow status check (following)
        global.fetch.and.returnValue(Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ isFollowing: true }),
        }));

        // Render the component
        render(
            <ProfileHeader username={mockUsername} userId={mockUserId} postCount={mockPostCount} />
        );

        // Wait for the component to load
        await waitFor(() => {
            const unfollowButton = screen.getByText("Unfollow");
            expect(unfollowButton).toBeTruthy(); // Verify the "Unfollow" button is displayed
        });

        // Mock API response for unfollow action
        global.fetch.and.returnValue(Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
        }));

        // Click the unfollow button
        fireEvent.click(screen.getByText("Unfollow"));

        // Verify that the fetch was called with the correct API endpoint and method
        expect(global.fetch).toHaveBeenCalledWith(`${window.location.origin.replace("3000", "4000")}/api/unfollow/${mockUserId}`, jasmine.any(Object));

        // Wait for the follow status to be updated
        await waitFor(() => {
            const followButton = screen.getByText("Follow");
            expect(followButton).toBeTruthy(); // Verify the "Follow" button is displayed after unfollowing
        });
    });
});
