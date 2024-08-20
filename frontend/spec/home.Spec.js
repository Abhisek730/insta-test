import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jasmine-dom";
import FeedCard from "../src/components/Feed/FeedCard/FeedCard";

describe("FeedCard Component", () => {
  const feed = {
    id: 1,
    profileImg: "https://via.placeholder.com/150",
    username: "john_doe",
    time: "2024-07-31T22:12:19.840Z",
    postImg: "https://via.placeholder.com/600",
    likeCount: 150,
    mutualFrndImg1: "https://via.placeholder.com/50",
    mutualFrndImg2: "https://via.placeholder.com/50",
    commentCount: 20,
    caption: "Enjoying the sunset!",
    likedByUserIds: [1, 2]
  };

  it("[REQ014]_renders_FeedCard_component_with_feed_data", () => {
    const { container } = render(<FeedCard feed={feed} />);
    console.log(container.innerHTML); // Log the HTML to debug

    // Check profile image
    expect(screen.getByAltText(feed.username)).toBeTruthy();
    
    // Check post image alt text
    expect(screen.getByAltText(feed.caption)).toBeTruthy();

    // Check like count
    expect(screen.getByText(`${feed.likeCount} likes`)).toBeTruthy();
    
    // Check comment count
    expect(screen.getByText(`View all ${feed.commentCount} comments`)).toBeTruthy();
    
    // Check caption
    expect(screen.getByText(feed.caption)).toBeTruthy();
  });
});






















// import React from "react";
// import { render, screen } from "@testing-library/react";
// import "@testing-library/jasmine-dom";
// import FeedCard from "../src/components/Feed/FeedCard/FeedCard";

// describe("FeedCard Component", () => {
//   const feed = {
//     id: 1,
//     profileImg: "https://via.placeholder.com/150",
//     username: "john_doe",
//     time: "2024-07-31T22:12:19.840Z",
//     postImg: "https://via.placeholder.com/600",
//     likeCount: 150,
//     mutualFrndImg1: "https://via.placeholder.com/50",
//     mutualFrndImg2: "https://via.placeholder.com/50",
//     commentCount: 20,
//     caption: "Enjoying the sunset!",
//     likedByUserIds:[1,2]
//   };

//   it("[REQ014]_renders_FeedCard_component_with_feed_data", () => {
//     render(<FeedCard feed={feed} />);

//     expect(screen.getByAltText(feed.username)).toBeTruthy();
    
    
//     expect(screen.getByAltText(feed.caption)).toBeTruthy();
//     expect(screen.getByText(`${feed.likeCount} likes`)).toBeTruthy();
//     expect(screen.getByText(`View all ${feed.commentCount} comments`)).toBeTruthy();
//     expect(screen.getByText(feed.caption)).toBeTruthy();
//   });
// });