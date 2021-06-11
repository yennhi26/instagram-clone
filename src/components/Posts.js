import React from "react";
import "./Posts.css";
import { db } from "../utils/firebase";
import Post from '../components/Post'

export default function Posts({user}) {

    const [posts, setPosts] = React.useState([]);

    React.useEffect(() => {
        db.collection("posts")
          .orderBy("timestamp", "desc")
          .onSnapshot((snapshot) => {
            setPosts(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                post: doc.data(),
              }))
            );
          });
      }, []);


  return (
    <div className="app_posts">
            {posts.map(({ id, post }) => (
              <Post
                key={id}
                postId={id}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
                user={user}
              />
            ))}
          </div>
  );
}
