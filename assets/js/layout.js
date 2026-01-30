// assets/js/layout.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut }
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { doc, getDoc }
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {

    const slot = document.getElementById("page-content");
    if (!slot) return;

    const pageHTML = slot.innerHTML;

    const res = await fetch("/salesupportsystem/layout.html");
    document.body.innerHTML = await res.text();

    document.getElementById("page-content").innerHTML = pageHTML;

    initUI();
    initAuth();
});

/* ===== UI ===== */
function initUI() {

    const dateEl = document.getElementById("currentDateTime");
    const timeEl = document.getElementById("userTime");

    setInterval(() => {
        const now = new Date();
        if (dateEl) dateEl.innerText = now.toLocaleString("th-TH");
        if (timeEl) timeEl.innerText = now.toLocaleTimeString("th-TH");
    }, 1000);

    document.getElementById("logoutBtn").onclick = () => signOut(auth);
}

/* ===== Auth ===== */
function initAuth() {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {
            location.href = "/salesupportsystem/index.html";
            return;
        }

        document.getElementById("userEmail").innerText = user.email;

        const ref  = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) return;

        renderMenu(snap.data().role);
    });
}

/* ===== Role Menu ===== */
function renderMenu(role) {

    const nav = document.querySelector(".dashboard-nav");
    nav.innerHTML = `<a href="/salesupportsystem/index.html">🏠 Dashboard</a>`;

    if (role === "user")
        nav.innerHTML += `<a href="/salesupportsystem/user/main.html">👤 User</a>`;

    if (role === "supervisor")
        nav.innerHTML += `<a href="/salesupportsystem/supervisor/main.html">🧑‍💼 Supervisor</a>`;

    if (role === "admin")
        nav.innerHTML += `
            <a href="/salesupportsystem/admin/main.html">🛠 Admin</a>
            <a href="/salesupportsystem/supervisor/main.html">🧑‍💼 Supervisor</a>
            <a href="/salesupportsystem/user/main.html">👤 User</a>
        `;
}
