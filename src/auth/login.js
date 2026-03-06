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
    const userCodeInput = document.getElementById("userCode");
    if (!form || !userCodeInput) return;

    // Explicitly handle Enter key for mobile virtual keyboards
    userCodeInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            form.requestSubmit();
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const userCodeInput = document.getElementById("userCode");
        const userCode = userCodeInput.value.trim();
        if (!userCode) {
            showError("Please enter your User Code.");
            return;
        }

        // Query Supabase for the user record
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("user_code", userCode)
            .maybeSingle(); // maybeSingle is safer than single() for non-existent records

        if (error) {
            console.error("Supabase Login Error Details:", {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            showError(`Login error: ${error.message}`);
            return;
        }

        if (!data) {
            showError("User Code not found. Please check and try again.");
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
                window.location.href = "./../admin/dashboard.html";
            } else {
                window.location.href = "./../user/select_test.html";
            }
        }, 1200);
    });
});
