import React from "react";
import { Button } from "@material-ui/core";
import { storage, db } from "../utils/firebase";
import firebase from "firebase";
import "./ImageUpload.css";
import clsx from 'clsx';

function ImageUpload({ username, className }) {
  const [caption, setCaption] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [progress, setProgress] = React.useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //   progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // error function
        alert(error.message);
      },
      () => {
        // complete function
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // post image inside db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };
  return (
    <div className={clsx(className)}>
        <div className={clsx('imageUpload')}>
            <progress className="progress" value={progress} max="100" />
            <input
                type="text"
                placeholder="Enter your caption"
                onChange={(e) => setCaption(e.target.value)}
                value={caption}
            />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload} disabled={!image}>
                Upload
            </Button>
        </div>
    </div>
  );
}

export default ImageUpload;
