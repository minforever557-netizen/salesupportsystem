document.addEventListener("DOMContentLoaded", async () => {

    const page = document.getElementById("page-content");
    if (!page) return;

    const content = page.innerHTML;

    const res = await fetch("../layout.html");
    const layoutHTML = await res.text();

    document.body.innerHTML = layoutHTML;

    document.getElementById("page-content").innerHTML = content;

    initLayout();
    initAuth();
});

/* ================= UI ================= */
function initLayout() {

    setInterval(() => {
        const now = new Date();
        document.getElementById("currentDateTime").innerText =
            now.toLocaleString("th-TH");
        document.getElementById("userTime").innerText =
            now.toLocaleTimeString("th-TH");
    }, 1000);

    document.getElementById("logoutBtn").onclick = () => {
        auth.signOut();
    };
}

/* ================= AUTH ================= */
function initAuth() {

    auth.onAuthStateChanged(async user => {

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

/* ================= MENU ================= */
function renderMenu(role) {

    const nav = document.querySelector(".dashboard-nav");
    nav.innerHTML = `<a href="../index.html">🏠 Dashboard</a>`;

    if (role === "user") {
        nav.innerHTML += `<a href="../user/main.html">👤 User</a>`;
    }
    if (role === "supervisor") {
        nav.innerHTML += `<a href="../supervisor/main.html">🧑‍💼 Supervisor</a>`;
    }
    if (role === "admin") {
        nav.innerHTML += `
            <a href="../admin/main.html">🛠 Admin</a>
            <a href="../supervisor/main.html">🧑‍💼 Supervisor</a>
            <a href="../user/main.html">👤 User</a>
        `;
    }
}
