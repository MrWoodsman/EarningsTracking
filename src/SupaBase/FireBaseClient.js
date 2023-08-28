// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAxQsKEmWDDjV83qWIGTYqWBiZaQP2J_rw",
	authDomain: "earningsapp-ac4f1.firebaseapp.com",
	projectId: "earningsapp-ac4f1",
	storageBucket: "earningsapp-ac4f1.appspot.com",
	messagingSenderId: "80081141936",
	appId: "1:80081141936:web:cb2c229c50b4dd27b3fb75",
	measurementId: "G-6JSJBCLBM2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
