import { initializeApp } from "https://www.gstatic.com/firebasejs/9.x/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.x/firebase-firestore.js";

const firebaseConfig = { /* ... config ของคุณ ... */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ฟังก์ชันจำลองการเปลี่ยนหน้า (SPA)
window.navigate = async (page) => {
    const content = document.getElementById('main-content');
    
    switch(page) {
        case 'report':
            content.innerHTML = `
                <h2>แจ้งปัญหาการใช้งาน</h2>
                <div class="card">
                    <label>หัวข้อปัญหา</label>
                    <select id="issue-topic" class="form-control">
                        ${Array.from({length: 10}, (_, i) => `<option>เรื่องที่ ${i+1}</option>`).join('')}
                    </select>
                    <label>Internet No.</label>
                    <input type="text" id="internet-no" placeholder="เช่น 960xxxxxx">
                    <label>รายละเอียด</label>
                    <textarea id="detail"></textarea>
                    <button class="btn-primary">ส่งข้อมูล</button>
                </div>`;
            break;
            
        case 'track':
            content.innerHTML = `<h2>ติดตาม Ticket</h2>
                <input type="text" id="search-net" placeholder="ค้นหาด้วย Internet No.">
                <table class="table">...</table>`;
            break;
            
        case 'dashboard':
            content.innerHTML = `<h2>Dashboard สรุปงาน</h2>
                <div class="grid-3">
                    <div class="card green">Open: 5</div>
                    <div class="card orange">Pending: 2</div>
                    <div class="card grey">Closed: 10</div>
                </div>`;
            break;
        // เพิ่มหน้าอื่นๆ (Admin, User Management) ตามเงื่อนไขเดียวกัน
    }
}

// ระบบ Permission: ดึงข้อมูล Role จาก Firestore แล้วสร้างเมนู
async function loadMenu(userRole) {
    const permDoc = await getDoc(doc(db, "permissions", userRole));
    const allowedMenus = permDoc.data().menus; // เช่น ['report', 'track', 'admin_all']
    
    const menuHtml = allowedMenus.map(m => {
        return `<a href="#" class="nav-item" onclick="navigate('${m.id}')">${m.name}</a>`;
    }).join('');
    
    document.getElementById('dynamic-menu').innerHTML = menuHtml;
}
