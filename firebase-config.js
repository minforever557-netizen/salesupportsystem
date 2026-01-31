// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCsUhBsWjZfQuJo5lgprYt3xikQUyf8iiw",
    authDomain: "sale-support-system.firebaseapp.com",
    projectId: "sale-support-system",
    storageBucket: "sale-support-system.firebasestorage.app",
    messagingSenderId: "640337786680",
    appId: "1:640337786680:web:fd80699ac291b8d7a7b3cd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
