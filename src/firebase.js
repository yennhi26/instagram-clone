import firebase from 'firebase'

const firebaseApp = firebase.initializeApp(
    {
        apiKey: "AIzaSyBge_SV9R3jfV3UHNLUA4eyDsn_si7ufiY",
        authDomain: "instagram-clone-56114.firebaseapp.com",
        projectId: "instagram-clone-56114",
        storageBucket: "instagram-clone-56114.appspot.com",
        messagingSenderId: "464901224956",
        appId: "1:464901224956:web:c5b3f1034863d957e15a79",
        measurementId: "G-QX3TP490ES"
      }
)

  const db = firebaseApp.firestore()
  const auth = firebase.auth()
  const storage = firebase.storage()
  export {db, auth, storage};