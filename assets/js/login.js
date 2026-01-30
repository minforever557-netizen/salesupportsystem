import { auth, db } from "./firebase.js";
import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
    doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("loginBtn");
    const msg = document.getElementById("msg");
    const loading = document.getElementById("loginLoading");

    btn.onclick = async () => {

        const email = document.getElementById("email").value.trim();
        const pass  = document.getElementById("password").value.trim();

        if (!email || !pass) {
            msg.innerText = "⚠️ กรุณากรอก Email และ Password";
            return;
        }

        // 🔄 show animation
        loading.classList.add("show");
        btn.disabled = true;

        try {
            // 1. Login
            const cred = await signInWithEmailAndPassword(auth, email, pass);
            const user = cred.user;

            // 2. โหลด role จาก Firestore
            const snap = await getDoc(doc(db, "users", user.uid));

            if (!snap.exists()) {
                throw new Error("ไม่พบข้อมูลผู้ใช้");
            }

            const role = snap.data().role;

            // 3. Redirect ตาม role
            if (role === "admin") {
                location.href = "admin/main.html";
            } 
            else if (role === "supervisor") {
                location.href = "supervisor/main.html";
            } 
            else {
                location.href = "user/main.html";
            }

        } catch (err) {
            console.error(err);
            loading.classList.remove("show");
            msg.innerText = "❌ " + err.message;
            btn.disabled = false;
        }
    };
});
