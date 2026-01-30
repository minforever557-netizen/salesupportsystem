// โหลด layout.html แล้วฝังเข้า body
fetch('../layout.html')
  .then(res => res.text())
  .then(html => {
    document.body.innerHTML = html;

    // ดึงเนื้อหาของหน้าเดิม
    const page = document.getElementById('page');
    if (page) {
      document.getElementById('pageContent').innerHTML = page.innerHTML;
    }

    initLayout();
  });

function initLayout() {
  // เวลา + วันที่
  setInterval(() => {
    const now = new Date();
    document.getElementById('currentDateTime').innerText =
      now.toLocaleString('th-TH');

    document.getElementById('userTime').innerText =
      now.toLocaleTimeString('th-TH');
  }, 1000);

  // Logout (ผูก Firebase ทีหลังได้)
  document.getElementById('logoutBtn').onclick = () => {
    alert('Logout');
  };

  // mock user
  document.getElementById('userName').innerText = 'Demo User';
  document.getElementById('userEmail').innerText = 'demo@email.com';
}
