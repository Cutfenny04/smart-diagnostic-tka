/* ==========================================================================
   SMART DIAGNOSTIC TKA — SHARED SHELL BEHAVIOR
   Loads sidebar/topbar fragments, then wires sidebar collapse (persisted),
   mobile drawer, active-nav state, and topbar dropdowns.
   Runs on every page that includes the app-shell.
   ========================================================================== */
(function () {
    'use strict';

    var SIDEBAR_STORAGE_KEY = 'sdtka:sidebarCollapsed';

    // Placeholder until backend/auth integration replaces it.
    window.SDTKA = window.SDTKA || {
        currentUser: {
            name: 'Guru',
            role: 'Guru IPA',
            avatarInitial: 'G'
        }
    };

    function fetchInclude(name) {
        return fetch('components/' + name + '.html').then(function (res) {
            if (!res.ok) {
                throw new Error('Gagal memuat komponen: ' + name);
            }
            return res.text();
        });
    }

    function loadIncludes() {
        var targets = Array.prototype.slice.call(document.querySelectorAll('[data-include]'));
        return Promise.all(
            targets.map(function (el) {
                var name = el.getAttribute('data-include');
                return fetchInclude(name).then(function (html) {
                    el.innerHTML = html;
                });
            })
        );
    }

    function initSidebarCollapse() {
        var shell = document.querySelector('.app-shell');
        var btn = document.getElementById('sidebarCollapseBtn');
        if (!shell || !btn) return;

        function setCollapsed(value) {
            shell.classList.toggle('is-sidebar-collapsed', value);
            btn.setAttribute('aria-pressed', String(value));
        }

        setCollapsed(localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true');

        btn.addEventListener('click', function () {
            var next = !shell.classList.contains('is-sidebar-collapsed');
            setCollapsed(next);
            localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
        });
    }

    function initMobileDrawer() {
        var shell = document.querySelector('.app-shell');
        var menuBtn = document.getElementById('sidebarDrawerBtn');
        var overlay = document.querySelector('.sidebar-overlay');
        if (!shell || !menuBtn || !overlay) return;

        function closeDrawer() {
            shell.classList.remove('is-sidebar-open');
            menuBtn.setAttribute('aria-expanded', 'false');
        }

        function openDrawer() {
            shell.classList.add('is-sidebar-open');
            menuBtn.setAttribute('aria-expanded', 'true');
        }

        menuBtn.addEventListener('click', function () {
            if (shell.classList.contains('is-sidebar-open')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });

        overlay.addEventListener('click', closeDrawer);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeDrawer();
        });
    }

    function initActiveNav() {
        var currentPage = document.body.getAttribute('data-page');
        if (!currentPage) return;

        var links = document.querySelectorAll('.sidebar__link[data-page]');
        links.forEach(function (link) {
            if (link.getAttribute('data-page') === currentPage) {
                link.classList.add('is-active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    function initDropdown(btnId, menuId) {
        var btn = document.getElementById(btnId);
        var menu = document.getElementById(menuId);
        if (!btn || !menu) return;

        function close() {
            menu.hidden = true;
            btn.setAttribute('aria-expanded', 'false');
        }

        function toggle(e) {
            e.stopPropagation();
            var willOpen = menu.hidden;
            document.querySelectorAll('[role="menu"]').forEach(function (m) {
                m.hidden = true;
            });
            menu.hidden = !willOpen;
            btn.setAttribute('aria-expanded', String(willOpen));
        }

        btn.addEventListener('click', toggle);

        document.addEventListener('click', function (e) {
            if (!menu.hidden && !menu.contains(e.target) && e.target !== btn) {
                close();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') close();
        });
    }

    function initProfileData() {
        var nameEl = document.getElementById('profileName');
        var avatarEl = document.getElementById('profileAvatar');
        if (nameEl) nameEl.textContent = window.SDTKA.currentUser.name;
        if (avatarEl) avatarEl.textContent = window.SDTKA.currentUser.avatarInitial;
    }

    function initIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        loadIncludes()
            .then(function () {
                initSidebarCollapse();
                initMobileDrawer();
                initActiveNav();
                initDropdown('notifBtn', 'notifPanel');
                initDropdown('profileBtn', 'profileMenu');
                initProfileData();
                initIcons();
            })
            .catch(function (err) {
                console.error(err);
            })
            .finally(function () {
                document.body.classList.add('loaded');
            });
    });
})();
