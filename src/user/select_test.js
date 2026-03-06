import { supabase } from "../api/supabase.js";

// --- Helpers ---
function setTestSession(test, isReadOnly) {
    localStorage.setItem("CURRENT_TEST_ID", test.id);
    localStorage.setItem("CURRENT_TOUR_ID", test.tour_id);
    localStorage.setItem("ASSIGNED_LANG", test.language); // overrides user default
    localStorage.setItem("TEST_READ_ONLY", isReadOnly ? "true" : "false");
}

let modalOverlay = null;

function showAppleModal(title, message, onConfirm) {
    if (modalOverlay) {
        modalOverlay.remove();
    }

    modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    modalOverlay.innerHTML = `
        <div class="apple-modal">
            <div class="apple-modal-content">
                <div class="apple-modal-title">${title}</div>
                <div class="apple-modal-message">${message}</div>
            </div>
            <div class="apple-modal-actions">
                <button class="apple-modal-btn cancel" id="modalCancelBtn">Cancel</button>
                <button class="apple-modal-btn confirm" id="modalConfirmBtn">Open</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Trigger reflow for transition
    void modalOverlay.offsetWidth;
    modalOverlay.classList.add('active');

    document.getElementById('modalCancelBtn').addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        setTimeout(() => modalOverlay.remove(), 300);
    });

    document.getElementById('modalConfirmBtn').addEventListener('click', () => {
        onConfirm();
        modalOverlay.classList.remove('active');
        setTimeout(() => modalOverlay.remove(), 300);
    });
}

// --- DOM Rendering ---
const container = document.getElementById("testListContainer");

function renderSkeleton() {
    container.innerHTML = `
        <div class="skeleton-card">
            <div class="test-info" style="width: 60%">
                <div class="skeleton" style="width: 80%; height: 20px; margin-bottom: 8px;"></div>
                <div class="skeleton" style="width: 50%; height: 16px;"></div>
            </div>
            <div class="skeleton" style="width: 70px; height: 24px; border-radius: 12px;"></div>
        </div>
        <div class="skeleton-card" style="opacity: 0.7;">
            <div class="test-info" style="width: 60%">
                <div class="skeleton" style="width: 70%; height: 20px; margin-bottom: 8px;"></div>
                <div class="skeleton" style="width: 40%; height: 16px;"></div>
            </div>
            <div class="skeleton" style="width: 70px; height: 24px; border-radius: 12px;"></div>
        </div>
        <div class="skeleton-card" style="opacity: 0.4;">
            <div class="test-info" style="width: 60%">
                <div class="skeleton" style="width: 90%; height: 20px; margin-bottom: 8px;"></div>
                <div class="skeleton" style="width: 60%; height: 16px;"></div>
            </div>
            <div class="skeleton" style="width: 70px; height: 24px; border-radius: 12px;"></div>
        </div>
    `;
}

function renderError(message) {
    container.innerHTML = `
        <div class="error-view fade-in">
            <span class="material-icons">error_outline</span>
            <div style="font-size: 17px; font-weight: 600; color: #fff;">Unable to load</div>
            <p>${message}</p>
        </div>
    `;
}

function renderEmpty() {
    container.innerHTML = `
        <div class="error-view fade-in" style="color: #8e8e93;">
            <span class="material-icons">info</span>
            <div style="font-size: 17px; font-weight: 600; color: #fff;">All Caught Up!</div>
            <p>No test sheets assigned to you currently.</p>
        </div>
    `;
}

async function renderTestCards(tests) {
    container.innerHTML = "";

    // 1. Fetch total images count per tour involved in tests
    const tourIds = [...new Set(tests.map(t => t.tour_id))];
    const { data: tourCounts } = await supabase
        .from('images')
        .select('tour_id, id')
        .in('tour_id', tourIds);

    const tourTotalMap = {};
    tourCounts?.forEach(img => {
        tourTotalMap[img.tour_id] = (tourTotalMap[img.tour_id] || 0) + 1;
    });

    // 2. Fetch completed images count per test
    const testIds = tests.map(t => t.id);
    const { data: progressData } = await supabase
        .from('user_progress')
        .select('test_id')
        .in('test_id', testIds)
        .eq('is_completed', true);

    const testCompletedMap = {};
    progressData?.forEach(row => {
        testCompletedMap[row.test_id] = (testCompletedMap[row.test_id] || 0) + 1;
    });

    tests.forEach((test, index) => {
        const total = tourTotalMap[test.tour_id] || 0;
        const completed = testCompletedMap[test.id] || 0;
        const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
        const isCompleted = !!test.completed_at || progressPercent === 100;

        // Calculate D-Day
        let dDayText = "";
        let isUrgent = false;
        if (test.due_date) {
            const now = new Date();
            const due = new Date(test.due_date);
            const diffMs = due - now;
            const diffHours = diffMs / (1000 * 60 * 60);

            if (diffMs <= 0) {
                dDayText = "Overdue";
                isUrgent = true;
            } else if (diffHours < 24) {
                const h = Math.floor(diffHours);
                dDayText = `${h}h left`;
                isUrgent = true;
            } else {
                const d = Math.ceil(diffHours / 24);
                dDayText = `D-${d}`;
                if (d <= 2) isUrgent = true;
            }
        }

        const card = document.createElement("div");
        card.className = `test-card fade-in ${isCompleted ? 'completed' : ''}`;
        card.style.animationDelay = `${index * 0.05}s`;

        card.innerHTML = `
            <div class="test-card-top">
                <div class="test-info">
                    <span class="tour-title">Tour ID: ${test.tour_id}</span>
                    <span class="tour-lang">${test.language.toUpperCase()}</span>
                </div>
                <div class="card-actions">
                    ${dDayText ? `<span class="dday-badge ${isUrgent ? 'urgent' : ''}">${dDayText}</span>` : ''}
                    ${isCompleted ? '<span class="material-icons check-icon">check_circle</span>' :
                `<span class="status-badge progress">In Progress</span>`}
                </div>
            </div>
            
            <div class="mini-progress-container">
                <div class="mini-progress-info">
                    <span>${progressPercent}% Complete</span>
                    <span>${completed} / ${total} Images</span>
                </div>
                <div class="mini-progress-bar-bg">
                    <div class="mini-progress-bar-fill" style="width: ${progressPercent}%"></div>
                </div>
            </div>
        `;

        card.addEventListener("click", () => {
            if (isCompleted) {
                showAppleModal(
                    "Review Completed",
                    "This test is finished. You can view your results, but editing is disabled.",
                    () => {
                        setTestSession(test, true);
                        window.location.href = "./work.html";
                    }
                );
            } else {
                setTestSession(test, false);
                window.location.href = "./work.html";
            }
        });

        container.appendChild(card);
    });
}

// --- Data Fetching ---
async function fetchTests(userCode) {
    renderSkeleton(); // Show Skeleton UI

    try {
        const { data: tests, error } = await supabase
            .from("tests")
            .select("*")
            .eq("user_code", userCode)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Failed to load tests:", error);
            renderError("We couldn't retrieve your test sheets right now. Please try again later.");
            return;
        }

        if (!tests || tests.length === 0) {
            renderEmpty();
            return;
        }

        // Slight artificial delay to make the skeleton animation feel premium 
        // before fading in actual data (optional but good for UX)
        setTimeout(() => {
            renderTestCards(tests);
        }, 300);

    } catch (e) {
        console.error("Frontend loading error:", e);
        renderError("A network error occurred.");
    }
}

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    const userCode = localStorage.getItem("USER_CODE");

    if (!userCode) {
        window.location.href = "./../auth/login.html";
        return;
    }

    const headerUserId = document.getElementById("headerUserId");
    if (headerUserId) headerUserId.textContent = userCode;

    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "./../auth/login.html";
        });
    }

    // Start data fetch
    fetchTests(userCode);
});
