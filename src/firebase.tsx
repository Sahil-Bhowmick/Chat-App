import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCzMUKjBSe6fy66XoRWsyxSDnAfIDO05eE",
  authDomain: "chatify-940ec.firebaseapp.com",
  projectId: "chatify-940ec",
  storageBucket: "chatify-940ec.appspot.com",
  messagingSenderId: "745687743983",
  appId: "1:745687743983:web:c354ee8bd27269a66a0a1a",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
