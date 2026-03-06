// supabase.js – Single source of truth for Supabase initialization
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// --- CONFIGURATION ---
// Attempts to load from environment variables (Vite-style or Node-style)
const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL)
    || (typeof process !== 'undefined' && process.env?.SUPABASE_URL)
    || "";

const SUPABASE_ANON_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY)
    || (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY)
    || "";

// Guard: Warning if variables are missing
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("⚠️ [Supabase] Environment variables (SUPABASE_URL/ANON_KEY) are missing! Please check your .env file.");
}

// Initialize and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
