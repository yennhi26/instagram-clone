import React from "react";
import { Button, Input } from "@material-ui/core";
import { storage, db } from "../utils/firebase";
import firebase from "firebase";
import "./ImageUpload.css";
import clsx from "clsx";

function ImageUpload({ username, className, innerClassName }) {
  const [caption, setCaption] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [preview, setPreview] = React.useState();
  const [progress, setProgress] = React.useState(0);

  const fileInputRef = React.createRef();

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

  React.useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image]);

  const chooseImage = (e) => {
    const file = e.target.files[0];
    if (file && file.type.substr(0, 5) === "image") {
      setImage(file);
    } else {
      setImage(null);
    }
  };
  return (
    <div className={clsx(className)}>
      <div className={clsx("imageUpload", innerClassName)}>
        <div className="uploadSection">
          <form accept="image/*" onChange={chooseImage}>
            <input
              type="file"
              onChange={handleChange}
              className="fileInput"
              ref={fileInputRef}
            />
            <Button
              onClick={(e) => {
                e.preventDefault();
                fileInputRef.current.click();
              }}
              className="chooseButton"
            >
              Choose Image
            </Button>
          </form>
          <Button
            onClick={handleUpload}
            disabled={!image}
            className="uploadButton"
          >
            Upload
          </Button>
        </div>
        <Input
          type="text"
          placeholder="Enter your caption"
          onChange={(e) => setCaption(e.target.value)}
          value={caption}
          className="textInput"
        />
        <progress className="progress" value={progress} max="100" />
        {preview && <img src={preview} className="previewImage" alt="" />}
      </div>
    </div>
  );
}

export default ImageUpload;
