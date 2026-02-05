const firebaseConfig = {
  apiKey: typeof FIREBASE_API_KEY !== 'undefined' ? FIREBASE_API_KEY : "",
  authDomain: typeof authDomain !== 'undefined' ? authDomain : "",
  projectId: typeof projectId !== 'undefined' ? projectId : "",
  storageBucket: typeof storageBucket !== 'undefined' ? storageBucket : "",
  messagingSenderId: typeof messagingSenderId !== 'undefined' ? messagingSenderId : "",
  appId: typeof FIREBASE_APP_ID !== 'undefined' ? FIREBASE_APP_ID : "",
  measurementId: typeof measurementId !== 'undefined' ? measurementId : "",
};

firebase.initializeApp(firebaseConfig);

try {
  firebase.analytics();
} catch (e) {
}

const db = firebase.firestore();