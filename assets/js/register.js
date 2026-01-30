import { auth, db } from "./firebase.js";
import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    doc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* ======================
   ELEMENT
====================== */
const fullnameEl = document.getElementById("fullname");
const phoneEl = document.getElementById("phone");
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const confirmPasswordEl = document.getElementById("confirmPassword");

const teamSelect = document.getElementById("team");
const subTeamGroup = document.getElementById("subTeamGroup");
const subTeamSelect = document.getElementById("subTeam");

const registerBtn = document.getElementById("registerBtn");
const msg = document.getElementById("msg");

/* ======================
   TEAM CHANGE
====================== */
teamSelect.addEventListener("change", () => {

    const team = teamSelect.value;
    subTeamSelect.innerHTML = `<option value="">เลือกทีมย่อย</option>`;
    subTeamGroup.style.display = "none";

    if (team === "FBB Dealer Sales" || team === "FBB Direct Sales") {

        subTeamGroup.style.display = "flex";

        const prefix =
            team === "FBB Dealer Sales"
                ? "FBB Dealer Sales ทีม"
                : "FBB Direct Sales ทีม";

        for (let i = 1; i <= 10; i++) {
            const opt = document.createElement("option");
            opt.value = `${prefix} ${i}`;
            opt.textContent = `${prefix} ${i}`;
            subTeamSelect.appendChild(opt);
        }
    }
});

/* ======================
   REGISTER
====================== */
registerBtn.addEventListener("click", async () => {

    const fullname = fullnameEl.value.trim();
    const phone = phoneEl.value.trim();
    const email = emailEl.value.trim();
    const password = passwordEl.value;
    const confirmPassword = confirmPasswordEl.value;
    const team = teamSelect.value;
    const subTeam = subTeamSelect.value || "";

    msg.style.color = "#e11d48";

    /* ===== validate ===== */
    if (!fullname || !phone || !email || !password || !confirmPassword || !team) {
        msg.innerText = "⚠️ กรุณากรอกข้อมูลให้ครบทุกช่อง";
        return;
    }

    if (password.length < 6) {
        msg.innerText = "⚠️ รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
        return;
    }

    if (password !== confirmPassword) {
        msg.innerText = "❌ รหัสผ่านไม่ตรงกัน";
        return;
    }

    if (
        (team === "FBB Dealer Sales" || team === "FBB Direct Sales") &&
        !subTeam
    ) {
        msg.innerText = "⚠️ กรุณาเลือกทีมย่อย";
        return;
    }

    try {
        registerBtn.disabled = true;
        registerBtn.innerText = "⏳ กำลังสมัคร...";
        msg.innerText = "⏳ กำลังสร้างบัญชีผู้ใช้...";

        /* ===== Firebase Auth ===== */
        const cred = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        /* ===== Firestore ===== */
        await setDoc(doc(db, "users", cred.user.uid), {
            fullname,
            phone,
            email,
            team,
            subTeam,
            role: "user",
            createdAt: serverTimestamp()
        });

        msg.style.color = "#16a34a";
        msg.innerText = "✅ สมัครสมาชิกสำเร็จ";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);

    } catch (err) {
        console.error(err);
        msg.style.color = "#e11d48";
        msg.innerText = "❌ " + err.message;
        registerBtn.disabled = false;
        registerBtn.innerText = "Register";
    }
});

/* ======================
   👁️ TOGGLE PASSWORD
====================== */
document.querySelectorAll(".toggle-password").forEach(btn => {
    btn.addEventListener("click", () => {

        const input = document.getElementById(btn.dataset.target);
        const icon = btn.querySelector("i");

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
