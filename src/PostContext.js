import { createContext, useState, useContext } from "react";
import { faker } from "@faker-js/faker";
const PostContext = createContext();

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost()),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isFakeDark, setIsFakeDark] = useState(false);

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  return (
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
// The PostProvider component is a context provider that provides the context value to all the components inside it
// . The value is an object that contains the posts, the functions to add and clear posts, and the search query
// and its setter function.

//simple way to create cutom context is to copy cut all the state and conetxt value and return it

function usePosts() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
}

export { PostProvider, usePosts };

// This is a custom hook that allows us to consume the context value from the PostContext.Provider.
// It checks if the context is undefined, which means that the component is not wrapped in a PostProvider.
// If it is undefined, it throws an error. Otherwise, it returns the context value.
