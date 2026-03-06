// dashboard.js – Real‑time monitoring using Supabase Realtime
import { supabase } from "../api/supabase.js";

// Elements
const activeUsersList = document.getElementById('activeUsersList');
const avgTimeEl = document.getElementById('avgTime');

// Subscribe to realtime changes on review_sessions
supabase
    .channel('public:review_sessions')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'review_sessions' }, () => {
        refreshDashboard();
    })
    .subscribe();

// Elements update helper
async function refreshDashboard() {
    const users = await fetchActiveUsers();
    renderActiveUsers(users);
    await fetchAvgDuration();
}

// Helper to render active users
function renderActiveUsers(users) {
    activeUsersList.innerHTML = '';
    if (!users.length) {
        activeUsersList.innerHTML = '<li>진행 중인 작업 없음</li>';
        return;
    }
    users.forEach(u => {
        const li = document.createElement('li');
        li.textContent = `${u.user_code} (${u.assigned_lang})`;
        activeUsersList.appendChild(li);
    });
}

// Fetch currently active users (those with review_sessions in the last 15 mins with null end_timestamp)
async function fetchActiveUsers() {
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { data, error } = await supabase
        .from('review_sessions')
        .select('user_code, users(assigned_lang)')
        .is('end_timestamp', null)
        .gt('start_timestamp', fifteenMinsAgo);

    if (error) {
        console.error('Error fetching active users:', error);
        return [];
    }

    const uniqueList = data.filter(r => r.users).map(r => ({
        user_code: r.user_code,
        assigned_lang: r.users.assigned_lang
    }));

    return uniqueList;
}

// Fetch recent completed logs to compute average duration
async function fetchAvgDuration() {
    const { data, error } = await supabase
        .from('review_sessions')
        .select('duration_sec')
        .not('duration_sec', 'is', null)
        .order('end_timestamp', { ascending: false })
        .limit(50);

    if (error) {
        console.error('Error fetching logs:', error);
        avgTimeEl.textContent = '-';
        return;
    }

    if (!data.length) {
        avgTimeEl.textContent = '-';
        return;
    }

    const total = data.reduce((sum, l) => sum + (l.duration_sec || 0), 0);
    const avg = Math.round(total / data.length);
    avgTimeEl.textContent = `${avg} sec`;
}

// Initial load
refreshDashboard();
