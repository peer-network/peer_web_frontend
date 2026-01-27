const firebaseConfig = {
  apiKey: typeof FIREBASE_API_KEY !== 'undefined' ? FIREBASE_API_KEY : "",
  authDomain: "peer-de113.firebaseapp.com",
  projectId: "peer-de113",
  storageBucket: "peer-de113.firebasestorage.app",
  messagingSenderId: "1088506353097",
  appId: typeof FIREBASE_APP_ID !== 'undefined' ? FIREBASE_APP_ID : "",
  measurementId: "G-RYR3LKVF4L",
};
//  This works with compat
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();