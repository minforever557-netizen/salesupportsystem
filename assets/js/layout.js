import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut }
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc }
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {

    /* ================= 1. เก็บ content หน้าเดิม ================= */
    const pageEl = document.getElementById("page-content");
    if (!pageEl) return;

    const pageHTML = pageEl.innerHTML;

    /* ================= 2. โหลด layout ================= */
    const res = await fetch("/salesupportsystem/layout.html");
    const layoutHTML = await res.text();

    document.body.innerHTML = layoutHTML;

    /* ================= 3. ใส่ content กลับ ================= */
    const slot = document.getElementById("page-content");
    slot.innerHTML = pageHTML;

    /* ================= 4. init ================= */
    initLayout();
    initAuth();
});

/* ================= UI Layout ================= */
function initLayout() {

    // เวลา
    const dateEl = document.getElementById("currentDateTime");
    const timeEl = document.getElementById("userTime");

    setInterval(() => {
        const now = new Date();
        if (dateEl) dateEl.innerText = now.toLocaleString("th-TH");
        if (timeEl) timeEl.innerText = now.toLocaleTimeString("th-TH");
    }, 1000);

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.onclick = () => signOut(auth);
    }
}

/* ================= Firebase Auth + Role ================= */
function initAuth() {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {
            window.location.href = "/salesupportsystem/index.html";
            return;
        }

        document.getElementById("userEmail").innerText = user.email;

        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) return;

        const role = snap.data().role;
        renderMenu(role);
    });
}

/* ================= Role Menu ================= */
function renderMenu(role) {

    const nav = document.querySelector(".dashboard-nav");
    nav.innerHTML = "";

    nav.innerHTML += `<a href="/salesupportsystem/index.html">🏠 Dashboard</a>`;

    if (role === "user") {
        nav.innerHTML += `<a href="/salesupportsystem/user/main.html">👤 User</a>`;
    }

    if (role === "supervisor") {
        nav.innerHTML += `<a href="/salesupportsystem/supervisor/main.html">🧑‍💼 Supervisor</a>`;
    }

    if (role === "admin") {
        nav.innerHTML += `
            <a href="/salesupportsystem/admin/main.html">🛠 Admin</a>
            <a href="/salesupportsystem/supervisor/main.html">🧑‍💼 Supervisor</a>
            <a href="/salesupportsystem/user/main.html">👤 User</a>
        `;
    }
}
