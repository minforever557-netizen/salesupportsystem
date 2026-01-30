// ===============================
// STEP 1: เก็บ content หน้าเดิม
// ===============================
const pageContent = document.getElementById('page')?.innerHTML || '';

// ===============================
// STEP 2: โหลด layout.html
// ===============================
fetch('../layout.html')
    .then(res => res.text())
    .then(html => {
        // เขียน layout ลง body
        document.body.innerHTML = html;

        // ===============================
        // STEP 3: inject content
        // ===============================
        const contentArea = document.getElementById('pageContent');
        if (contentArea) {
            contentArea.innerHTML = pageContent;
        }

        initLayout();
    })
    .catch(err => console.error('Load layout failed', err));


// ===============================
// INIT LAYOUT
// ===============================
function initLayout() {

    // เวลา (กลางบน + ใต้ email)
    setInterval(() => {
        const now = new Date();

        const dateTime = now.toLocaleString('th-TH', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });

        const time = now.toLocaleTimeString('th-TH');

        const current = document.getElementById('currentDateTime');
        const userTime = document.getElementById('userTime');

        if (current) current.innerText = dateTime;
        if (userTime) userTime.innerText = time;
    }, 1000);

    // Logout (ไว้ผูก Firebase ทีหลัง)
    const logout = document.getElementById('logoutBtn');
    if (logout) {
        logout.onclick = () => {
            alert('logout');
        };
    }
}
