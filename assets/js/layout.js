// โหลด layout.html
fetch('../layout.html')
    .then(res => res.text())
    .then(html => {
        document.body.innerHTML = html;

        // ดึง content ของหน้า
        const page = document.getElementById('page');
        if (page) {
            document.getElementById('pageContent').innerHTML = page.innerHTML;
        }

        initLayout();
    });

function initLayout() {
    // เวลา
    setInterval(() => {
        const now = new Date();
        document.getElementById('currentDateTime').innerText =
            now.toLocaleString('th-TH');
        document.getElementById('userTime').innerText =
            now.toLocaleTimeString('th-TH');
    }, 1000);

    // Logout (ผูก Firebase ภายหลัง)
    const logout = document.getElementById('logoutBtn');
    if (logout) logout.onclick = () => alert('logout');
}
