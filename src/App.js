import * as React from "react";
import "./assets/App.css";
import { auth } from "./utils/firebase";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./components/ImageUpload";
import Posts from "./components/Posts";
import Logo from "./components/Logo";
import { useModalStyle } from "./hooks/use-modal-style";
import { useAuthentication } from "./hooks/use-authentication";

function App() {
  const { getModalStyle, useStyles } = useModalStyle();
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [open, setOpen] = React.useState(false);
  const [openSignin, setOpenSignin] = React.useState(false);
  const [openUpload, setOpenUpload] = React.useState(false);

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        if (authUser.displayName) {
          // dont update username
        } else {
          //if we just created someone...
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        setUser(null);
      }
    });
    return () => {
      // perform some clean up action
      unsubscribe();
    };
  }, [user, username]);

  const { signUp, signIn } = useAuthentication(email, password, username);
  const signUpFunc = (e) => {
    e.preventDefault();
    signUp();
    setOpen(false);
  };

  const signInFunc = (e) => {
    e.preventDefault();
    signIn();
    setOpenSignin(false);
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(!open)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <Logo />
            </center>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUpFunc}>
              Sign Up
            </Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignin} onClose={() => setOpenSignin(!open)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <Logo />
            </center>
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signInFunc}>
              Sign In
            </Button>
            <Button onClick={() => setOpenSignin(false)}>Cancel</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openUpload} onClose={() => setOpenUpload(!openUpload)}>
        <div style={modalStyle} className={classes.paper}>
          {user?.displayName ? (
            <ImageUpload
              username={user.displayName}
              innerClassName="customImageUpload"
            />
          ) : (
            <h3>Sorry, you need to login to upload</h3>
          )}
          <Button
            className="app__cancelButton"
            onClick={() => setOpenUpload(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>

      <div className="app__headerWrapper">
        <div className="app__header">
          <Logo />
          {user ? (
            <div className="app_flex">
              <div className="app_uploadButton">
                <Button onClick={() => setOpenUpload(!openUpload)}>Post</Button>
              </div>
              <Button onClick={() => auth.signOut()}>Logout</Button>
            </div>
          ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpenSignin(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )}
        </div>
      </div>

      <div className="app__bodyWrapper">
        <div className="app_postsWrapper">
          <Posts user={user} />

          {user?.displayName ? (
            <ImageUpload
              username={user.displayName}
              className="app__uploadSection"
            />
          ) : (
            <h3 className="app__uploadSection warning">
              Sorry, you need to login to upload
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
