// assets/js/layout.js
document.addEventListener("DOMContentLoaded", async () => {

    /* ===== 1. เก็บ content เดิม ===== */
    const pageSlot = document.getElementById("page-content");
    if (!pageSlot) return;

    const pageHTML = pageSlot.innerHTML;

    /* ===== 2. โหลด layout ===== */
    const res = await fetch("../layout.html");
    const layoutHTML = await res.text();

    document.body.innerHTML = layoutHTML;

    /* ===== 3. ใส่ content กลับ ===== */
    const target = document.getElementById("page-content");
    if (target) target.innerHTML = pageHTML;

    /* ===== 4. init ===== */
    initLayout();
    waitFirebase();
});

/* ================= UI ================= */
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
        logoutBtn.onclick = () => auth.signOut();
    }
}

/* ================= Firebase Ready ================= */
function waitFirebase() {
    if (window.auth && window.db) {
        initAuth();
    } else {
        setTimeout(waitFirebase, 100);
    }
}

/* ================= Auth + Role ================= */
function initAuth() {

    auth.onAuthStateChanged(async (user) => {

        if (!user) {
            location.href = "../index.html";
            return;
        }

        document.getElementById("userEmail").innerText = user.email;

        const snap = await db
            .collection("users")
            .doc(user.uid)
            .get();

        if (!snap.exists) return;

        renderMenu(snap.data().role);
    });
}

/* ================= Role Menu ================= */
function renderMenu(role) {

    const nav = document.querySelector(".dashboard-nav");
    if (!nav) return;

    nav.innerHTML = `
        <a href="../index.html">🏠 Dashboard</a>
    `;

    if (role === "user") {
        nav.innerHTML += `
            <a href="../user/main.html">👤 User</a>
        `;
    }

    if (role === "supervisor") {
        nav.innerHTML += `
            <a href="../supervisor/main.html">🧑‍💼 Supervisor</a>
        `;
    }

    if (role === "admin") {
        nav.innerHTML += `
            <a href="../admin/main.html">🛠 Admin</a>
            <a href="../supervisor/main.html">🧑‍💼 Supervisor</a>
            <a href="../user/main.html">👤 User</a>
        `;
    }
}
