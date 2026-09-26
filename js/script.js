
/* ============================================================
   MODULE 1: STORAGE
   ============================================================ */
const Storage = (() => {
    const KEYS = {
        USERS: 'furni_users', SESSION: 'furni_session', ATTEMPTS: 'furni_login_attempts',
        CART: 'furni_cart', WISHLIST: 'furni_wishlist', PRODUCTS: 'furni_products_v3',
        THEME: 'furni_theme',
        POINTS: (e) => `furni_points_${e}`, ORDERS: (e) => `furni_orders_${e}`,
    };
    function safeGet(key, fallback = null) {
        try { const raw = localStorage.getItem(key); if (raw === null) return fallback; return JSON.parse(raw); }
        catch (err) { try { localStorage.removeItem(key); } catch (_) {} return fallback; }
    }
    function safeSet(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (err) { return false; } }
    function safeRemove(key) { try { localStorage.removeItem(key); } catch (_) {} }
    return {
        KEYS, safeGet, safeSet, safeRemove,
        getUsers: () => { const u = safeGet(KEYS.USERS, []); return Array.isArray(u) ? u : []; },
        setUsers: (u) => safeSet(KEYS.USERS, Array.isArray(u) ? u : []),
        getSession: () => { const s = safeGet(KEYS.SESSION, null); if (!s || typeof s !== 'object') return null; if (!s.id || !s.email || !s.role) return null; return s; },
        setSession: (s) => safeSet(KEYS.SESSION, s),
        clearSession: () => safeRemove(KEYS.SESSION),
        getAttempts: () => safeGet(KEYS.ATTEMPTS, { count: 0, lockedUntil: 0 }),
        setAttempts: (a) => safeSet(KEYS.ATTEMPTS, a),
        clearAttempts: () => safeRemove(KEYS.ATTEMPTS),
    };
})();

/* ============================================================
   MODULE 2: CRYPTO
   ============================================================ */
const CryptoUtil = (() => {
    async function hashPassword(pw) {
        const data = new TextEncoder().encode(pw + 'furnicraft_demo_salt_v1');
        const buf = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    async function verifyPassword(pw, hash) { return (await hashPassword(pw)) === hash; }
    return { hashPassword, verifyPassword };
})();

/* ============================================================
   MODULE 3: VALIDATION
   ============================================================ */
const Validation = (() => {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONE_REGEX = /^[+]?[\d\s().-]{7,20}$/;
    function validateLogin({ email, password }) {
        const errors = {};
        if (!email || !email.trim()) errors.email = 'Email is required.';
        else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Please enter a valid email address.';
        if (!password) errors.password = 'Password is required.';
        return { isValid: Object.keys(errors).length === 0, errors };
    }
    function validateSignup({ name, email, phone, password, confirmPassword, terms }) {
        const errors = {};
        if (!name || !name.trim()) errors.name = 'Full name is required.';
        else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
        if (!email || !email.trim()) errors.email = 'Email is required.';
        else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Please enter a valid email address.';
        if (!phone || !phone.trim()) errors.phone = 'Phone number is required.';
        else if (!PHONE_REGEX.test(phone.trim())) errors.phone = 'Please enter a valid phone number.';
        if (!password) errors.password = 'Password is required.';
        else if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
        else if (!/[A-Z]/.test(password)) errors.password = 'Password must contain an uppercase letter.';
        else if (!/[a-z]/.test(password)) errors.password = 'Password must contain a lowercase letter.';
        else if (!/\d/.test(password)) errors.password = 'Password must contain a number.';
        if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.';
        else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
        if (!terms) errors.terms = 'You must accept the Terms & Conditions.';
        return { isValid: Object.keys(errors).length === 0, errors };
    }
    function passwordStrength(password) {
        if (!password) return { level: 'none', score: 0, label: 'Enter a password' };
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        let level = 'weak', label = 'Weak';
        if (score >= 5) { level = 'strong'; label = 'Strong'; }
        else if (score >= 4) { level = 'good'; label = 'Good'; }
        else if (score >= 2) { level = 'fair'; label = 'Fair'; }
        return { level, score, label };
    }
    return { validateLogin, validateSignup, passwordStrength };
})();

/* ============================================================
   MODULE 4: AUTH
   ============================================================ */
const Auth = (() => {
    const S = Storage, C = CryptoUtil;
    let currentUser = null;
    const listeners = new Set();
    function notify() { listeners.forEach(fn => { try { fn(currentUser); } catch (e) {} }); }
    function subscribe(fn) { listeners.add(fn); fn(currentUser); return () => listeners.delete(fn); }
    function loadSession() {
        const session = S.getSession(); if (!session) return null;
        const users = S.getUsers();
        const u = users.find(x => x.id === session.id && x.email === session.email);
        if (!u) { S.clearSession(); return null; }
        return { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role };
    }
    function persistSession(u) { S.setSession({ id: u.id, name: u.name, email: u.email, role: u.role }); }
    async function registerUser({ name, email, phone, password }) {
        const users = S.getUsers();
        const norm = email.trim().toLowerCase();
        if (users.some(u => u.email.toLowerCase() === norm)) return { ok: false, error: 'An account with this email already exists.' };
        const passwordHash = await C.hashPassword(password);
        const newUser = { id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8), name: name.trim(), email: norm, phone: phone.trim(), passwordHash, role: 'customer', createdAt: new Date().toISOString() };
        users.push(newUser);
        S.setUsers(users);
        currentUser = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role };
        persistSession(currentUser); notify();
        return { ok: true, user: currentUser };
    }
    async function loginUser({ email, password }) {
        const users = S.getUsers();
        const norm = email.trim().toLowerCase();
        const u = users.find(x => x.email.toLowerCase() === norm);
        if (!u) return { ok: false, error: 'Invalid email or password.' };
        if (!(await C.verifyPassword(password, u.passwordHash))) return { ok: false, error: 'Invalid email or password.' };
        currentUser = { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role };
        persistSession(currentUser); notify();
        return { ok: true, user: currentUser };
    }
    function logoutUser() { S.clearSession(); currentUser = null; notify(); }
    function getCurrentUser() { return currentUser; }
    function isAuthenticated() { return currentUser !== null; }
    function hasRole(role) { if (!currentUser) return false; if (Array.isArray(role)) return role.includes(currentUser.role); return currentUser.role === role; }
    function checkRateLimit() {
        const a = S.getAttempts(); const now = Date.now();
        if (a.lockedUntil > now) return { locked: true, seconds: Math.ceil((a.lockedUntil - now) / 1000) };
        return { locked: false };
    }
    function recordFailedAttempt() {
        const a = S.getAttempts(); a.count = (a.count || 0) + 1;
        if (a.count >= 5) { a.lockedUntil = Date.now() + 30000; a.count = 0; }
        S.setAttempts(a);
    }
    function resetFailedAttempts() { S.clearAttempts(); }
    currentUser = loadSession();
    return { subscribe, registerUser, loginUser, logoutUser, getCurrentUser, isAuthenticated, hasRole, checkRateLimit, recordFailedAttempt, resetFailedAttempts };
})();

/* ============================================================
   MODULE 5: GUARDS
   ============================================================ */
const Guards = (() => {
    const A = Auth;
    function requireAuth() { if (!A.isAuthenticated()) { AuthUI.openAuthModalUI('login'); return false; } return true; }
    function requireRole(role) {
        if (!A.isAuthenticated()) { AuthUI.openAuthModalUI('login'); return false; }
        if (!A.hasRole(role)) { showToast("You don't have permission to access this page.", 'error'); return false; }
        return true;
    }
    return { requireAuth, requireRole };
})();

/* ============================================================
   MODULE 6: AUTH UI
   ============================================================ */
