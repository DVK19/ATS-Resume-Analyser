import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBVDXFJt7As-Q5Z2QO6AEx500sbofOWtaI",
  authDomain: "gen-lang-client-0229949397.firebaseapp.com",
  projectId: "gen-lang-client-0229949397",
  storageBucket: "gen-lang-client-0229949397.firebasestorage.app",
  messagingSenderId: "944706788764",
  appId: "1:944706788764:web:6028d9d7b20826fca7bc59"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();