<script type="module">
import { auth } from "/salesupportsystem/assets/js/firebase.js";
import {
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("sendResetBtn");
    const msg = document.getElementById("msg");

    btn.addEventListener("click", async (e) => {
        e.preventDefault(); // 🔑 สำคัญมาก (กันปุ่มเงียบ)

        const email = document.getElementById("email").value.trim();

        if (!email) {
            msg.innerText = "⚠️ กรุณากรอก Email";
            msg.style.color = "#dc2626";
            return;
        }

        btn.disabled = true;
        msg.innerText = "⏳ กำลังส่งลิงก์รีเซ็ตรหัสผ่าน...";

        try {
            await sendPasswordResetEmail(auth, email);

            msg.style.color = "#16a34a";
            msg.innerHTML = `
                ✅ ส่งลิงก์เรียบร้อยแล้ว<br>
                📩 กรุณาตรวจสอบ <b>Inbox</b><br>
                ⚠️ หากไม่พบ ให้ตรวจสอบใน <b>Junk / Spam</b>
            `;

        } catch (err) {
            console.error(err);

            let text = "❌ เกิดข้อผิดพลาด";

            switch (err.code) {
                case "auth/user-not-found":
                    text = "❌ ไม่พบ Email นี้ในระบบ";
                    break;
                case "auth/invalid-email":
                    text = "❌ รูปแบบ Email ไม่ถูกต้อง";
                    break;
                case "auth/too-many-requests":
                    text = "⚠️ ลองหลายครั้งเกินไป กรุณารอสักครู่";
                    break;
            }

            msg.style.color = "#dc2626";
            msg.innerText = text;
        }

        btn.disabled = false;
    });
});
</script>
