// login.js – Handles user login, fetches assigned language, and stores session globals
// ---------------------------------------------------------------
// IMPORTANT: Replace the placeholder values for SUPABASE_URL and SUPABASE_ANON_KEY
// with the actual credentials from your .env file before deploying.
// ---------------------------------------------------------------
import { supabase } from "../api/supabase.js";

// Utility: simple toast wrapper (uses toast.js if present)
function triggerErrorShake() {
    const wrapper = document.getElementById("loginWrapper");
    if (wrapper) {
        wrapper.classList.remove("shake");
        // Trigger reflow
        void wrapper.offsetWidth;
        wrapper.classList.add("shake");
    }
}

function showError(message) {
    triggerErrorShake();
    if (window.showToast) {
        window.showToast(message, "error");
    } else {
        alert(message);
    }
}

function showSuccess(message) {
    if (window.showToast) {
        window.showToast(message, "success");
    } else {
        // alert(message); // Skip alert on success to look cleaner
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const userCodeInput = document.getElementById("userCode");
        const userCode = userCodeInput.value.trim();
        if (!userCode) {
            showError("Please enter your User Code.");
            return;
        }

        // Query Supabase for the user record (assume role may not exist yet, fallback to 'user')
        const { data, error } = await supabase
            .from("users")
            // Attempt to select role if it exists, but might fail if column not added yet,
            // so we handle it gracefully by just requesting it.
            // But wait, if column doesn't exist, it errors out entirely.
            // Let's just fetch existing columns, and resolve role by userCode for now.
            .select("assigned_lang, completed_images, daily_goal")
            .eq("user_code", userCode)
            .single();

        if (error || !data) {
            console.error("Login error:", error);
            showError("User Code not found or an error occurred.");
            return;
        }

        // Determine Role
        // If a real 'role' column is added later, you can replace this logic.
        const userRole = (userCode.toLowerCase() === 'admin') ? 'admin' : 'user';

        // Store session globals – accessible from other modules
        window.USER_CODE = userCode;
        window.ASSIGNED_LANG = data.assigned_lang;
        window.USER_ROLE = userRole;

        // Optionally persist in localStorage for page reloads
        localStorage.setItem("USER_CODE", userCode);
        localStorage.setItem("ASSIGNED_LANG", data.assigned_lang);
        localStorage.setItem("USER_ROLE", userRole);

        showSuccess(`Login successful!`);

        // Redirect based on role
        setTimeout(() => {
            if (userRole === 'admin') {
                window.location.href = "../admin/dashboard.html";
            } else {
                window.location.href = "../user/select_test.html";
            }
        }, 1200);
    });
});
