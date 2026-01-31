import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ================= 1. ตรวจสอบสถานะ LOGIN =================
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // เมื่อ Login สำเร็จ: ดึงข้อมูล User และ Role
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data() || { role: 'User', name: 'Unknown' };
        
        // แสดงชื่อบน Topbar
        document.getElementById('display-name').innerText = userData.name || user.email;
        
        // โหลดเมนูตามสิทธิ์ (Role)
        loadMenu(userData.role);
        
        // พาไปหน้า Home เป็นหน้าแรก
        navigate('home');
    } else {
        // ถ้าไม่ได้ Login ให้เด้งไปหน้า Login (ถ้าทำหน้าแยก)
        // window.location.href = 'login.html'; 
    }
});

// ================= 2. ฟังก์ชันเปลี่ยนหน้า (SPA) =================
// ใช้ window. เพื่อให้ HTML เรียกใช้งาน function ได้
window.navigate = async (page) => {
    const content = document.getElementById('main-content');
    
    // แสดง Loading สั้นๆ เพื่อความสวยงาม
    content.innerHTML = '<p>กำลังโหลด...</p>';

    switch(page) {
        case 'home':
            content.innerHTML = `<h2>หน้าแรก</h2><p>ยินดีต้อนรับสู่ระบบ Sale Support</p>`;
            break;

        case 'report':
            content.innerHTML = `
                <h2>แจ้งปัญหาการใช้งาน</h2>
                <div class="card">
                    <label>หัวข้อปัญหา</label>
                    <select id="issue-topic">
                        ${Array.from({length: 10}, (_, i) => `<option>เรื่องที่ ${i+1}</option>`).join('')}
                    </select>
                    <label>Internet No.</label>
                    <input type="text" id="internet-no" placeholder="960xxxxxxx">
                    <label>รายละเอียด</label>
                    <textarea id="detail" rows="4"></textarea>
                    <button class="btn btn-green" onclick="submitTicket()">ส่งข้อมูล</button>
                </div>`;
            break;

        case 'close_ticket': // หน้าที่ 3: ปิดงาน (เฉพาะ Open/Pending)
            renderCloseTicketPage(content);
            break;

        // ... เพิ่ม case หน้าอื่นๆ 4-9 ตามเงื่อนไขเดียวกัน ...
    }
}

// ================= 3. ระบบ Permission & Menu =================
async function loadMenu(userRole) {
    const permDoc = await getDoc(doc(db, "permissions", userRole));
    
    // ป้องกัน Error กรณีไม่มีข้อมูลใน Firestore
    const allowedMenus = permDoc.exists() ? permDoc.data().menus : [
        {id: 'home', name: 'Home', icon: 'fa-home'},
        {id: 'report', name: 'แจ้งปัญหา', icon: 'fa-paper-plane'}
    ];
    
    const menuHtml = allowedMenus.map(m => `
        <div class="nav-item" onclick="navigate('${m.id}')">
            <i class="fa-solid ${m.icon || 'fa-circle'}"></i> ${m.name}
        </div>
    `).join('');
    
    document.getElementById('dynamic-menu').innerHTML = menuHtml;
}

// ================= 4. ฟังก์ชันเสริม (ตัวอย่างการดึงงานมาปิด) =================
async function renderCloseTicketPage(container) {
    const q = query(collection(db, "tickets"), where("status", "in", ["Open", "Pending"]));
    const snapshot = await getDocs(q);
    
    let html = `<h2>ปิด Ticket งาน</h2><div class="card"><table>
                <tr><th>No.</th><th>หัวข้อ</th><th>สถานะ</th><th>จัดการ</th></tr>`;
    
    snapshot.forEach(doc => {
        const data = doc.data();
        html += `<tr>
            <td>${data.internetNo}</td>
            <td>${data.topic}</td>
            <td><span class="badge">${data.status}</span></td>
            <td><button class="btn btn-orange" onclick="updateStatus('${doc.id}')">ปิดงาน</button></td>
        </tr>`;
    });
    
    html += `</table></div>`;
    container.innerHTML = html;
}

window.logout = () => signOut(auth);
