import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCsUhBsWjZfQuJo5lgprYt3xikQUyf8iiw",
    authDomain: "sale-support-system.firebaseapp.com",
    projectId: "sale-support-system",
    storageBucket: "sale-support-system.firebasestorage.app",
    messagingSenderId: "640337786680",
    appId: "1:640337786680:web:fd80699ac291b8d7a7b3cd"
};

const fApp = initializeApp(firebaseConfig);
const auth = getAuth(fApp);
const db = getFirestore(fApp);

window.app = {
    async login() {
        const e = document.getElementById('login-email')?.value;
        const p = document.getElementById('login-pass')?.value;
        if (!e || !p) return alert("กรุณากรอกข้อมูล");
        try { await signInWithEmailAndPassword(auth, e, p); } 
        catch (err) { alert("Login Fail: " + err.message); }
    },

    async register() {
        const name = document.getElementById('reg-name').value;
        const e = document.getElementById('reg-email').value;
        const p = document.getElementById('reg-pass').value;
        try {
            const res = await createUserWithEmailAndPassword(auth, e, p);
            await setDoc(doc(db, "users", res.user.uid), { 
                name, email: e, role: "users", status: "active" 
            });
            alert("สมัครสำเร็จ!"); window.location.reload();
        } catch (err) { alert(err.message); }
    },

    showRegister() {
        const form = document.getElementById('auth-form-content');
        if (form) {
            form.innerHTML = `
                <input type="text" id="reg-name" placeholder="ชื่อ-นามสกุล">
                <input type="email" id="reg-email" placeholder="Email">
                <input type="password" id="reg-pass" placeholder="Password (6 ตัวขึ้นไป)">
                <button class="btn btn-green" onclick="app.register()">ยืนยันสมัครสมาชิก</button>
                <p onclick="window.location.reload()" style="cursor:pointer; font-size:0.8rem; margin-top:10px;">กลับไปหน้า Login</p>
            `;
        }
    },

    async resetPassword() {
        const email = prompt("กรอก Email ที่ใช้สมัคร:");
        if (email) {
            try {
                await sendPasswordResetEmail(auth, email);
                alert("ส่งลิงก์รีเซ็ตไปที่ Email แล้วครับ");
            } catch (err) { alert(err.message); }
        }
    },

    logout() { signOut(auth).then(() => window.location.reload()); },

    async loadMenu(role) {
        const menuBox = document.getElementById('dynamic-menu');
        if (!menuBox) return;
        try {
            const roleKey = role ? role.toLowerCase() : 'users';
            const permDoc = await getDoc(doc(db, "permission", roleKey));
            
            if (permDoc.exists()) {
                const menuData = {
                    'report': { name: 'แจ้งปัญหา', icon: 'fa-paper-plane' },
                    'track': { name: 'ติดตาม Ticket', icon: 'fa-magnifying-glass' },
                    'close': { name: 'ปิด Ticket', icon: 'fa-circle-check' },
                    'admin_all': { name: 'รวมงาน Admin', icon: 'fa-list-check' },
                    'dashboard_main': { name: 'Dashboard', icon: 'fa-chart-pie' },
                    'user_mgmt': { name: 'จัดการ User', icon: 'fa-users-gear' }
                };
                menuBox.innerHTML = permDoc.data().menus.map(id => {
                    const item = menuData[id];
                    return item ? `<div class="nav-item" onclick="app.navigate('${id}')"><i class="fas ${item.icon}"></i> ${item.name}</div>` : '';
                }).join('');
            }
        } catch (err) { console.error("Menu Error:", err); }
    },

    navigate(pageId) {
        const content = document.getElementById('main-content');
        if (!content) return;
        content.innerHTML = this.views[pageId] || this.views['home'];
        
        // Active class toggle
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.toggle('active', el.innerText.includes(pageId));
        });
    },

    views: {
        'home': `<h2>ยินดีต้อนรับ</h2><div class="card">เลือกเมนูทางซ้ายเพื่อเริ่มงาน</div>`,
        'report': `<h2>แจ้งปัญหา</h2><div class="card"><input placeholder="ระบุเลข Internet"><textarea placeholder="อาการเสีย" style="width:100%; padding:10px; border-radius:10px;"></textarea><button class="btn btn-green">ส่ง Ticket</button></div>`
    }
};

onAuthStateChanged(auth, async (user) => {
    const authPage = document.getElementById('auth-page');
    const userDisplay = document.getElementById('display-user');
    
    if (user) {
        if (authPage) authPage.style.display = 'none';
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const data = userDoc.exists() ? userDoc.data() : { role: 'users', name: user.email };
        
        if (userDisplay) userDisplay.innerText = data.name || user.email;
        app.loadMenu(data.role);
        app.navigate('home');
    } else {
        if (authPage) authPage.style.display = 'flex';
    }
});