const AuthUI = (() => {
    const A = Auth, V = Validation;
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => document.querySelectorAll(s);

    function setError(fieldId, msg) {
        const err = document.getElementById(fieldId + 'Error');
        const input = document.getElementById(fieldId);
        if (err) { err.textContent = msg || ''; err.style.opacity = msg ? '1' : '0'; }
        if (input) input.classList.toggle('border-red-500', !!msg);
    }
    function clearErrors(formId) {
        const form = document.getElementById(formId); if (!form) return;
        form.querySelectorAll('.error-message').forEach(e => { e.textContent = ''; e.style.opacity = '0'; });
        form.querySelectorAll('input').forEach(i => i.classList.remove('border-red-500'));
    }
    function setLoading(id, on) {
        const btn = document.getElementById(id); if (!btn) return;
        btn.disabled = on; btn.style.opacity = on ? '0.7' : '1'; btn.style.cursor = on ? 'wait' : 'pointer';
    }
    function togglePassword(inputId, iconEl) {
        const input = document.getElementById(inputId); if (!input) return;
        if (input.type === 'password') { input.type = 'text'; if (iconEl) iconEl.classList.replace('fa-eye', 'fa-eye-slash'); }
        else { input.type = 'password'; if (iconEl) iconEl.classList.replace('fa-eye-slash', 'fa-eye'); }
    }
    function openAuthModalUI(tab = 'login') {
        const modal = $('#authModal'); if (!modal) return;
        modal.classList.remove('hidden'); modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        switchTab(tab);
    }
    function closeAuthModalUI() {
        const modal = $('#authModal'); if (!modal) return;
        modal.classList.add('hidden'); modal.classList.remove('flex');
        document.body.style.overflow = '';
    }
    function switchTab(tab) {
        const modal = $('#authModal'); if (!modal) return;
        modal.querySelectorAll('.auth-tab').forEach(b => b.dataset.active = (b.dataset.tab === tab) ? 'true' : 'false');
        modal.querySelectorAll('.auth-form').forEach(f => {
            const target = tab === 'signup' ? 'formSignup' : tab === 'forgot' ? 'formForgot' : 'formSignin';
            f.classList.toggle('hidden', f.id !== target);
        });
    }
    async function handleLoginSubmit(e) {
        e.preventDefault(); clearErrors('signinFormElement');
        const email = $('#signinEmail')?.value || '';
        const password = $('#signinPassword')?.value || '';
        const { isValid, errors } = V.validateLogin({ email, password });
        if (!isValid) { const m = { email: 'signinEmail', password: 'signinPassword' }; Object.entries(errors).forEach(([f, msg]) => setError(m[f] || f, msg)); return; }
        const rate = A.checkRateLimit();
        if (rate.locked) { showToast(`Too many attempts. Wait ${rate.seconds}s.`, 'error'); return; }
        setLoading('signinSubmitBtn', true);
        try {
            const result = await A.loginUser({ email, password });
            if (!result.ok) { A.recordFailedAttempt(); setError('signinPassword', result.error); showToast(result.error, 'error'); return; }
            A.resetFailedAttempts();
            showToast(`Welcome back, ${result.user.name.split(' ')[0]}!`, 'success');
            closeAuthModalUI();
            if (typeof window.showDashboard === 'function') window.showDashboard();
        } finally { setLoading('signinSubmitBtn', false); }
    }
    async function handleSignupSubmit(e) {
        e.preventDefault(); clearErrors('signupFormElement');
        const name = $('#signupName')?.value || '';
        const email = $('#signupEmail')?.value || '';
        const phone = $('#signupPhone')?.value || '';
        const password = $('#signupPassword')?.value || '';
        const confirmPassword = $('#signupConfirmPassword')?.value || '';
        const terms = $('#termsAgree')?.checked || false;
        const { isValid, errors } = V.validateSignup({ name, email, phone, password, confirmPassword, terms });
        if (!isValid) {
            const m = { name: 'signupName', email: 'signupEmail', phone: 'signupPhone', password: 'signupPassword', confirmPassword: 'signupConfirmPassword' };
            Object.entries(errors).forEach(([f, msg]) => { if (f === 'terms') showToast(msg, 'error'); else setError(m[f] || f, msg); });
            return;
        }
        setLoading('signupSubmitBtn', true);
        try {
            const result = await A.registerUser({ name, email, phone, password });
            if (!result.ok) { setError('signupEmail', result.error); showToast(result.error, 'error'); return; }
            showToast(`Welcome to FurniCraft, ${result.user.name.split(' ')[0]}!`, 'success');
            closeAuthModalUI();
            if (typeof window.showDashboard === 'function') window.showDashboard();
        } finally { setLoading('signupSubmitBtn', false); }
    }
    function handleForgotSubmit(e) {
        e.preventDefault(); clearErrors('forgotFormElement');
        const email = $('#forgotEmail')?.value || '';
        if (!email.trim()) { setError('forgotEmail', 'Email is required.'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('forgotEmail', 'Please enter a valid email.'); return; }
        showToast('Demo mode: password reset unavailable without backend.', 'info');
    }
    function wirePasswordStrength() {
        const pwd = $('#signupPassword'); const meter = $('#pwdStrength'); if (!pwd || !meter) return;
        pwd.addEventListener('input', () => {
            const v = pwd.value;
            if (!v) { meter.classList.add('hidden'); return; }
            meter.classList.remove('hidden');
            const { level, score, label } = V.passwordStrength(v);
            const colorMap = { weak: 'bg-red-500', fair: 'bg-orange-500', good: 'bg-green-500', strong: 'bg-brand-500' };
            meter.querySelectorAll('.pwd-strength-bar').forEach((bar, i) => {
                bar.className = 'pwd-strength-bar flex-1 h-1 rounded transition-colors';
                bar.classList.add(i < score ? colorMap[level] : 'bg-slate-200 dark:bg-slate-700');
            });
            const txt = meter.querySelector('.pwd-strength-text');
            if (txt) txt.textContent = `${label} password`;
        });
    }
    function init() {
        $('#signinFormElement')?.addEventListener('submit', handleLoginSubmit);
        $('#signupFormElement')?.addEventListener('submit', handleSignupSubmit);
        $('#forgotFormElement')?.addEventListener('submit', handleForgotSubmit);
        $$('.toggle-pwd').forEach(btn => {
            btn.addEventListener('click', () => {
                const t = btn.dataset.target; const ic = btn.querySelector('i');
                if (t) togglePassword(t, ic);
            });
        });
        $$('.auth-tab').forEach(tabBtn => tabBtn.addEventListener('click', () => switchTab(tabBtn.dataset.tab)));
        $('#switchToSignup')?.addEventListener('click', () => switchTab('signup'));
        $('#switchToSignin')?.addEventListener('click', () => switchTab('login'));
        $('#switchToForgot')?.addEventListener('click', () => switchTab('forgot'));
        $('#switchFromForgot')?.addEventListener('click', () => switchTab('login'));
        $('#authClose')?.addEventListener('click', closeAuthModalUI);
        $('#authModal')?.addEventListener('click', (e) => { if (e.target === $('#authModal')) closeAuthModalUI(); });
        wirePasswordStrength();
        window.openAuthModalUI = openAuthModalUI;
        window.closeAuthModalUI = closeAuthModalUI;
    }
    return { init, openAuthModalUI, closeAuthModalUI, switchTab };
})();

/* ============================================================
   MODULE 7: APP
   ============================================================ */
const App = (() => {
    const DEFAULT_PRODUCTS = [
        // LIVING (10)
        { id: 101, name: 'Luxury Velvet Sofa', price: 899.99, oldPrice: 1299.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=500&q=80', desc: 'Elegant velvet with premium cushioning.', rating: 4.8, reviewCount: 124, isNew: true, stock: 15, category: 'living' },
        { id: 102, name: 'Modern Armchair', price: 349.99, oldPrice: 449.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500&q=80', desc: 'Ergonomic design with stylish fabric.', rating: 4.6, reviewCount: 89, stock: 3, category: 'living' },
        { id: 103, name: 'Sectional Sofa L-Shape', price: 1299.99, oldPrice: 1699.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80', desc: 'Spacious L-shaped sectional.', rating: 4.8, reviewCount: 45, stock: 5, category: 'living' },
        { id: 104, name: 'Coffee Table Glass', price: 299.99, oldPrice: 399.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?auto=format&fit=crop&w=500&q=80', desc: 'Minimalist wood and tempered glass.', rating: 4.5, reviewCount: 32, stock: 12, category: 'living' },
        { id: 105, name: 'Recliner Lounge Chair', price: 549.99, image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=500&q=80', desc: 'Push-back recliner with footrest.', rating: 4.7, reviewCount: 51, stock: 7, category: 'living' },
        { id: 106, name: 'TV Media Console', price: 429.99, oldPrice: 549.99, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=500&q=80', desc: 'Walnut finish with cable management.', rating: 4.6, reviewCount: 28, stock: 9, category: 'living' },
        { id: 107, name: 'Accent Side Table', price: 129.99, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=500&q=80', desc: 'Round marble-top side table.', rating: 4.4, reviewCount: 19, stock: 22, category: 'living' },
        { id: 108, name: 'Bookshelf 5-Tier', price: 249.99, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=500&q=80', desc: 'Industrial-style open shelving.', rating: 4.7, reviewCount: 41, stock: 11, category: 'living' },
        { id: 109, name: 'Rocking Chair Oak', price: 279.99, image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=500&q=80', desc: 'Handcrafted solid oak rocker.', rating: 4.9, reviewCount: 63, isNew: true, stock: 6, category: 'living' },
        { id: 110, name: 'Ottoman Storage Cube', price: 159.99, oldPrice: 199.99, image: 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=500&q=80', desc: 'Hidden storage with tufted top.', rating: 4.5, reviewCount: 24, stock: 14, category: 'living' },
        // BEDROOM (10)
        { id: 201, name: 'Minimalist Bed Frame', price: 749.99, oldPrice: 999.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=500&q=80', desc: 'Clean lines, sturdy construction.', rating: 4.7, reviewCount: 156, stock: 8, category: 'bedroom' },
        { id: 202, name: 'King Upholstered Bed', price: 999.99, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=80', desc: 'Linen headboard with wingback.', rating: 4.9, reviewCount: 78, isNew: true, stock: 6, category: 'bedroom' },
        { id: 203, name: '3-Door Wardrobe', price: 849.99, oldPrice: 1099.99, image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=500&q=80', desc: 'Spacious with mirror panel.', rating: 4.6, reviewCount: 54, stock: 4, category: 'bedroom' },
        { id: 204, name: 'Nightstand Walnut', price: 179.99, image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=500&q=80', desc: 'Two-drawer with brass handles.', rating: 4.7, reviewCount: 37, stock: 18, category: 'bedroom' },
        { id: 205, name: 'Dresser 6-Drawer', price: 599.99, oldPrice: 749.99, image: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?auto=format&fit=crop&w=500&q=80', desc: 'Soft-close drawers, oak finish.', rating: 4.8, reviewCount: 42, stock: 7, category: 'bedroom' },
        { id: 206, name: 'Vanity Table Set', price: 399.99, image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=500&q=80', desc: 'Includes stool and LED mirror.', rating: 4.5, reviewCount: 29, isNew: true, stock: 5, category: 'bedroom' },
        { id: 207, name: 'Platform Bed Queen', price: 649.99, image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=500&q=80', desc: 'Low-profile with slat base.', rating: 4.6, reviewCount: 33, stock: 10, category: 'bedroom' },
        { id: 208, name: 'Canopy Bed Frame', price: 1199.99, oldPrice: 1499.99, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=500&q=80', desc: 'Four-poster canopy design.', rating: 4.9, reviewCount: 22, stock: 3, category: 'bedroom' },
        { id: 209, name: 'Storage Bench', price: 219.99, image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=500&q=80', desc: 'End-of-bed storage bench.', rating: 4.5, reviewCount: 18, stock: 13, category: 'bedroom' },
        { id: 210, name: 'Wall Mirror Round', price: 139.99, image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=500&q=80', desc: 'Brass-framed 30" round mirror.', rating: 4.8, reviewCount: 47, stock: 20, category: 'bedroom' },
        // DINING (10)
        { id: 301, name: 'Oak Dining Table', price: 599.99, oldPrice: 799.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=500&q=80', desc: 'Solid oak, extendable for gatherings.', rating: 4.9, reviewCount: 67, isNew: true, stock: 8, category: 'dining' },
        { id: 302, name: 'Marble Dining Table', price: 1299.99, oldPrice: 1599.99, image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=500&q=80', desc: 'Italian marble top, gold base.', rating: 4.9, reviewCount: 31, stock: 4, category: 'dining' },
        { id: 303, name: 'Dining Chair Set of 2', price: 249.99, image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=500&q=80', desc: 'Upholstered with wooden legs.', rating: 4.6, reviewCount: 58, stock: 16, category: 'dining' },
        { id: 304, name: 'Bar Stool Set of 3', price: 329.99, oldPrice: 429.99, image: 'https://images.unsplash.com/photo-1502301197179-65228ab57f78?auto=format&fit=crop&w=500&q=80', desc: 'Adjustable height, swivel seat.', rating: 4.5, reviewCount: 44, stock: 12, category: 'dining' },
        { id: 305, name: 'Sideboard Buffet', price: 749.99, image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=500&q=80', desc: 'Four-door storage with wine rack.', rating: 4.8, reviewCount: 26, stock: 6, category: 'dining' },
        { id: 306, name: 'Round Bistro Table', price: 279.99, image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?auto=format&fit=crop&w=500&q=80', desc: 'Compact for small spaces.', rating: 4.5, reviewCount: 21, stock: 15, category: 'dining' },
        { id: 307, name: 'Glass Dining Table', price: 899.99, oldPrice: 1099.99, image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=500&q=80', desc: 'Tempered glass with chrome base.', rating: 4.7, reviewCount: 39, isNew: true, stock: 5, category: 'dining' },
        { id: 308, name: 'Bench Dining Seat', price: 189.99, image: 'https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=500&q=80', desc: 'Solid wood dining bench.', rating: 4.6, reviewCount: 27, stock: 14, category: 'dining' },
        { id: 309, name: 'China Cabinet', price: 1099.99, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=500&q=80', desc: 'Glass-front display cabinet.', rating: 4.7, reviewCount: 15, stock: 3, category: 'dining' },
        { id: 310, name: 'Counter Height Table', price: 549.99, oldPrice: 699.99, image: 'https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=500&q=80', desc: 'Pub-style with storage shelf.', rating: 4.5, reviewCount: 22, stock: 9, category: 'dining' },
        // OFFICE (10)
        { id: 401, name: 'Ergonomic Chair Pro', price: 499.99, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=500&q=80', desc: 'Adjustable lumbar support.', rating: 4.9, reviewCount: 88, isNew: true, stock: 8, category: 'office' },
        { id: 402, name: 'Executive Desk', price: 799.99, oldPrice: 999.99, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=500&q=80', desc: 'Large L-shaped with drawers.', rating: 4.8, reviewCount: 44, stock: 5, category: 'office' },
        { id: 403, name: 'Standing Desk Electric', price: 649.99, image: 'https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&w=500&q=80', desc: 'Height-adjustable, memory presets.', rating: 4.9, reviewCount: 72, isNew: true, stock: 7, category: 'office' },
        { id: 404, name: 'Bookshelf Office', price: 199.99, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=500&q=80', desc: '5-shelf open bookcase.', rating: 4.6, reviewCount: 35, stock: 18, category: 'office' },
        { id: 405, name: 'Filing Cabinet 3-Drawer', price: 229.99, oldPrice: 289.99, image: 'https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=500&q=80', desc: 'Lockable with smooth slides.', rating: 4.5, reviewCount: 29, stock: 12, category: 'office' },
        { id: 406, name: 'Guest Chair Set of 2', price: 279.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=500&q=80', desc: 'Stackable reception chairs.', rating: 4.4, reviewCount: 17, stock: 20, category: 'office' },
        { id: 407, name: 'Desk Organizer Set', price: 49.99, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80', desc: 'Bamboo desktop organizer.', rating: 4.7, reviewCount: 52, stock: 40, category: 'office' },
        { id: 408, name: 'Conference Table', price: 1499.99, image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=500&q=80', desc: '8-seat meeting table.', rating: 4.8, reviewCount: 11, stock: 2, category: 'office' },
        { id: 409, name: 'Monitor Stand Riser', price: 79.99, image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=500&q=80', desc: 'Walnut with storage drawer.', rating: 4.6, reviewCount: 38, stock: 25, category: 'office' },
        { id: 410, name: 'Footrest Under Desk', price: 59.99, oldPrice: 79.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500&q=80', desc: 'Adjustable ergonomic footrest.', rating: 4.5, reviewCount: 24, stock: 30, category: 'office' },
        // LIGHTING (10)
        { id: 501, name: 'Brass Pendant Light', price: 199.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80', desc: 'Brass pendant with glass shade.', rating: 4.8, reviewCount: 46, isNew: true, stock: 10, category: 'lighting' },
        { id: 502, name: 'Floor Lamp Arc', price: 249.99, oldPrice: 329.99, image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=500&q=80', desc: 'Chrome arc with marble base.', rating: 4.7, reviewCount: 33, stock: 8, category: 'lighting' },
        { id: 503, name: 'Table Lamp Ceramic', price: 89.99, image: 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=500&q=80', desc: 'Hand-glazed ceramic base.', rating: 4.6, reviewCount: 41, stock: 22, category: 'lighting' },
        { id: 504, name: 'Chandelier Crystal', price: 599.99, oldPrice: 799.99, image: 'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?auto=format&fit=crop&w=500&q=80', desc: '6-arm crystal chandelier.', rating: 4.9, reviewCount: 19, stock: 4, category: 'lighting' },
        { id: 505, name: 'Wall Sconce Pair', price: 129.99, image: 'https://images.unsplash.com/photo-1565636192335-3a5f8e1d1e5b?auto=format&fit=crop&w=500&q=80', desc: 'Set of 2 modern wall sconces.', rating: 4.5, reviewCount: 27, stock: 16, category: 'lighting' },
        { id: 506, name: 'LED Strip Smart', price: 39.99, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=80', desc: '16ft RGB with app control.', rating: 4.7, reviewCount: 88, isNew: true, stock: 50, category: 'lighting' },
        { id: 507, name: 'Desk Lamp LED', price: 69.99, oldPrice: 89.99, image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=500&q=80', desc: 'Dimmable with USB port.', rating: 4.6, reviewCount: 62, stock: 24, category: 'lighting' },
        { id: 508, name: 'Ceiling Flush Mount', price: 149.99, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500&q=80', desc: 'Modern flush-mount ceiling light.', rating: 4.4, reviewCount: 18, stock: 14, category: 'lighting' },
        { id: 509, name: 'Outdoor String Lights', price: 49.99, image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=500&q=80', desc: 'Weatherproof 48ft Edison bulbs.', rating: 4.8, reviewCount: 71, stock: 35, category: 'lighting' },
        { id: 510, name: 'Picture Light', price: 79.99, image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=500&q=80', desc: 'Adjustable art display light.', rating: 4.5, reviewCount: 14, stock: 19, category: 'lighting' },
        // DECOR (10)
        { id: 601, name: 'Ceramic Vase Set', price: 49.99, image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=500&q=80', desc: 'Set of 3 matte ceramic vases.', rating: 4.6, reviewCount: 28, isNew: true, stock: 25, category: 'decor' },
        { id: 602, name: 'Abstract Wall Art', price: 129.99, oldPrice: 169.99, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=500&q=80', desc: 'Framed canvas 24x36".', rating: 4.7, reviewCount: 35, stock: 12, category: 'decor' },
        { id: 603, name: 'Woven Area Rug', price: 199.99, image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=500&q=80', desc: '5x8 ft jute flatweave rug.', rating: 4.5, reviewCount: 42, stock: 9, category: 'decor' },
        { id: 604, name: 'Throw Pillow Set', price: 39.99, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=500&q=80', desc: 'Set of 4 velvet covers.', rating: 4.4, reviewCount: 56, stock: 40, category: 'decor' },
        { id: 605, name: 'Scented Candle Trio', price: 34.99, image: 'https://images.unsplash.com/photo-1602874801006-e26d5b9c0f2c?auto=format&fit=crop&w=500&q=80', desc: 'Soy wax, 3 seasonal scents.', rating: 4.8, reviewCount: 91, isNew: true, stock: 55, category: 'decor' },
        { id: 606, name: 'Tabletop Fountain', price: 89.99, image: 'https://images.unsplash.com/photo-1544376664-80b17f09d399?auto=format&fit=crop&w=500&q=80', desc: 'Indoor Zen water fountain.', rating: 4.3, reviewCount: 15, stock: 8, category: 'decor' },
        { id: 607, name: 'Wall Clock Modern', price: 59.99, oldPrice: 79.99, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=500&q=80', desc: 'Silent 12" minimal clock.', rating: 4.6, reviewCount: 33, stock: 28, category: 'decor' },
        { id: 608, name: 'Plant Pot Set', price: 44.99, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=500&q=80', desc: 'Set of 3 cement planters.', rating: 4.5, reviewCount: 22, stock: 32, category: 'decor' },
        { id: 609, name: 'Decorative Tray', price: 29.99, image: 'https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=500&q=80', desc: 'Brass mirrored serving tray.', rating: 4.7, reviewCount: 26, stock: 21, category: 'decor' },
        { id: 610, name: 'Bookends Marble', price: 54.99, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80', desc: 'Pair of marble geometric bookends.', rating: 4.6, reviewCount: 18, stock: 17, category: 'decor' }
    ];

    let storedProducts = Storage.safeGet(Storage.KEYS.PRODUCTS, null);
    if (!storedProducts || !Array.isArray(storedProducts) || storedProducts.length < 30) {
        storedProducts = [...DEFAULT_PRODUCTS];
        Storage.safeSet(Storage.KEYS.PRODUCTS, storedProducts);
    }
    let PRODUCTS = storedProducts;
    let cart = Storage.safeGet(Storage.KEYS.CART, []);
    let wishlist = Storage.safeGet(Storage.KEYS.WISHLIST, []);
    let theme = Storage.safeGet(Storage.KEYS.THEME, 'light');
    let currentCategory = null;
    let currentSort = 'default';

    const $ = (s) => document.querySelector(s);
    const $$ = (s) => document.querySelectorAll(s);

    function saveAll() {
        Storage.safeSet(Storage.KEYS.PRODUCTS, PRODUCTS);
        Storage.safeSet(Storage.KEYS.CART, cart);
        Storage.safeSet(Storage.KEYS.WISHLIST, wishlist);
        Storage.safeSet(Storage.KEYS.THEME, theme);
    }
    function getStars(rating) {
        const full = Math.floor(rating); const half = rating % 1 >= 0.5;
        let html = '';
        for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
        if (half) html += '<i class="fas fa-star-half-alt"></i>';
        for (let i = 0; i < 5 - full - (half ? 1 : 0); i++) html += '<i class="far fa-star"></i>';
        return html;
    }
    function getStockStatus(stock) {
        if (stock === 0) return { cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', label: 'Out of Stock' };
        if (stock <= 5) return { cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300', label: `Only ${stock} left!` };
        return { cls: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', label: 'In Stock' };
    }
    function escapeHtml(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }

    function createConfetti() {
        const c = document.getElementById('confettiContainer'); if (!c) return;
        const colors = ['#2b6cb0', '#38a169', '#d69e2e', '#7c3aed', '#e53e3e', '#f6ad55'];
        for (let i = 0; i < 50; i++) {
            const el = document.createElement('div');
            el.style.cssText = `position:absolute;width:${6 + Math.random() * 8}px;height:${6 + Math.random() * 8}px;background:${colors[Math.floor(Math.random() * colors.length)]};left:${Math.random() * 100}%;top:-20px;border-radius:${Math.random() > 0.5 ? '50%' : '0'};animation:confettiFall ${2 + Math.random() * 2}s linear ${Math.random() * 0.5}s forwards;`;
            c.appendChild(el);
            setTimeout(() => el.remove(), 4500);
        }
    }
    function animateCounter(el, target, duration = 1000, isPrice = false) {
        if (!el) return;
        const start = performance.now();
        const targetNum = typeof target === 'string' ? parseFloat(target.replace(/[$,]/g, '')) : target;
        function update(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = Math.round(targetNum * eased);
            el.textContent = isPrice ? '$' + val.toLocaleString() : val.toLocaleString();
            if (p < 1) requestAnimationFrame(update);
            else el.textContent = isPrice ? '$' + targetNum.toLocaleString() : targetNum.toLocaleString();
        }
        requestAnimationFrame(update);
    }

    /* RENDER */
    function renderProductGrid(products, container) {
        if (!container) return;
        container.innerHTML = products.map((p, idx) => {
            const inWish = wishlist.includes(p.id);
            const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
            const ss = getStockStatus(p.stock);
            const isOut = p.stock === 0;
            return `
            <div class="product-card bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col hover:-translate-y-2 hover:shadow-2xl hover:border-brand-500 transition-all duration-300 animate-fadeInUp" data-id="${p.id}" style="animation-delay:${idx * 0.04}s">
                <div class="relative overflow-hidden cursor-pointer group">
                    ${p.isNew ? '<span class="absolute top-2 left-2 bg-green-500 text-white text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full z-10 animate-pulse">New</span>' : ''}
                    ${discount > 0 && !p.isNew ? `<span class="absolute top-2 left-2 bg-red-500 text-white text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full z-10">-${discount}%</span>` : ''}
                    <span class="absolute bottom-2 left-2 ${ss.cls} text-[0.6rem] font-bold px-2 py-0.5 rounded-full z-10">${ss.label}</span>
                    <button class="wishlist-btn absolute top-2 right-2 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center ${inWish ? 'text-red-500 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'} z-10 text-xs transition-all" data-id="${p.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110">
                </div>
                <div class="p-4 flex-1 flex flex-col">
                    <h3 class="font-semibold text-sm mb-1">${escapeHtml(p.name)}</h3>
                    <div class="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                        <span class="text-amber-400 text-[0.65rem]">${getStars(p.rating || 4.5)}</span>
                        <span>(${p.reviewCount || 0})</span>
                    </div>
                    <div class="text-xs text-slate-400 mb-2 flex-1">${escapeHtml(p.desc)}</div>
                    <div class="flex items-baseline gap-2 mb-2">
                        <span class="font-bold text-base text-brand-600 dark:text-brand-400">$${p.price.toFixed(2)}</span>
                        ${p.oldPrice ? `<span class="text-xs text-slate-400 line-through">$${p.oldPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <button class="add-cart w-full py-2 rounded-full ${isOut ? 'border-2 border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'} font-semibold text-sm flex items-center justify-center gap-2 transition-all" data-id="${p.id}" ${isOut ? 'disabled' : ''}>
                        <i class="fas fa-${isOut ? 'times' : 'plus'}"></i> ${isOut ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>`;
        }).join('');
    }
    function rerenderAll() {
        const featured = [...PRODUCTS].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.rating - a.rating).slice(0, 8);
        renderProductGrid(featured, $('#productGrid'));
        updateCategoryCounts();
    }
    function updateCategoryCounts() {
        $$('.category-card').forEach(card => {
            const c = card.dataset.category;
            const n = PRODUCTS.filter(p => p.category === c).length;
            const el = card.querySelector('.cat-count');
            if (el) el.textContent = `${n} items`;
        });
    }
    function addToCart(id) {
        if (!Auth.isAuthenticated()) { showToast('Please sign in first', 'warning'); AuthUI.openAuthModalUI('login'); return; }
        const p = PRODUCTS.find(x => x.id === id);
        if (!p || p.stock === 0) return;
        const ex = cart.find(i => i.id === id);
        if (ex) ex.qty++; else cart.push({ id, name: p.name, price: p.price, image: p.image, qty: 1 });
        saveAll(); updateCartUI();
        showToast(`${p.name} added to cart`, 'success');
    }
    function updateCartUI() {
        const count = cart.reduce((s, i) => s + i.qty, 0);
        const badge = $('#cartCount');
        if (badge) { badge.textContent = count; badge.classList.toggle('hidden', count === 0); badge.classList.toggle('flex', count > 0); }
        const itemsEl = $('#cartItems'); const footerEl = $('#cartFooter');
        if (!itemsEl) return;
        if (cart.length === 0) {
            itemsEl.innerHTML = '<div class="text-center py-8 text-slate-400"><i class="fas fa-box-open text-3xl mb-2 block"></i><p>Your cart is empty</p></div>';
            if (footerEl) footerEl.style.display = 'none';
            return;
        }
        itemsEl.innerHTML = cart.map(i => `
            <div class="flex gap-3 py-3 border-b border-slate-200 dark:border-slate-700 items-center">
                <img src="${i.image}" alt="${escapeHtml(i.name)}" class="w-12 h-12 object-cover rounded-lg">
                <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-semibold">${escapeHtml(i.name)}</h4>
                    <div class="text-xs font-semibold text-brand-600 dark:text-brand-400">$${i.price.toFixed(2)}</div>
                    <div class="flex items-center gap-2 mt-1">
                        <button class="qty-dec w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-xs" data-id="${i.id}">−</button>
                        <span class="min-w-[20px] text-center font-semibold text-sm">${i.qty}</span>
                        <button class="qty-inc w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-xs" data-id="${i.id}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove text-slate-400 hover:text-red-500 transition" data-id="${i.id}"><i class="fas fa-times"></i></button>
            </div>
        `).join('');
        const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
        if ($('#cartTotal')) $('#cartTotal').textContent = '$' + total.toFixed(2);
        if (footerEl) footerEl.style.display = 'block';
    }
    function updateQty(id, d) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        item.qty += d;
        if (item.qty <= 0) return removeFromCart(id);
        saveAll(); updateCartUI();
    }
    function removeFromCart(id) { cart = cart.filter(i => i.id !== id); saveAll(); updateCartUI(); }
    function toggleWishlist(id) {
        if (!Auth.isAuthenticated()) { showToast('Please sign in first', 'warning'); AuthUI.openAuthModalUI('login'); return; }
        const idx = wishlist.indexOf(id);
        if (idx > -1) { wishlist.splice(idx, 1); showToast('Removed from wishlist', 'info'); }
        else { wishlist.push(id); showToast('Added to wishlist!', 'success'); }
        saveAll(); updateWishlistUI();
        if ($('#categoryPage').classList.contains('hidden') === false && currentCategory) {
            renderCategoryGrid(getSortedCategoryItems(currentCategory, currentSort));
        } else {
            rerenderAll();
        }
    }
    function updateWishlistUI() {
        const count = wishlist.length;
        const badge = $('#wishlistCount');
        if (badge) { badge.textContent = count; badge.classList.toggle('hidden', count === 0); badge.classList.toggle('flex', count > 0); }
    }

    /* CATEGORY */
    function getSortedCategoryItems(cat, sort) {
        let items = PRODUCTS.filter(p => p.category === cat);
        switch (sort) {
            case 'price-asc': items.sort((a, b) => a.price - b.price); break;
            case 'price-desc': items.sort((a, b) => b.price - a.price); break;
            case 'rating': items.sort((a, b) => b.rating - a.rating); break;
            case 'name': items.sort((a, b) => a.name.localeCompare(b.name)); break;
        }
        return items;
    }
    function renderCategoryGrid(items) {
        const count = $('#categoryCount');
        if (count) count.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;
        renderProductGrid(items, $('#categoryProductGrid'));
    }
    function showCategory(cat) {
        const items = PRODUCTS.filter(p => p.category === cat);
        if (items.length === 0) { showToast('No products in this category', 'warning'); return; }
        currentCategory = cat; currentSort = 'default';
        const sortEl = $('#categorySort'); if (sortEl) sortEl.value = 'default';
        $('#mainSections').classList.add('hidden');
        document.querySelector('section.gradient-brand').classList.add('hidden');
        document.querySelector('footer').classList.add('hidden');
        $('#dashboardWrapper').classList.add('hidden');
        $('#categoryPage').classList.remove('hidden');
        const displayName = cat.charAt(0).toUpperCase() + cat.slice(1);
        $('#categoryPageTitle').innerHTML = `${displayName} <span class="text-brand-600 dark:text-brand-400">Collection</span>`;
        $('#categoryPageMeta').textContent = `Browse our premium ${displayName.toLowerCase()} furniture`;
        renderCategoryGrid(items);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function hideCategoryPage() {
        $('#categoryPage').classList.add('hidden');
        $('#mainSections').classList.remove('hidden');
        document.querySelector('section.gradient-brand').classList.remove('hidden');
        document.querySelector('footer').classList.remove('hidden');
        currentCategory = null;
        document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
    }

    /* DASHBOARD */
    function showDashboard() {
        if (!Guards.requireAuth()) return;
        $('#mainSections').classList.add('hidden');
        document.querySelector('section.gradient-brand').classList.add('hidden');
        document.querySelector('footer').classList.add('hidden');
        $('#categoryPage').classList.add('hidden');
        $('#dashboardWrapper').classList.remove('hidden');
        loadDashboard();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function hideDashboard() {
        $('#dashboardWrapper').classList.add('hidden');
        $('#mainSections').classList.remove('hidden');
        document.querySelector('section.gradient-brand').classList.remove('hidden');
        document.querySelector('footer').classList.remove('hidden');
        $$('.dash-nav-item').forEach(i => i.dataset.active = i.dataset.page === 'overview' ? 'true' : 'false');
        $('#dashboardSidebar')?.classList.add('-translate-x-full');
        $('#dashboardSidebar')?.classList.remove('translate-x-0');
        const ov = $('#sidebarOverlay'); if (ov) ov.style.display = 'none';
    }
    function getOrdersForUser() { const u = Auth.getCurrentUser(); if (!u) return []; return Storage.safeGet(Storage.KEYS.ORDERS(u.email), []); }
    function getUserPoints() { const u = Auth.getCurrentUser(); if (!u) return 0; return Storage.safeGet(Storage.KEYS.POINTS(u.email), 0); }
    function loadDashboard() {
        const user = Auth.getCurrentUser(); if (!user) return;
        const orders = getOrdersForUser();
        const spent = orders.reduce((s, o) => s + (o.total || 0), 0);
        const points = getUserPoints();
        const el = (id) => document.getElementById(id);
        if (el('sidebarUserName')) el('sidebarUserName').textContent = user.name;
        if (el('sidebarUserEmail')) el('sidebarUserEmail').textContent = user.email;
        if (el('dashGreeting')) el('dashGreeting').textContent = user.name.split(' ')[0];
        const da = el('dashAvatar');
        if (da) { if (user.role === 'admin') da.classList.add('from-amber-400', 'to-yellow-600'); else da.classList.remove('from-amber-400', 'to-yellow-600'); }
        animateCounter(el('dashStatOrders'), orders.length);
        animateCounter(el('dashStatPoints'), points);
        animateCounter(el('dashStatWishlist'), wishlist.length);
        animateCounter(el('statOrders'), orders.length);
        animateCounter(el('statSpent'), '$' + Math.round(spent), 1200, true);
        animateCounter(el('statPoints'), points);
        animateCounter(el('statWishlist'), wishlist.length);
        renderDashboardPage('overview');
    }
    function renderDashboardPage(page) {
        const content = $('#dashboardPages'); if (!content) return;
        const user = Auth.getCurrentUser(); if (!user) return;
        const orders = getOrdersForUser();
        const points = getUserPoints();
        const tier = points >= 10000 ? 'Platinum' : points >= 5000 ? 'Gold' : points >= 1000 ? 'Silver' : 'Bronze';
        const nextTier = points >= 10000 ? null : points >= 5000 ? 10000 : points >= 1000 ? 5000 : 1000;
        const progress = nextTier ? Math.min(100, (points / nextTier) * 100) : 100;
        const tierIcon = tier === 'Platinum' ? '💎' : tier === 'Gold' ? '🥇' : tier === 'Silver' ? '🥈' : '🥉';

        if (page === 'overview') {
            content.innerHTML = `
                <div class="grid lg:grid-cols-2 gap-5 mb-5">
                    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700"><h3 class="font-bold text-sm flex items-center gap-2"><i class="fas fa-chart-line"></i> Spending Overview</h3></div>
                        <div class="flex items-end gap-1.5 h-24">
                            ${[40,65,50,80,60,90,75].map(v => `<div class="flex-1 rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400" style="height:${v}%"></div>`).join('')}
                        </div>
                    </div>
                    <div class="gradient-hero text-white rounded-2xl p-5 relative overflow-hidden">
                        <div class="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full font-bold text-xs mb-3">${tierIcon} ${tier} Member</div>
                        <div class="text-3xl font-black flex items-baseline gap-1.5">${points.toLocaleString()}<span class="text-sm font-medium opacity-85">points</span></div>
                        <div class="text-xs opacity-85 mt-2">${nextTier ? (nextTier - points).toLocaleString() + ' pts to next tier' : 'Max tier reached!'}</div>
                        <div class="h-2 bg-white/20 rounded-full overflow-hidden mt-4"><div class="h-full bg-white rounded-full transition-all" style="width:${progress}%"></div></div>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                    <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700"><h3 class="font-bold text-sm flex items-center gap-2"><i class="fas fa-history"></i> Recent Orders</h3></div>
                    ${orders.length === 0 ? '<div class="text-center py-8 text-slate-400"><i class="fas fa-shopping-bag text-3xl mb-2 block opacity-30"></i><p>No orders yet — start shopping!</p></div>' : `
                        <div class="flex flex-col gap-3">
                            ${orders.slice(0, 4).map(o => `
                                <div class="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <div class="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center text-xs"><i class="fas fa-cog"></i></div>
                                    <div class="flex-1"><div class="font-bold text-sm">Order #${o.id}</div><div class="text-xs text-slate-400">${new Date(o.date).toLocaleDateString()} · ${o.items} items</div></div>
                                    <div class="font-extrabold text-brand-600 dark:text-brand-400">$${o.total.toFixed(2)}</div>
                                </div>
                            `).join('')}
                        </div>`}
                </div>
            `;
        } else if (page === 'orders') {
            content.innerHTML = `
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                    <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700"><h3 class="font-bold text-sm flex items-center gap-2"><i class="fas fa-history"></i> All Orders</h3></div>
                    ${orders.length === 0 ? '<div class="text-center py-8 text-slate-400"><i class="fas fa-shopping-bag text-3xl mb-2 block opacity-30"></i><p>No orders yet</p></div>' : `
                        <div class="flex flex-col gap-3">
                            ${orders.map(o => `
                                <div class="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <div class="flex-1"><div class="font-bold text-sm">Order #${o.id}</div><div class="text-xs text-slate-400">${new Date(o.date).toLocaleDateString()} · ${o.items} items</div><span class="inline-block mt-1 px-2 py-0.5 rounded-full text-[0.68rem] font-bold uppercase ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : o.status === 'shipped' ? 'bg-blue-100 text-blue-700' : o.status === 'pending' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}">${o.status}</span></div>
                                    <div class="font-extrabold text-brand-600 dark:text-brand-400 self-center">$${o.total.toFixed(2)}</div>
                                </div>
                            `).join('')}
                        </div>`}
                </div>
            `;
        } else if (page === 'wishlist') {
            const wp = wishlist.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
            content.innerHTML = `
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                    <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700"><h3 class="font-bold text-sm flex items-center gap-2"><i class="fas fa-heart"></i> My Wishlist (${wp.length})</h3></div>
                    ${wp.length === 0 ? '<div class="text-center py-8 text-slate-400"><i class="fas fa-heart text-3xl mb-2 block opacity-30"></i><p>Wishlist is empty — add products you love!</p></div>' : `
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            ${wp.map(p => `
                                <div class="bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                    <img src="${p.image}" alt="${escapeHtml(p.name)}" class="w-full h-32 object-cover">
                                    <div class="p-3">
                                        <h3 class="font-semibold text-sm mb-1">${escapeHtml(p.name)}</h3>
                                        <div class="font-bold text-brand-600 dark:text-brand-400 mb-3">$${p.price.toFixed(2)}</div>
                                        <div class="flex gap-2">
                                            <button class="wl-add flex-1 py-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold text-xs flex items-center justify-center gap-1 transition" data-id="${p.id}"><i class="fas fa-cart-plus"></i> Add</button>
                                            <button class="wl-remove w-9 h-9 rounded-full border-2 border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 hover:bg-brand-600 hover:text-white flex items-center justify-center transition" data-id="${p.id}" title="Remove"><i class="fas fa-times"></i></button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>`}
                </div>
            `;
        } else if (page === 'profile') {
            content.innerHTML = `
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                    <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700"><h3 class="font-bold text-sm flex items-center gap-2"><i class="fas fa-user-edit"></i> Profile Settings</h3></div>
                    <form id="profileForm" class="space-y-4">
                        <div><label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Full Name</label><input type="text" id="pName" value="${escapeHtml(user.name)}" required class="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 outline-none focus:border-brand-500 transition"></div>
                        <div><label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Email</label><input type="email" id="pEmail" value="${escapeHtml(user.email)}" required class="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 outline-none focus:border-brand-500 transition"></div>
                        <div><label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Phone</label><input type="tel" id="pPhone" value="${escapeHtml(user.phone || '')}" class="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 outline-none focus:border-brand-500 transition"></div>
                        <div><label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Role</label><input type="text" value="${user.role}" disabled class="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-slate-100 dark:bg-slate-700 outline-none opacity-60"></div>
                        <button type="submit" class="px-4 py-2.5 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold text-sm flex items-center gap-2 transition"><i class="fas fa-save"></i> Save Changes</button>
                    </form>
                </div>
            `;
            $('#profileForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const newName = $('#pName').value.trim();
                const newEmail = $('#pEmail').value.trim();
                const newPhone = $('#pPhone').value.trim();
                if (!newName || !newEmail) { showToast('Fill all required fields', 'error'); return; }
                const users = Storage.getUsers();
                const idx = users.findIndex(u => u.id === user.id);
                if (idx > -1) {
                    users[idx].name = newName; users[idx].email = newEmail; users[idx].phone = newPhone;
                    Storage.setUsers(users);
                    Storage.setSession({ id: user.id, name: newName, email: newEmail, role: user.role });
                    location.reload();
                }
            });
        }
    }

    /* CHECKOUT */
    function checkout() {
        if (!Auth.isAuthenticated()) { showToast('Please sign in to checkout', 'warning'); AuthUI.openAuthModalUI('login'); return; }
        if (cart.length === 0) { showToast('Cart is empty', 'warning'); return; }
        const user = Auth.getCurrentUser();
        const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
        const order = { id: 'ORD-' + Date.now().toString().slice(-6), date: new Date().toISOString(), items: cart.reduce((s, i) => s + i.qty, 0), total, status: 'processing' };
        const orders = Storage.safeGet(Storage.KEYS.ORDERS(user.email), []);
        orders.unshift(order);
        Storage.safeSet(Storage.KEYS.ORDERS(user.email), orders);
        const points = Math.floor(total * 10);
        const cur = getUserPoints();
        Storage.safeSet(Storage.KEYS.POINTS(user.email), cur + points);
        cart = []; saveAll(); updateCartUI();
        createConfetti();
        $('#cartSidebar').classList.add('translate-x-full');
        $('#cartOverlay').classList.add('hidden');
        showToast(`Order placed! You earned ${points} points!`, 'success');
        if (!$('#dashboardWrapper').classList.contains('hidden')) loadDashboard();
    }

    /* ADMIN */
    function openAdmin() {
        if (!Guards.requireRole('admin')) return;
        $('#adminModal').classList.remove('hidden'); $('#adminModal').classList.add('flex');
        document.body.style.overflow = 'hidden';
        updateAdminCounts();
        renderAdminPanel('dashboard');
    }
    function closeAdmin() {
        $('#adminModal').classList.add('hidden'); $('#adminModal').classList.remove('flex');
        document.body.style.overflow = '';
    }
    function getAllOrders() {
        const users = Storage.getUsers(); const all = [];
        users.forEach(u => { const orders = Storage.safeGet(Storage.KEYS.ORDERS(u.email), []); orders.forEach(o => all.push({ ...o, userEmail: u.email, userName: u.name })); });
        return all.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    function updateAdminCounts() {
        const users = Storage.getUsers();
        if ($('#adminProductCount')) $('#adminProductCount').textContent = PRODUCTS.length;
        if ($('#adminOrderCount')) $('#adminOrderCount').textContent = getAllOrders().length;
        if ($('#adminUserCount')) $('#adminUserCount').textContent = users.length;
    }
    function renderAdminPanel(panel) {
        $$('.admin-nav-item').forEach(i => i.dataset.active = i.dataset.panel === panel ? 'true' : 'false');
        const content = $('#adminContent'); if (!content) return;

        if (panel === 'dashboard') {
            const orders = getAllOrders(); const users = Storage.getUsers();
            const revenue = orders.reduce((s, o) => s + o.total, 0);
            content.innerHTML = `
                <div class="flex justify-between items-center mb-5 flex-wrap gap-3">
                    <div><h3 class="text-xl font-bold flex items-center gap-2"><i class="fas fa-chart-line text-brand-600"></i> Overview</h3><p class="text-slate-400 text-sm">Welcome back, ${escapeHtml(Auth.getCurrentUser().name.split(' ')[0])}!</p></div>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                    <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-400"></div>
                        <div class="text-2xl font-extrabold text-brand-600">${PRODUCTS.length}</div><div class="text-xs text-slate-400 uppercase mt-1">Products</div>
                    </div>
                    <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-400"></div>
                        <div class="text-2xl font-extrabold text-brand-600">${orders.length}</div><div class="text-xs text-slate-400 uppercase mt-1">Orders</div>
                    </div>
                    <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-400"></div>
                        <div class="text-2xl font-extrabold text-brand-600">${users.length}</div><div class="text-xs text-slate-400 uppercase mt-1">Users</div>
                    </div>
                    <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-400"></div>
                        <div class="text-2xl font-extrabold text-brand-600">$${revenue.toFixed(0)}</div><div class="text-xs text-slate-400 uppercase mt-1">Revenue</div>
                    </div>
                </div>
                <h3 class="font-bold flex items-center gap-2 mb-3"><i class="fas fa-history text-brand-600"></i> Recent Orders</h3>
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-auto max-h-96">
                    <table class="w-full text-sm">
                        <thead class="bg-slate-50 dark:bg-slate-900 sticky top-0">
                            <tr><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Order ID</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Customer</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Date</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Total</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Status</th></tr>
                        </thead>
                        <tbody>${orders.slice(0, 8).map(o => `<tr class="border-b border-slate-200 dark:border-slate-700 hover:bg-brand-50 dark:hover:bg-brand-900/10"><td class="px-4 py-3">#${o.id}</td><td class="px-4 py-3">${escapeHtml(o.userName)}</td><td class="px-4 py-3">${new Date(o.date).toLocaleDateString()}</td><td class="px-4 py-3 font-semibold">$${o.total.toFixed(2)}</td><td class="px-4 py-3"><span class="inline-block px-2 py-0.5 rounded-full text-[0.68rem] font-bold uppercase ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : o.status === 'shipped' ? 'bg-blue-100 text-blue-700' : o.status === 'pending' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}">${o.status}</span></td></tr>`).join('') || '<tr><td colspan="5" class="text-center py-8 text-slate-400">No orders</td></tr>'}</tbody>
                    </table>
                </div>
            `;
        } else if (panel === 'products') {
            content.innerHTML = `
                <div class="flex justify-between items-center mb-5 flex-wrap gap-3">
                    <div><h3 class="text-xl font-bold flex items-center gap-2"><i class="fas fa-box text-brand-600"></i> Products</h3><p class="text-slate-400 text-sm">Manage your inventory (${PRODUCTS.length} items)</p></div>
                    <button id="addProductBtn" class="bg-gradient-to-r from-brand-600 to-accent-500 text-white font-semibold text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 hover:-translate-y-0.5 transition"><i class="fas fa-plus"></i> Add Product</button>
                </div>
                <div class="mb-4 relative">
                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input type="text" id="adminProductSearch" placeholder="Search products..." class="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-brand-500 transition text-sm">
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-auto max-h-[500px]">
                    <table class="w-full text-sm">
                        <thead class="bg-slate-50 dark:bg-slate-900 sticky top-0">
                            <tr><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Image</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Name</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Category</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Price</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Stock</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Actions</th></tr>
                        </thead>
                        <tbody id="adminProductTableBody"></tbody>
                    </table>
                </div>
            `;
            renderAdminProducts(PRODUCTS);
            $('#addProductBtn')?.addEventListener('click', () => openProductForm());
            $('#adminProductSearch')?.addEventListener('input', function() {
                const q = this.value.toLowerCase();
                renderAdminProducts(PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)));
            });
        } else if (panel === 'orders') {
            const orders = getAllOrders();
            content.innerHTML = `
                <div class="flex justify-between items-center mb-5 flex-wrap gap-3">
                    <div><h3 class="text-xl font-bold flex items-center gap-2"><i class="fas fa-shopping-bag text-brand-600"></i> Orders</h3><p class="text-slate-400 text-sm">${orders.length} total orders</p></div>
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-auto max-h-[500px]">
                    <table class="w-full text-sm">
                        <thead class="bg-slate-50 dark:bg-slate-900 sticky top-0">
                            <tr><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Order ID</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Customer</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Items</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Total</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Date</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Status</th></tr>
                        </thead>
                        <tbody>${orders.length === 0 ? '<tr><td colspan="6" class="text-center py-8 text-slate-400">No orders yet</td></tr>' : orders.map(o => `
                            <tr class="border-b border-slate-200 dark:border-slate-700 hover:bg-brand-50 dark:hover:bg-brand-900/10">
                                <td class="px-4 py-3">#${o.id}</td><td class="px-4 py-3">${escapeHtml(o.userName)}</td><td class="px-4 py-3">${o.items}</td><td class="px-4 py-3 font-semibold">$${o.total.toFixed(2)}</td><td class="px-4 py-3">${new Date(o.date).toLocaleDateString()}</td>
                                <td class="px-4 py-3"><select class="status-select px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold cursor-pointer outline-none" data-order-id="${o.id}" data-user-email="${o.userEmail}"><option value="processing" ${o.status === 'processing' ? 'selected' : ''}>Processing</option><option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option><option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option><option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pending</option></select></td>
                            </tr>
                        `).join('')}</tbody>
                    </table>
                </div>
            `;
            content.querySelectorAll('.status-select').forEach(sel => {
                sel.addEventListener('change', function() {
                    const oid = this.dataset.orderId; const email = this.dataset.userEmail; const st = this.value;
                    const orders = Storage.safeGet(Storage.KEYS.ORDERS(email), []);
                    const idx = orders.findIndex(o => o.id === oid);
                    if (idx > -1) {
                        orders[idx].status = st;
                        Storage.safeSet(Storage.KEYS.ORDERS(email), orders);
                        showToast(`Order #${oid} → ${st}`, 'success');
                    }
                });
            });
        } else if (panel === 'users') {
            const users = Storage.getUsers();
            content.innerHTML = `
                <div class="flex justify-between items-center mb-5 flex-wrap gap-3">
                    <div><h3 class="text-xl font-bold flex items-center gap-2"><i class="fas fa-users text-brand-600"></i> Users</h3><p class="text-slate-400 text-sm">${users.length} registered users</p></div>
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-auto max-h-[500px]">
                    <table class="w-full text-sm">
                        <thead class="bg-slate-50 dark:bg-slate-900 sticky top-0">
                            <tr><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Name</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Email</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Phone</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Role</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Orders</th><th class="px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Joined</th></tr>
                        </thead>
                        <tbody>${users.map(u => {
                            const orders = Storage.safeGet(Storage.KEYS.ORDERS(u.email), []);
                            return `<tr class="border-b border-slate-200 dark:border-slate-700 hover:bg-brand-50 dark:hover:bg-brand-900/10"><td class="px-4 py-3">${escapeHtml(u.name)}</td><td class="px-4 py-3">${escapeHtml(u.email)}</td><td class="px-4 py-3">${escapeHtml(u.phone || '—')}</td><td class="px-4 py-3"><span class="inline-block px-2 py-0.5 rounded-full text-[0.68rem] font-bold uppercase ${u.role === 'admin' ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white' : 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300'}">${u.role || 'customer'}</span></td><td class="px-4 py-3">${orders.length}</td><td class="px-4 py-3">${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td></tr>`;
                        }).join('')}</tbody>
                    </table>
                </div>
            `;
        }
    }
    function renderAdminProducts(products) {
        const tbody = $('#adminProductTableBody'); if (!tbody) return;
        tbody.innerHTML = products.map(p => `
            <tr class="border-b border-slate-200 dark:border-slate-700 hover:bg-brand-50 dark:hover:bg-brand-900/10">
                <td class="px-4 py-3"><img src="${p.image}" class="w-10 h-10 object-cover rounded-lg"></td>
                <td class="px-4 py-3 font-semibold">${escapeHtml(p.name)}</td>
                <td class="px-4 py-3">${p.category}</td>
                <td class="px-4 py-3 font-semibold">$${p.price.toFixed(2)}</td>
                <td class="px-4 py-3">${p.stock}</td>
                <td class="px-4 py-3"><div class="flex gap-1.5">
                    <button class="admin-btn-icon edit w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 hover:bg-brand-600 hover:text-white flex items-center justify-center transition text-xs" data-id="${p.id}"><i class="fas fa-edit"></i></button>
                    <button class="admin-btn-icon delete w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition text-xs" data-id="${p.id}"><i class="fas fa-trash"></i></button>
                </div></td>
            </tr>
        `).join('') || '<tr><td colspan="6" class="text-center py-8 text-slate-400">No products</td></tr>';
        tbody.querySelectorAll('.admin-btn-icon.edit').forEach(b => b.addEventListener('click', function() { openProductForm(parseInt(this.dataset.id)); }));
        tbody.querySelectorAll('.admin-btn-icon.delete').forEach(b => b.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            if (confirm('Delete this product?')) {
                PRODUCTS = PRODUCTS.filter(p => p.id !== id);
                saveAll(); updateAdminCounts();
                renderAdminProducts(PRODUCTS);
                rerenderAll();
                showToast('Product deleted', 'success');
            }
        }));
    }
    function openProductForm(id = null) {
        const modal = $('#productFormModal'); const form = $('#productForm');
        if (!modal || !form) return;
        form.reset(); $('#productFormId').value = '';
        if (id) {
            const p = PRODUCTS.find(x => x.id === id); if (!p) return;
            $('#productFormTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Product';
            $('#productFormId').value = p.id;
            $('#productFormName').value = p.name;
            $('#productFormDesc').value = p.desc;
            $('#productFormPrice').value = p.price;
            $('#productFormOldPrice').value = p.oldPrice || '';
            $('#productFormStock').value = p.stock;
            $('#productFormCategory').value = p.category;
            $('#productFormImage').value = p.image;
        } else {
            $('#productFormTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Add Product';
        }
        modal.classList.remove('hidden'); modal.classList.add('flex');
    }
    function closeProductForm() { const m = $('#productFormModal'); m.classList.add('hidden'); m.classList.remove('flex'); }
    function saveProduct(e) {
        e.preventDefault();
        const id = $('#productFormId').value;
        const data = {
            name: $('#productFormName').value.trim(),
            desc: $('#productFormDesc').value.trim(),
            price: parseFloat($('#productFormPrice').value),
            oldPrice: parseFloat($('#productFormOldPrice').value) || null,
            stock: parseInt($('#productFormStock').value),
            category: $('#productFormCategory').value,
            image: $('#productFormImage').value.trim()
        };
        if (!data.name || !data.price || isNaN(data.stock) || !data.image) { showToast('Please fill all required fields', 'error'); return; }
        if (id) {
            const idx = PRODUCTS.findIndex(p => p.id === parseInt(id));
            if (idx > -1) { PRODUCTS[idx] = { ...PRODUCTS[idx], ...data }; showToast('Product updated!', 'success'); }
        } else {
            data.id = Date.now(); data.rating = 4.5; data.reviewCount = 0;
            PRODUCTS.push(data); showToast('Product added!', 'success');
        }
        saveAll(); updateAdminCounts();
        renderAdminProducts(PRODUCTS);
        rerenderAll();
        closeProductForm();
    }

    /* SEARCH */
    function handleSearch(q) {
        const box = $('#searchSuggestions'); if (!box) return;
        if (!q.trim()) { box.classList.add('hidden'); return; }
        const query = q.toLowerCase();
        const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query)).slice(0, 6);
        if (matches.length === 0) {
            box.innerHTML = `<div class="p-5 text-center text-slate-400 text-sm">No results for "${escapeHtml(q)}"</div>`;
        } else {
            box.innerHTML = matches.map(p => `
                <div class="suggestion-item flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-900/30 transition" data-id="${p.id}">
                    <img src="${p.image}" class="w-9 h-9 object-cover rounded-lg">
                    <div>
                        <div class="font-medium text-sm">${escapeHtml(p.name)}</div>
                        <div class="font-semibold text-xs text-brand-600 dark:text-brand-400">$${p.price.toFixed(2)}</div>
                    </div>
                </div>
            `).join('');
            box.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', function() {
                    const id = parseInt(this.dataset.id);
                    const prod = PRODUCTS.find(p => p.id === id);
                    if (prod) showCategory(prod.category);
                    box.classList.add('hidden');
                    $('#searchInput').value = '';
                });
            });
        }
        box.classList.remove('hidden');
    }

    /* INIT */
    function init() {
        rerenderAll();
        updateCartUI();
        updateWishlistUI();
        updateCategoryCounts();

        // Flash timer
        const endTime = Date.now() + 8 * 3600000 + 45 * 60000;
        setInterval(() => {
            const d = endTime - Date.now(); if (d < 0) return;
            if ($('#flashHours')) $('#flashHours').textContent = String(Math.floor(d / 3600000)).padStart(2, '0');
            if ($('#flashMinutes')) $('#flashMinutes').textContent = String(Math.floor(d % 3600000 / 60000)).padStart(2, '0');
            if ($('#flashSeconds')) $('#flashSeconds').textContent = String(Math.floor(d % 60000 / 1000)).padStart(2, '0');
        }, 1000);

        // Categories
        $$('.category-card').forEach(c => c.addEventListener('click', function() { showCategory(this.dataset.category); }));
        $('#backFromCategory')?.addEventListener('click', hideCategoryPage);

        // Category sort
        $('#categorySort')?.addEventListener('change', function() {
            currentSort = this.value;
            if (currentCategory) renderCategoryGrid(getSortedCategoryItems(currentCategory, currentSort));
        });

        // Home
        $('#homeLink')?.addEventListener('click', function() {
            if (!$('#categoryPage').classList.contains('hidden')) hideCategoryPage();
            if (!$('#dashboardWrapper').classList.contains('hidden')) hideDashboard();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Search
        $('#searchInput')?.addEventListener('input', function() { handleSearch(this.value); });
        $('#searchToggle')?.addEventListener('click', function(e) {
            e.stopPropagation();
            const w = $('#searchWrapper');
            if (!w) return;
            if (w.classList.contains('hidden')) {
                w.classList.remove('hidden');
                w.classList.add('absolute', 'top-full', 'left-0', 'right-0', 'p-3', 'bg-white', 'dark:bg-slate-800', 'border-b', 'border-slate-200', 'z-30');
                setTimeout(() => $('#searchInput')?.focus(), 100);
            } else {
                w.classList.add('hidden');
                w.classList.remove('absolute', 'top-full', 'left-0', 'right-0', 'p-3', 'bg-white', 'dark:bg-slate-800', 'border-b', 'border-slate-200', 'z-30');
            }
        });
        document.addEventListener('click', e => {
            if (!e.target.closest('#searchWrapper') && !e.target.closest('#searchToggle')) {
                $('#searchSuggestions')?.classList.add('hidden');
            }
        });

        // Cart
        $('#cartOpen')?.addEventListener('click', () => { $('#cartSidebar').classList.remove('translate-x-full'); $('#cartOverlay').classList.remove('hidden'); });
        $('#cartClose')?.addEventListener('click', () => { $('#cartSidebar').classList.add('translate-x-full'); $('#cartOverlay').classList.add('hidden'); });
        $('#cartOverlay')?.addEventListener('click', () => { $('#cartSidebar').classList.add('translate-x-full'); $('#cartOverlay').classList.add('hidden'); });
        $('#checkoutBtn')?.addEventListener('click', checkout);

        // Global event delegation for product & cart buttons
        document.addEventListener('click', function(e) {
            const addBtn = e.target.closest('.add-cart');
            if (addBtn) { e.preventDefault(); e.stopPropagation(); if (!addBtn.disabled) addToCart(parseInt(addBtn.dataset.id)); return; }
            const wishBtn = e.target.closest('.wishlist-btn');
            if (wishBtn) { e.preventDefault(); e.stopPropagation(); toggleWishlist(parseInt(wishBtn.dataset.id)); return; }
            const wlAdd = e.target.closest('.wl-add');
            if (wlAdd) { e.preventDefault(); addToCart(parseInt(wlAdd.dataset.id)); return; }
            const wlRemove = e.target.closest('.wl-remove');
            if (wlRemove) { e.preventDefault(); toggleWishlist(parseInt(wlRemove.dataset.id)); renderDashboardPage('wishlist'); return; }
            const qtyDec = e.target.closest('.qty-dec');
            if (qtyDec) { updateQty(parseInt(qtyDec.dataset.id), -1); return; }
            const qtyInc = e.target.closest('.qty-inc');
            if (qtyInc) { updateQty(parseInt(qtyInc.dataset.id), 1); return; }
            const cartRemove = e.target.closest('.cart-item-remove');
            if (cartRemove) { removeFromCart(parseInt(cartRemove.dataset.id)); return; }
        });

        // Wishlist open
        $('#wishlistOpen')?.addEventListener('click', () => {
            if (wishlist.length === 0) { showToast('Wishlist is empty', 'info'); return; }
            if (!Guards.requireAuth()) return;
            showDashboard();
            setTimeout(() => {
                $$('.dash-nav-item').forEach(i => i.dataset.active = i.dataset.page === 'wishlist' ? 'true' : 'false');
                renderDashboardPage('wishlist');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        });
        $('#compareOpen')?.addEventListener('click', () => showToast('Compare coming soon', 'info'));

        // Theme toggle
        $('#themeToggle')?.addEventListener('click', function(e) {
            e.preventDefault(); e.stopPropagation();
            const isDark = document.documentElement.classList.contains('dark');
            if (isDark) { document.documentElement.classList.remove('dark'); theme = 'light'; }
            else { document.documentElement.classList.add('dark'); theme = 'dark'; }
            Storage.safeSet(Storage.KEYS.THEME, theme);
        });

        // Dashboard nav items
        $$('.dash-nav-item[data-page]').forEach(i => i.addEventListener('click', function() {
            $$('.dash-nav-item').forEach(x => x.dataset.active = 'false');
            this.dataset.active = 'true';
            renderDashboardPage(this.dataset.page);
        }));
        $('#logoutSidebarBtn')?.addEventListener('click', () => { Auth.logoutUser(); hideDashboard(); showToast('Signed out successfully', 'info'); });

        // Mobile dashboard sidebar toggle
        document.addEventListener('click', function(e) {
            if (e.target.closest('[data-toggle-dash-sidebar]')) {
                const sidebar = $('#dashboardSidebar'); const overlay = $('#sidebarOverlay');
                if (sidebar && overlay) {
                    sidebar.classList.toggle('-translate-x-full');
                    sidebar.classList.toggle('translate-x-0');
                    overlay.style.display = sidebar.classList.contains('translate-x-0') ? 'block' : 'none';
                }
            }
        });
        $('#sidebarOverlay')?.addEventListener('click', function() {
            $('#dashboardSidebar')?.classList.add('-translate-x-full');
            $('#dashboardSidebar')?.classList.remove('translate-x-0');
            this.style.display = 'none';
        });

        // Admin
        $('#adminClose')?.addEventListener('click', closeAdmin);
        $('#adminModal')?.addEventListener('click', function(e) { if (e.target === this) closeAdmin(); });
        $$('.admin-nav-item[data-panel]').forEach(i => i.addEventListener('click', function() { renderAdminPanel(this.dataset.panel); }));
        $('#productForm')?.addEventListener('submit', saveProduct);
        $('#productFormCancel')?.addEventListener('click', closeProductForm);
        $('#productFormModal')?.addEventListener('click', function(e) { if (e.target === this) closeProductForm(); });

        // Mobile
        $('#hamburgerBtn')?.addEventListener('click', function() {
            const m = $('#mobileMenu');
            m.classList.toggle('hidden');
            m.classList.toggle('flex');
            this.querySelector('i').className = !m.classList.contains('hidden') ? 'fas fa-times' : 'fas fa-bars';
        });
        $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => {
            $('#mobileMenu').classList.add('hidden');
            $('#mobileMenu').classList.remove('flex');
            $('#hamburgerBtn').querySelector('i').className = 'fas fa-bars';
        }));
        $('#mobileSignIn')?.addEventListener('click', () => { AuthUI.openAuthModalUI('login'); $('#mobileMenu').classList.add('hidden'); });
        $('#mobileSignUp')?.addEventListener('click', () => { AuthUI.openAuthModalUI('signup'); $('#mobileMenu').classList.add('hidden'); });

        // Guest nav
        $('#navLoginBtn')?.addEventListener('click', () => AuthUI.openAuthModalUI('login'));
        $('#navSignupBtn')?.addEventListener('click', () => AuthUI.openAuthModalUI('signup'));

        // Dropdown actions
        $('#ddDashboard')?.addEventListener('click', () => { if (Guards.requireAuth()) showDashboard(); });
        $('#ddProfile')?.addEventListener('click', () => {
            if (!Guards.requireAuth()) return;
            showDashboard();
            setTimeout(() => {
                $$('.dash-nav-item').forEach(i => i.dataset.active = i.dataset.page === 'profile' ? 'true' : 'false');
                renderDashboardPage('profile');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        });
        $('#ddOrders')?.addEventListener('click', () => {
            if (!Guards.requireAuth()) return;
            showDashboard();
            setTimeout(() => {
                $$('.dash-nav-item').forEach(i => i.dataset.active = i.dataset.page === 'orders' ? 'true' : 'false');
                renderDashboardPage('orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        });
        $('#ddWishlist')?.addEventListener('click', () => {
            if (!Guards.requireAuth()) return;
            showDashboard();
            setTimeout(() => {
                $$('.dash-nav-item').forEach(i => i.dataset.active = i.dataset.page === 'wishlist' ? 'true' : 'false');
                renderDashboardPage('wishlist');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        });
        $('#ddAdminPanel')?.addEventListener('click', () => { if (Guards.requireRole('admin')) openAdmin(); });
        $('#ddLogout')?.addEventListener('click', () => { Auth.logoutUser(); hideDashboard(); showToast('Signed out successfully', 'info'); });

        // Nav links
        $('#dashboardNav')?.addEventListener('click', function(e) { e.preventDefault(); if (Guards.requireAuth()) showDashboard(); });
        $('#adminNav')?.addEventListener('click', function(e) { e.preventDefault(); if (Guards.requireRole('admin')) openAdmin(); });
        $('#mobileDashboardNav')?.addEventListener('click', function(e) { e.preventDefault(); if (Guards.requireAuth()) showDashboard(); $('#mobileMenu').classList.add('hidden'); });
        $('#mobileAdminNav')?.addEventListener('click', function(e) { e.preventDefault(); if (Guards.requireRole('admin')) openAdmin(); $('#mobileMenu').classList.add('hidden'); });

        $('#newsletterForm')?.addEventListener('submit', function(e) { e.preventDefault(); showToast('Subscribed!', 'success'); this.reset(); });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (!$('#cartSidebar').classList.contains('translate-x-full')) { $('#cartSidebar').classList.add('translate-x-full'); $('#cartOverlay').classList.add('hidden'); }
                if (!$('#adminModal').classList.contains('hidden')) closeAdmin();
                if (!$('#productFormModal').classList.contains('hidden')) closeProductForm();
                if (!$('#authModal').classList.contains('hidden')) AuthUI.closeAuthModalUI();
            }
        });

        window.addEventListener('scroll', function() {
            const h = $('#mainHeader');
            if (window.pageYOffset > 20) h?.classList.add('shadow-lg');
            else h?.classList.remove('shadow-lg');
        });
    }

    return { init, showDashboard, hideDashboard, openAdmin, closeAdmin };
})();

/* ============================================================
   HELPERS
   ============================================================ */
function showToast(msg, type = 'success') {
    const c = document.getElementById('toastContainer'); if (!c) return;
    const icons = { success: 'fa-check-circle text-green-500', error: 'fa-exclamation-circle text-red-500', warning: 'fa-exclamation-triangle text-amber-500', info: 'fa-info-circle text-brand-500' };
    const t = document.createElement('div');
    t.className = `bg-white dark:bg-slate-800 p-3.5 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-sm font-medium pointer-events-auto animate-slideInRight`;
    t.innerHTML = `<i class="fas ${icons[type]}"></i><span class="flex-1">${msg}</span>`;
    c.appendChild(t);
    setTimeout(() => { t.classList.add('animate-slideOutRight'); setTimeout(() => t.remove(), 300); }, 3200);
}

function updateAuthUI() {
    const user = Auth.getCurrentUser();
    const guest = document.getElementById('authActionsGuest');
    const avatar = document.getElementById('userAvatar');
    const dropdown = document.getElementById('userDropdown');
    const dashNav = document.getElementById('dashboardNav');
    const adminNav = document.getElementById('adminNav');
    const mDash = document.getElementById('mobileDashboardNav');
    const mAdmin = document.getElementById('mobileAdminNav');

    if (!user) {
        if (guest) { guest.style.display = 'flex'; }
        if (avatar) avatar.style.display = 'none';
        if (dropdown) dropdown.style.display = 'none';
        if (dashNav) dashNav.style.display = 'none';
        if (adminNav) adminNav.style.display = 'none';
        if (mDash) mDash.style.display = 'none';
        if (mAdmin) mAdmin.style.display = 'none';
        return;
    }
    if (guest) guest.style.display = 'none';
    if (avatar) avatar.style.display = 'flex';
    if (dropdown) dropdown.style.display = 'block';
    if (dashNav) dashNav.style.display = 'inline-block';
    if (mDash) mDash.style.display = 'block';
    if (adminNav) adminNav.style.display = user.role === 'admin' ? 'inline-block' : 'none';
    if (mAdmin) mAdmin.style.display = user.role === 'admin' ? 'block' : 'none';

    const initials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const el = (id) => document.getElementById(id);
    if (el('avatarInitials')) el('avatarInitials').textContent = initials;
    if (el('userNameDisplay')) el('userNameDisplay').textContent = user.name.split(' ')[0];
    if (el('dropdownName')) el('dropdownName').textContent = user.name;
    if (el('dropdownEmail')) el('dropdownEmail').textContent = user.email;
    if (el('dropdownRole')) el('dropdownRole').textContent = user.role;
    if (el('ddAdminPanel')) el('ddAdminPanel').style.display = user.role === 'admin' ? 'flex' : 'none';
    if (el('ddAdminDivider')) el('ddAdminDivider').style.display = user.role === 'admin' ? 'block' : 'none';
}

/* ============================================================
   BOOTSTRAP
   ============================================================ */
function bootstrap() {
    AuthUI.init();
    App.init();
    Auth.subscribe(updateAuthUI);
    updateAuthUI();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootstrap);
else bootstrap();
