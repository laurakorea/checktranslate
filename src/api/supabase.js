// supabase.js – Single source of truth for Supabase initialization
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// --- CONFIGURATION ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Guard: Warning if variables are missing
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("⚠️ [Supabase] Environment variables (VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY) are missing in .env!");
}

// Initialize and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
