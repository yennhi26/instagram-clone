import React from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../utils/firebase";
import firebase from "firebase";

export default function Post({ postId, username, imageUrl, caption, user }) {
  const [comments, setComments] = React.useState([]);
  const [comment, setComment] = React.useState("");

  React.useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setComment("");
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt="Raphequazi"
          src="./public/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>

      <img alt="" className="post__image" src={imageUrl} />

      <h4 className="post__text">
        <b>{username}</b>: {caption}
      </h4>

      {comments.length > 0 && (
        <div className="post__comments">
          {comments?.map((comment) => (
            <p>
              <b>{comment.username}</b>: {comment.text}
            </p>
          ))}
        </div>
      )}

      {user && (
        <form className="post_commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}
