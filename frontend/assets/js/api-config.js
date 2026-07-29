/* ==========================================================================
   API CONFIG — single source of truth for the backend's base URL.
   Classic script (not a module) so both classic scripts (login.js) and
   ES modules (assets/data/*.js, which read window.API_BASE_URL directly)
   can use the same value. Matches backend/server.js's PORT (default 5000,
   see backend/.env.example) — change this if your backend runs elsewhere.

   Auto-picks localhost while developing; on any other host (Railway, etc.)
   it uses PRODUCTION_API_BASE_URL below — set that to your deployed
   backend's public URL once it exists.
   ========================================================================== */
(function () {
    var PRODUCTION_API_BASE_URL = 'https://resilient-manifestation-production-6f44.up.railway.app';
    var isLocal = ['localhost', '127.0.0.1'].indexOf(window.location.hostname) !== -1;
    window.API_BASE_URL = isLocal ? 'http://localhost:5000' : PRODUCTION_API_BASE_URL;
})();
