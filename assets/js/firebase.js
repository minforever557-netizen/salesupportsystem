// assets/js/firebase.js
import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSy....",
    authDomain: "sale-support-system.firebaseapp.com",
    projectId: "sale-support-system",
};

// Init
const app = initializeApp(firebaseConfig);

// Export to window (สำคัญ)
window.auth = getAuth(app);
window.db   = getFirestore(app);
