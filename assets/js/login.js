import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("loginBtn");
    const msg = document.getElementById("msg");

    if (!btn) {
        console.error("❌ loginBtn not found");
        return;
    }

    btn.onclick = async () => {

        const email = document.getElementById("email").value;
        const pass  = document.getElementById("password").value;

        msg.innerText = "⏳ Logging in...";

        try {
            await signInWithEmailAndPassword(window.auth, email, pass);
            location.href = "/salesupportsystem/dashboard.html";
        } catch (err) {
            msg.innerText = err.message;
        }
    };
});
