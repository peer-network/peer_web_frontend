const firebaseConfig = {
  apiKey: "AIzaSyBRrV8AuxJlS_9DQ2jZKqTHT8m70AhGxiU",
  authDomain: "peer-de113.firebaseapp.com",
  projectId: "peer-de113",
  storageBucket: "peer-de113.firebasestorage.app",
  messagingSenderId: "1088506353097",
  appId: "1:1088506353097:web:e74867ffd43d0fad440418",
  measurementId: "G-RYR3LKVF4L",
};
//  This works with compat
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();