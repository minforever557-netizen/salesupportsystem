<script type="module">
import { auth } from "/salesupportsystem/assets/js/firebase.js";
import {
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("resetBtn");
    const emailInput = document.getElementById("email");
    const msg = document.getElementById("msg");

    btn.addEventListener("click", async () => {

        const email = emailInput.value.trim();

        if (!email) {
            msg.style.color = "red";
            msg.innerText = "⚠️ กรุณากรอก Email";
            return;
        }

        btn.disabled = true;
        msg.style.color = "#333";
        msg.innerText = "⏳ กำลังส่งลิงก์รีเซ็ตรหัสผ่าน...";

        try {
            await sendPasswordResetEmail(auth, email);

            msg.style.color = "green";
            msg.innerText = 
`✅ ระบบได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่แล้ว
📩 กรุณาตรวจสอบที่ Email ของคุณ
📌 หากไม่พบ กรุณาเช็กโฟลเดอร์ Junk หรือ Spam`;

            // (ไม่ redirect บังคับ ปล่อยให้ user อ่าน)
            // setTimeout(() => location.href = "index.html", 5000);

        } catch (err) {
            console.error(err);

            msg.style.color = "red";
            msg.innerText =
`❌ ไม่สามารถส่งลิงก์ได้
กรุณาตรวจสอบรูปแบบ Email แล้วลองใหม่`;
        } finally {
            btn.disabled = false;
        }
    });
});
</script>
