import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC2LM1U6S0jA0pZ2cKRyPdxMHB0eS0Jxq0",
  authDomain: "test-e41ce.firebaseapp.com",
  projectId: "test-e41ce",
  storageBucket: "test-e41ce.firebasestorage.app",
  messagingSenderId: "285737390594",
  appId: "1:285737390594:web:947a5ae8ab34b9c90c0d1b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
