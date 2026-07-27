/* ==========================================================================
   API CONFIG — single source of truth for the backend's base URL.
   Classic script (not a module) so both classic scripts (login.js) and
   ES modules (assets/data/*.js, which read window.API_BASE_URL directly)
   can use the same value. Matches backend/server.js's PORT (default 5000,
   see backend/.env.example) — change this if your backend runs elsewhere.
   ========================================================================== */
window.API_BASE_URL = 'http://localhost:5000';
