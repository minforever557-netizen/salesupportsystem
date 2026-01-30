import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { doc, setDoc }
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.getElementById("registerBtn").onclick = async () => {

    const email = document.getElementById("email").value;
    const pass  = document.getElementById("password").value;
    const role  = document.getElementById("role").value;

    try {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);

        await setDoc(doc(db, "users", cred.user.uid), {
            email,
            role,
            createdAt: new Date()
        });

        location.href = "index.html";

    } catch (err) {
        document.getElementById("msg").innerText = err.message;
    }
};
