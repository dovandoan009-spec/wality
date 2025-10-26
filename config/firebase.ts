import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCo8ipNMq9sPQmmqfrjA7hVLJJsxvfl38E",
  authDomain: "web-quality-1d1bd.firebaseapp.com",
  projectId: "web-quality-1d1bd",
  storageBucket: "web-quality-1d1bd.firebasestorage.app",
  messagingSenderId: "503943139917",
  appId: "1:503943139917:web:8eea95ef5606e1cfbf8204",
  measurementId: "G-C1GSXF74LG",
  databaseURL: "https://web-quality-1d1bd-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
