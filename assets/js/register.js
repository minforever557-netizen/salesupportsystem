import { auth, db } from "./firebase.js";
import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
    doc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const teamSelect = document.getElementById("team");
const subTeamGroup = document.getElementById("subTeamGroup");
const subTeamSelect = document.getElementById("subTeam");
const msg = document.getElementById("msg");

/* ======================
   TEAM CHANGE
====================== */
teamSelect.onchange = () => {

    const team = teamSelect.value;
    subTeamSelect.innerHTML = "";

    if (team === "FBB Dealer Sales" || team === "FBB Direct Sales") {

        subTeamGroup.style.display = "flex";

        const prefix = team === "FBB Dealer Sales"
            ? "FBB Dealer Sales"
            : "FBB Direct Sales";

        subTeamSelect.innerHTML = `<option value="">-- เลือกทีมย่อย --</option>`;

        for (let i = 1; i <= 10; i++) {
            const opt = document.createElement("option");
            opt.value = `${prefix} ${i}`;
            opt.textContent = `${prefix} ทีม ${i}`;
            subTeamSelect.appendChild(opt);
        }

    } else {
        subTeamGroup.style.display = "none";
    }
};

/* ======================
   REGISTER
====================== */
document.getElementById("registerBtn").onclick = async () => {

    const fullname = document.getElementById("fullname").value.trim();
    const phone    = document.getElementById("phone").value.trim();
    const email    = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const team     = teamSelect.value;
    const subTeam  = subTeamSelect.value || null;

    if (!fullname || !phone || !email || !password || !team) {
        msg.innerText = "⚠️ กรุณากรอกข้อมูลให้ครบ";
        return;
    }

    if ((team === "FBB Dealer Sales" || team === "FBB Direct Sales") && !subTeam) {
        msg.innerText = "⚠️ กรุณาเลือกทีมย่อย";
        return;
    }

    try {
        msg.innerText = "⏳ กำลังสร้างบัญชี...";

        const cred = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", cred.user.uid), {
            fullname,
            phone,
            email,
            team,
            subTeam,
            role: "user",
            createdAt: serverTimestamp()
        });

        msg.style.color = "green";
        msg.innerText = "✅ สมัครสมาชิกสำเร็จ";

        setTimeout(() => location.href = "index.html", 1500);

    } catch (err) {
        console.error(err);
        msg.innerText = "❌ " + err.message;
    }
};
// 👁️ toggle password
document.querySelectorAll(".toggle-password").forEach(btn => {
    btn.addEventListener("click", () => {
        const input = document.getElementById(btn.dataset.target);
        const icon  = btn.querySelector("i");

        if (input.type === "password") {
            input.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");
        }
    });
});

