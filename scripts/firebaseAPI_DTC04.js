// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { initializeApp } from "firebase/firestore";

// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAAjvSbl5oI5gs-CYTlXRNWeqzrB414-6Q",
    authDomain: "comp1800-dtc04-1214c.firebaseapp.com",
    projectId: "comp1800-dtc04-1214c",
    storageBucket: "comp1800-dtc04-1214c.appspot.com",
    messagingSenderId: "864029291383",
    appId: "1:864029291383:web:3c67bd126f028f68c4e772",
    storageBucket: "gs://comp1800-dtc04-1214c.appspot.com"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
var storage = firebase.storage();