import {
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.getElementById("resetBtn").onclick = async () => {

    const email = document.getElementById("email").value;
    const msg   = document.getElementById("msg");

    try {
        await sendPasswordResetEmail(window.auth, email);
        msg.innerText = "📩 ส่งลิงก์ Reset Password แล้ว";
    } catch (err) {
        msg.innerText = err.message;
    }
};
