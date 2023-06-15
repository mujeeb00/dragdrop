import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
const firebaseConfig = {
  apiKey: "AIzaSyDYE6o0o9nvnG8MNu9lBhIbkMai55j4v_s",
  authDomain: "taskboard-7f134.firebaseapp.com",
  databaseURL: "https://taskboard-7f134-default-rtdb.firebaseio.com",
  projectId: "taskboard-7f134",
  storageBucket: "taskboard-7f134.appspot.com",
  messagingSenderId: "1930913286",
  appId: "1:1930913286:web:7da228563c9cb645d10587",
  measurementId: "G-7NJQQMM5R2"
};

firebase.initializeApp(firebaseConfig);
export const dataRef=firebase.database();
export default firebase;