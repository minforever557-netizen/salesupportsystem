import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ตรวจสอบสถานะการ Login
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.exists() ? userDoc.data() : { role: 'User', name: user.email };
            
            // แก้ไข TypeError: เช็คว่ามี Element ก่อนใส่ชื่อ
            const nameDisplay = document.getElementById('display-name');
            if (nameDisplay) {
                nameDisplay.innerText = userData.name || user.email;
            }

            loadMenu(userData.role);
            navigate('home');
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    } else {
        // ถ้าต้องการให้เด้งไปหน้า login
        // window.location.href = 'login.html';
        console.log("No user logged in");
    }
});

// ระบบเปลี่ยนหน้า (SPA)
window.navigate = async (page) => {
    const content = document.getElementById('main-content');
    if (!content) return;

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
                    <br><label>Internet No.</label>
                    <input type="text" id="internet-no" placeholder="960xxxxxxx">
                    <button class="btn btn-green">ส่งข้อมูล</button>
                </div>`;
            break;
        default:
            content.innerHTML = `<h2>Coming Soon</h2><p>หน้านี้กำลังอยู่ระหว่างการพัฒนา</p>`;
    }
};

// โหลดเมนูตาม Role
async function loadMenu(userRole) {
    const menuDiv = document.getElementById('dynamic-menu');
    if (!menuDiv) return;

    try {
        const permDoc = await getDoc(doc(db, "permissions", userRole));
        if (permDoc.exists()) {
            const allowedMenus = permDoc.data().menus;
            menuDiv.innerHTML = allowedMenus.map(m => `
                <div class="nav-item" onclick="navigate('${m.id}')">
                    <i class="fas ${m.icon || 'fa-circle'}"></i> ${m.name}
                </div>
            `).join('');
        } else {
            // Default Menu ถ้าไม่มีข้อมูลใน Firestore
            menuDiv.innerHTML = `<div class="nav-item" onclick="navigate('report')"><i class="fas fa-paper-plane"></i> แจ้งปัญหา</div>`;
        }
    } catch (e) {
        console.error("Menu load error:", e);
    }
}

window.logout = () => signOut(auth);
