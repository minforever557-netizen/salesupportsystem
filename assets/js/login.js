import { auth } from "./firebase.js";
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

        const email = document.getElementById("email").value.trim();
        const pass  = document.getElementById("password").value.trim();

        if (!email || !pass) {
            msg.innerText = "⚠️ กรุณากรอก Email และ Password";
            return;
        }

        // 🔄 animation
        btn.disabled = true;
        btn.innerText = "Logging in...";
        msg.innerText = "⏳ กำลังเข้าสู่ระบบ...";

        try {
            await signInWithEmailAndPassword(auth, email, pass);

            msg.innerText = "✅ Login สำเร็จ";
            location.href = "/salesupportsystem/user/main.html";

        } catch (err) {
            console.error(err);
            msg.innerText = "❌ " + err.message;

            btn.disabled = false;
            btn.innerText = "Login";
        }
    };
});
