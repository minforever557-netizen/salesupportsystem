import { auth, db } from "./firebase.js";
import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

    const btn     = document.getElementById("loginBtn");
    const loading = document.getElementById("loginLoading");

    /* ===== POPUP ===== */
    const popup     = document.getElementById("errorPopup");
    const popupText = document.getElementById("errorText");
    const closeBtn  = document.getElementById("closePopup");

    closeBtn.onclick = () => {
        popup.style.display = "none";
        btn.disabled = false;
        loading.classList.remove("show");
    };

    /* ===== LOGIN ===== */
    btn.onclick = async () => {

        const email = document.getElementById("email").value.trim();
        const pass  = document.getElementById("password").value.trim();

        if (!email || !pass) {
            popupText.innerText = "⚠️ กรุณากรอก Email และ Password";
            popup.style.display = "flex";
            return;
        }

        // 🔄 loading
        loading.classList.add("show");
        btn.disabled = true;

        try {
            // 1️⃣ Login
            const cred = await signInWithEmailAndPassword(auth, email, pass);
            const user = cred.user;

            // 2️⃣ Load role
            const snap = await getDoc(doc(db, "users", user.uid));
            if (!snap.exists()) throw new Error("user-data-missing");

            const role = snap.data().role;

            // 3️⃣ Redirect
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

            let text = "❌ เกิดข้อผิดพลาด";

            switch (err.code) {
                case "auth/user-not-found":
                    text = "❌ ไม่พบผู้ใช้นี้ในระบบ";
                    break;

                case "auth/wrong-password":
                    text = "❌ รหัสผ่านไม่ถูกต้อง";
                    break;

                case "auth/invalid-email":
                    text = "❌ รูปแบบ Email ไม่ถูกต้อง";
                    break;

                case "auth/too-many-requests":
                    text = "⚠️ ลองผิดหลายครั้ง กรุณารอสักครู่";
                    break;
            }

            popupText.innerText = text;
            popup.style.display = "flex";

            btn.disabled = false;
            loading.classList.remove("show");
        }
    };

    /* ===== 👁 TOGGLE PASSWORD ===== */
    document.querySelectorAll(".toggle-password").forEach(btn => {
        btn.addEventListener("click", () => {

            const input = document.getElementById(btn.dataset.target);
            const icon  = btn.querySelector("i");
            if (!input) return;

            if (input.type === "password") {
                input.type = "text";
                icon.classList.replace("fa-eye", "fa-eye-slash");
            } else {
                input.type = "password";
                icon.classList.replace("fa-eye-slash", "fa-eye");
            }
        });
    });

});
