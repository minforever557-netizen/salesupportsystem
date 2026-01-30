import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
    doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.getElementById("registerBtn").onclick = async () => {

    const email = document.getElementById("email").value;
    const pass  = document.getElementById("password").value;
    const role  = document.getElementById("role").value;
    const msg   = document.getElementById("msg");

    try {
        const cred = await createUserWithEmailAndPassword(
            window.auth,
            email,
            pass
        );

        await setDoc(
            doc(window.db, "users", cred.user.uid),
            {
                email,
                role,
                createdAt: new Date()
            }
        );

        msg.innerText = "✅ Register สำเร็จ";
        setTimeout(() => location.href = "index.html", 1000);

    } catch (err) {
        msg.innerText = err.message;
    }
};
