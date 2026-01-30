document.addEventListener("DOMContentLoaded", async () => {

    // 🔹 1. เก็บเนื้อหาหน้าเดิม
    const pageContentEl = document.getElementById("page-content");
    if (!pageContentEl) {
        console.warn("ไม่พบ #page-content → ไม่ inject layout");
        return;
    }
    const pageHTML = pageContentEl.innerHTML;

    // 🔹 2. โหลด layout.html
    const res = await fetch("/salesupportsystem/layout.html");
    const layoutHTML = await res.text();

    // 🔹 3. เขียน layout ลง body
    document.body.innerHTML = layoutHTML;

    // 🔹 4. ใส่เนื้อหากลับ
    const target = document.getElementById("page-content");
    if (target) {
        target.innerHTML = pageHTML;
    }

    // 🔹 5. init หลัง DOM พร้อม
    initLayout();
});

function initLayout() {

    // ===== วันที่ / เวลา =====
    const dateEl = document.getElementById("currentDateTime");
    const timeEl = document.getElementById("userTime");

    setInterval(() => {
        const now = new Date();
        if (dateEl) dateEl.innerText = now.toLocaleString("th-TH");
        if (timeEl) timeEl.innerText = now.toLocaleTimeString("th-TH");
    }, 1000);

    // ===== Logout =====
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            alert("Logout (ผูก Firebase ภายหลัง)");
        };
    }

    // ===== Mock User (เอาออกตอนต่อ Firebase) =====
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");

    if (userName) userName.innerText = "Demo User";
    if (userEmail) userEmail.innerText = "demo@email.com";
}
