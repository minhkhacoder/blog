/** @format */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyD1iHuTRbQhLRt8rBpVDs85ZG4s8WpFEB4",
  authDomain: "monkey-blogging-5f81d.firebaseapp.com",
  projectId: "monkey-blogging-5f81d",
  storageBucket: "monkey-blogging-5f81d.appspot.com",
  messagingSenderId: "1054836481830",
  appId: "1:1054836481830:web:27b21dc6572083a9842be7",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
