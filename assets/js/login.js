import { auth } from "./firebase.js";
import { signInWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const msg = document.getElementById("msg");

document.getElementById("loginBtn").onclick = async () => {
    try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        location.href = "user/main.html"; // redirect แรก (role จะจัดการต่อ)
    } catch (err) {
        msg.innerText = err.message;
    }
};
