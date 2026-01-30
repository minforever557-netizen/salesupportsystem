import { auth } from "./firebase.js";
import { sendPasswordResetEmail }
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.getElementById("resetBtn").onclick = async () => {

    try {
        await sendPasswordResetEmail(auth,
            document.getElementById("email").value
        );

        document.getElementById("msg").innerText =
            "📩 ส่ง Email Reset แล้ว";

    } catch (err) {
        document.getElementById("msg").innerText = err.message;
    }
};
