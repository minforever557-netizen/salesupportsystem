import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =========================
   MENU CONFIG (แก้ที่เดียว)
========================= */
const MENU = [
  { label:"🏠 Home", href:"home.html", roles:["Admin","Supervisor","User"] },
  { label:"➕ แจ้งปัญหา", href:"ticket-create.html", roles:["Admin","Supervisor","User"] },
  { label:"🎫 Ticket ของฉัน", href:"ticket-my.html", roles:["Admin","Supervisor","User"] },
  { label:"📊 Dashboard", href:"dashboard.html", roles:["Admin","Supervisor"] },

  // Admin
  { label:"🛠 งานทั้งหมด", href:"admin-all.html", roles:["Admin"] },
  { label:"⚙️ Ticket Management", href:"ticket-master.html", roles:["Admin"] },
  { label:"👥 User Management", href:"user-management.html", roles:["Admin"] },
  { label:"🔐 Permission", href:"permission.html", roles:["Admin"] },
];

/* =========================
   RENDER LAYOUT
========================= */
function renderLayout(user, role){
  const menuHTML = MENU
    .filter(m => m.roles.includes(role))
    .map(m => `<a href="${m.href}">${m.label}</a>`)
    .join("");

  document.getElementById("app").innerHTML = `
  <div class="app">
    <div class="sidebar">
      <div class="logo">📞 Sale Support</div>
      ${menuHTML}
      <div class="bottom">
        <a href="#" id="logoutBtn">🚪 Logout</a>
      </div>
    </div>

    <div class="main">
      <div class="topbar">
        <div>Sale Support System</div>
        <div class="user">
          ${user.email} 🔔
        </div>
      </div>

      <div class="content" id="pageContent"></div>
    </div>
  </div>
  `;

  document.getElementById("logoutBtn").onclick = () => {
    signOut(auth).then(()=>location.href="index.html");
  };
}

/* =========================
   AUTH + ROLE
========================= */
onAuthStateChanged(auth, async user=>{
  if(!user){
    location.href="index.html";
    return;
  }

  // users/{uid}.role
  const snap = await getDoc(doc(db,"users",user.uid));
  const role = snap.exists() ? snap.data().role : "User";

  renderLayout(user, role);
});
