import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export function initLayout(){
  const menuItems = document.querySelectorAll(".menu a");
  const userInfo = document.getElementById("userInfo");
  const logoutBtn = document.getElementById("logoutBtn");

  onAuthStateChanged(auth, async (user)=>{
    if(!user){
      location.href="index.html";
      return;
    }

    const snap = await getDoc(doc(db,"users",user.uid));
    const data = snap.data();
    const role = data.role;

    userInfo.innerText = `${data.fullname} (${role})`;

    menuItems.forEach(menu=>{
      const allow = menu.dataset.role.split(",");
      if(!allow.includes(role)){
        menu.classList.add("hide");
      }
    });
  });

  logoutBtn?.addEventListener("click",()=>{
    signOut(auth).then(()=>location.href="index.html");
  });
}
