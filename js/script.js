/* ============================================================
   FurniCraft — app.js
   All application logic
   ============================================================ */

/* ============================================================
   MODULE 1: STORAGE
   ============================================================ */
const Storage = (() => {
    const KEYS = {
        USERS: 'furni_users', SESSION: 'furni_session', ATTEMPTS: 'furni_login_attempts',
        CART: 'furni_cart', WISHLIST: 'furni_wishlist', PRODUCTS: 'furni_products_v9',
        THEME: 'furni_theme', FILTER: 'furni_filter', REVIEWS: 'furni_reviews',
        CURRENCY: 'furni_currency', COUPON: 'furni_coupon', COMPARE: 'furni_compare', RECENT: 'furni_recent',
        POINTS: (e) => `furni_points_${e}`, ORDERS: (e) => `furni_orders_${e}`
    };
    function safeGet(key, fallback = null) {
        try { const raw = localStorage.getItem(key); if (raw === null) return fallback; return JSON.parse(raw); }
        catch (err) { try { localStorage.removeItem(key); } catch (_) { } return fallback; }
    }
    function safeSet(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (err) { return false; } }
    function safeRemove(key) { try { localStorage.removeItem(key); } catch (_) { } }
    return {
        KEYS, safeGet, safeSet, safeRemove,
        getUsers: () => { const u = safeGet(KEYS.USERS, []); return Array.isArray(u) ? u : []; },
        setUsers: (u) => safeSet(KEYS.USERS, Array.isArray(u) ? u : []),
        getSession: () => { const s = safeGet(KEYS.SESSION, null); if (!s || typeof s !== 'object') return null; if (!s.id || !s.email || !s.role) return null; return s; },
        setSession: (s) => safeSet(KEYS.SESSION, s),
        clearSession: () => safeRemove(KEYS.SESSION),
        getAttempts: () => safeGet(KEYS.ATTEMPTS, { count: 0, lockedUntil: 0 }),
        setAttempts: (a) => safeSet(KEYS.ATTEMPTS, a),
        clearAttempts: () => safeRemove(KEYS.ATTEMPTS)
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
        else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Enter a valid email.';
        if (!password) errors.password = 'Password is required.';
        return { isValid: Object.keys(errors).length === 0, errors };
    }
    function validateSignup({ name, email, phone, password, confirmPassword, terms }) {
        const errors = {};
        if (!name || !name.trim()) errors.name = 'Full name is required.';
        else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
        if (!email || !email.trim()) errors.email = 'Email is required.';
        else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Enter a valid email.';
        if (!phone || !phone.trim()) errors.phone = 'Phone is required.';
        else if (!PHONE_REGEX.test(phone.trim())) errors.phone = 'Enter a valid phone.';
        if (!password) errors.password = 'Password is required.';
        else if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
        else if (!/[A-Z]/.test(password)) errors.password = 'Must contain an uppercase letter.';
        else if (!/[a-z]/.test(password)) errors.password = 'Must contain a lowercase letter.';
        else if (!/\d/.test(password)) errors.password = 'Must contain a number.';
        if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.';
        else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
        if (!terms) errors.terms = 'You must accept the terms.';
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
    function notify() { listeners.forEach(fn => { try { fn(currentUser); } catch (e) { } }); }
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
        if (!A.hasRole(role)) { showToast("You don't have permission.", 'error'); return false; }
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
            showToast(`Welcome, ${result.user.name.split(' ')[0]}!`, 'success');
            closeAuthModalUI();
            if (typeof window.showDashboard === 'function') window.showDashboard();
        } finally { setLoading('signupSubmitBtn', false); }
    }
    function handleForgotSubmit(e) {
        e.preventDefault(); clearErrors('forgotFormElement');
        const email = $('#forgotEmail')?.value || '';
        if (!email.trim()) { setError('forgotEmail', 'Email is required.'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('forgotEmail', 'Enter a valid email.'); return; }
        showToast('Demo mode: reset not available.', 'info');
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
        $$('.toggle-pwd').forEach(btn => btn.addEventListener('click', () => {
            const t = btn.dataset.target; const ic = btn.querySelector('i');
            if (t) togglePassword(t, ic);
        }));
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
   MODULE 7: MAIN APP
   ============================================================ */
const App = (() => {
    const DEFAULT_PRODUCTS = [
        { id: 101, name: 'Luxury Velvet Sofa', price: 899.99, oldPrice: 1299.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'], desc: 'Elegant velvet with premium cushioning.', rating: 4.8, reviewCount: 124, isNew: true, stock: 15, category: 'living', tags: ['bestseller', 'limited'] },
        { id: 102, name: 'Modern Armchair', price: 349.99, oldPrice: 449.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', desc: 'Ergonomic design with stylish fabric.', rating: 4.6, reviewCount: 89, stock: 3, category: 'living', tags: ['eco'] },
        { id: 103, name: 'Sectional Sofa L-Shape', price: 1299.99, oldPrice: 1699.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', desc: 'Spacious L-shaped sectional.', rating: 4.8, reviewCount: 45, stock: 5, category: 'living', tags: ['bestseller'] },
        { id: 104, name: 'Coffee Table Glass', price: 299.99, oldPrice: 399.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?auto=format&fit=crop&w=800&q=80', desc: 'Minimalist wood and tempered glass.', rating: 4.5, reviewCount: 32, stock: 12, category: 'living', tags: [] },
        { id: 105, name: 'Recliner Lounge Chair', price: 549.99, image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=800&q=80', desc: 'Push-back recliner with footrest.', rating: 4.7, reviewCount: 51, stock: 7, category: 'living', tags: ['limited'] },
        { id: 106, name: 'TV Media Console', price: 429.99, oldPrice: 549.99, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80', desc: 'Walnut finish with cable management.', rating: 4.6, reviewCount: 28, stock: 9, category: 'living', tags: [] },
        { id: 107, name: 'Accent Side Table', price: 129.99, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80', desc: 'Round marble-top side table.', rating: 4.4, reviewCount: 19, stock: 22, category: 'living', tags: [] },
        { id: 108, name: 'Bookshelf 5-Tier', price: 249.99, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=80', desc: 'Industrial-style open shelving.', rating: 4.7, reviewCount: 41, stock: 11, category: 'living', tags: ['eco'] },
        { id: 109, name: 'Rocking Chair Oak', price: 279.99, image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80', desc: 'Handcrafted solid oak rocker.', rating: 4.9, reviewCount: 63, isNew: true, stock: 6, category: 'living', tags: ['bestseller'] },
        { id: 110, name: 'Ottoman Storage Cube', price: 159.99, oldPrice: 199.99, image: 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=800&q=80', desc: 'Hidden storage with tufted top.', rating: 4.5, reviewCount: 24, stock: 14, category: 'living', tags: ['eco'] },
        { id: 201, name: 'Minimalist Bed Frame', price: 749.99, oldPrice: 999.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80', desc: 'Clean lines, sturdy construction.', rating: 4.7, reviewCount: 156, stock: 8, category: 'bedroom', tags: ['bestseller'] },
        { id: 202, name: 'King Upholstered Bed', price: 999.99, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', desc: 'Linen headboard with wingback.', rating: 4.9, reviewCount: 78, isNew: true, stock: 6, category: 'bedroom', tags: ['limited', 'bestseller'] },
        { id: 203, name: '3-Door Wardrobe', price: 849.99, oldPrice: 1099.99, image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80', desc: 'Spacious with mirror panel.', rating: 4.6, reviewCount: 54, stock: 4, category: 'bedroom', tags: [] },
        { id: 204, name: 'Nightstand Walnut', price: 179.99, image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80', desc: 'Two-drawer with brass handles.', rating: 4.7, reviewCount: 37, stock: 18, category: 'bedroom', tags: ['eco'] },
        { id: 205, name: 'Dresser 6-Drawer', price: 599.99, oldPrice: 749.99, image: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?auto=format&fit=crop&w=800&q=80', desc: 'Soft-close drawers, oak finish.', rating: 4.8, reviewCount: 42, stock: 7, category: 'bedroom', tags: [] },
        { id: 206, name: 'Vanity Table Set', price: 399.99, image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80', desc: 'Includes stool and LED mirror.', rating: 4.5, reviewCount: 29, isNew: true, stock: 5, category: 'bedroom', tags: ['limited'] },
        { id: 207, name: 'Platform Bed Queen', price: 649.99, image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80', desc: 'Low-profile with slat base.', rating: 4.6, reviewCount: 33, stock: 10, category: 'bedroom', tags: [] },
        { id: 208, name: 'Canopy Bed Frame', price: 1199.99, oldPrice: 1499.99, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', desc: 'Four-poster canopy design.', rating: 4.9, reviewCount: 22, stock: 3, category: 'bedroom', tags: ['limited'] },
        { id: 209, name: 'Storage Bench', price: 219.99, image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=800&q=80', desc: 'End-of-bed storage bench.', rating: 4.5, reviewCount: 18, stock: 13, category: 'bedroom', tags: ['eco'] },
        { id: 210, name: 'Wall Mirror Round', price: 139.99, image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80', desc: 'Brass-framed 30" round mirror.', rating: 4.8, reviewCount: 47, stock: 20, category: 'bedroom', tags: [] },
        { id: 301, name: 'Oak Dining Table', price: 599.99, oldPrice: 799.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80', desc: 'Solid oak, extendable for gatherings.', rating: 4.9, reviewCount: 67, isNew: true, stock: 8, category: 'dining', tags: ['bestseller'] },
        { id: 302, name: 'Marble Dining Table', price: 1299.99, oldPrice: 1599.99, image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80', desc: 'Italian marble top, gold base.', rating: 4.9, reviewCount: 31, stock: 4, category: 'dining', tags: ['limited'] },
        { id: 303, name: 'Dining Chair Set of 2', price: 249.99, image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80', desc: 'Upholstered with wooden legs.', rating: 4.6, reviewCount: 58, stock: 16, category: 'dining', tags: ['eco'] },
        { id: 304, name: 'Bar Stool Set of 3', price: 329.99, oldPrice: 429.99, image: 'https://images.unsplash.com/photo-1502301197179-65228ab57f78?auto=format&fit=crop&w=800&q=80', desc: 'Adjustable height, swivel seat.', rating: 4.5, reviewCount: 44, stock: 12, category: 'dining', tags: [] },
        { id: 305, name: 'Sideboard Buffet', price: 749.99, image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80', desc: 'Four-door storage with wine rack.', rating: 4.8, reviewCount: 26, stock: 6, category: 'dining', tags: [] },
        { id: 306, name: 'Round Bistro Table', price: 279.99, image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?auto=format&fit=crop&w=800&q=80', desc: 'Compact for small spaces.', rating: 4.5, reviewCount: 21, stock: 15, category: 'dining', tags: ['eco'] },
        { id: 307, name: 'Glass Dining Table', price: 899.99, oldPrice: 1099.99, image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80', desc: 'Tempered glass with chrome base.', rating: 4.7, reviewCount: 39, isNew: true, stock: 5, category: 'dining', tags: [] },
        { id: 308, name: 'Bench Dining Seat', price: 189.99, image: 'https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=800&q=80', desc: 'Solid wood dining bench.', rating: 4.6, reviewCount: 27, stock: 14, category: 'dining', tags: ['eco'] },
        { id: 309, name: 'China Cabinet', price: 1099.99, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80', desc: 'Glass-front display cabinet.', rating: 4.7, reviewCount: 15, stock: 3, category: 'dining', tags: ['limited'] },
        { id: 310, name: 'Counter Height Table', price: 549.99, oldPrice: 699.99, image: 'https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=800&q=80', desc: 'Pub-style with storage shelf.', rating: 4.5, reviewCount: 22, stock: 9, category: 'dining', tags: [] },
        { id: 401, name: 'Ergonomic Chair Pro', price: 499.99, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80', desc: 'Adjustable lumbar support.', rating: 4.9, reviewCount: 88, isNew: true, stock: 8, category: 'office', tags: ['bestseller'] },
        { id: 402, name: 'Executive Desk', price: 799.99, oldPrice: 999.99, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80', desc: 'Large L-shaped with drawers.', rating: 4.8, reviewCount: 44, stock: 5, category: 'office', tags: [] },
        { id: 403, name: 'Standing Desk Electric', price: 649.99, image: 'https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&w=800&q=80', desc: 'Height-adjustable, memory presets.', rating: 4.9, reviewCount: 72, isNew: true, stock: 7, category: 'office', tags: ['bestseller'] },
        { id: 404, name: 'Bookshelf Office', price: 199.99, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=80', desc: '5-shelf open bookcase.', rating: 4.6, reviewCount: 35, stock: 18, category: 'office', tags: ['eco'] },
        { id: 405, name: 'Filing Cabinet 3-Drawer', price: 229.99, oldPrice: 289.99, image: 'https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=800&q=80', desc: 'Lockable with smooth slides.', rating: 4.5, reviewCount: 29, stock: 12, category: 'office', tags: [] },
        { id: 406, name: 'Guest Chair Set of 2', price: 279.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80', desc: 'Stackable reception chairs.', rating: 4.4, reviewCount: 17, stock: 20, category: 'office', tags: ['eco'] },
        { id: 407, name: 'Desk Organizer Set', price: 49.99, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', desc: 'Bamboo desktop organizer.', rating: 4.7, reviewCount: 52, stock: 40, category: 'office', tags: ['eco'] },
        { id: 408, name: 'Conference Table', price: 1499.99, image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80', desc: '8-seat meeting table.', rating: 4.8, reviewCount: 11, stock: 2, category: 'office', tags: ['limited'] },
        { id: 409, name: 'Monitor Stand Riser', price: 79.99, image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80', desc: 'Walnut with storage drawer.', rating: 4.6, reviewCount: 38, stock: 25, category: 'office', tags: ['eco'] },
        { id: 410, name: 'Footrest Under Desk', price: 59.99, oldPrice: 79.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', desc: 'Adjustable ergonomic footrest.', rating: 4.5, reviewCount: 24, stock: 30, category: 'office', tags: [] },
        { id: 501, name: 'Brass Pendant Light', price: 199.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', desc: 'Brass pendant with glass shade.', rating: 4.8, reviewCount: 46, isNew: true, stock: 10, category: 'lighting', tags: ['bestseller'] },
        { id: 502, name: 'Floor Lamp Arc', price: 249.99, oldPrice: 329.99, image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80', desc: 'Chrome arc with marble base.', rating: 4.7, reviewCount: 33, stock: 8, category: 'lighting', tags: [] },
        { id: 503, name: 'Table Lamp Ceramic', price: 89.99, image: 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=800&q=80', desc: 'Hand-glazed ceramic base.', rating: 4.6, reviewCount: 41, stock: 22, category: 'lighting', tags: ['eco'] },
        { id: 504, name: 'Chandelier Crystal', price: 599.99, oldPrice: 799.99, image: 'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?auto=format&fit=crop&w=800&q=80', desc: '6-arm crystal chandelier.', rating: 4.9, reviewCount: 19, stock: 4, category: 'lighting', tags: ['limited'] },
        { id: 505, name: 'Wall Sconce Pair', price: 129.99, image: 'https://images.unsplash.com/photo-1565636192335-3a5f8e1d1e5b?auto=format&fit=crop&w=800&q=80', desc: 'Set of 2 modern wall sconces.', rating: 4.5, reviewCount: 27, stock: 16, category: 'lighting', tags: [] },
        { id: 506, name: 'LED Strip Smart', price: 39.99, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', desc: '16ft RGB with app control.', rating: 4.7, reviewCount: 88, isNew: true, stock: 50, category: 'lighting', tags: ['bestseller'] },
        { id: 507, name: 'Desk Lamp LED', price: 69.99, oldPrice: 89.99, image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=800&q=80', desc: 'Dimmable with USB port.', rating: 4.6, reviewCount: 62, stock: 24, category: 'lighting', tags: [] },
        { id: 508, name: 'Ceiling Flush Mount', price: 149.99, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', desc: 'Modern flush-mount ceiling light.', rating: 4.4, reviewCount: 18, stock: 14, category: 'lighting', tags: [] },
        { id: 509, name: 'Outdoor String Lights', price: 49.99, image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=80', desc: 'Weatherproof 48ft Edison bulbs.', rating: 4.8, reviewCount: 71, stock: 35, category: 'lighting', tags: ['bestseller', 'eco'] },
        { id: 510, name: 'Picture Light', price: 79.99, image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80', desc: 'Adjustable art display light.', rating: 4.5, reviewCount: 14, stock: 19, category: 'lighting', tags: [] },
        { id: 601, name: 'Ceramic Vase Set', price: 49.99, image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80', desc: 'Set of 3 matte ceramic vases.', rating: 4.6, reviewCount: 28, isNew: true, stock: 25, category: 'decor', tags: ['eco'] },
        { id: 602, name: 'Abstract Wall Art', price: 129.99, oldPrice: 169.99, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80', desc: 'Framed canvas 24x36".', rating: 4.7, reviewCount: 35, stock: 12, category: 'decor', tags: [] },
        { id: 603, name: 'Woven Area Rug', price: 199.99, image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=800&q=80', desc: '5x8 ft jute flatweave rug.', rating: 4.5, reviewCount: 42, stock: 9, category: 'decor', tags: ['eco'] },
        { id: 604, name: 'Throw Pillow Set', price: 39.99, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80', desc: 'Set of 4 velvet covers.', rating: 4.4, reviewCount: 56, stock: 40, category: 'decor', tags: [] },
        { id: 605, name: 'Scented Candle Trio', price: 34.99, image: 'https://images.unsplash.com/photo-1602874801006-e26d5b9c0f2c?auto=format&fit=crop&w=800&q=80', desc: 'Soy wax, 3 seasonal scents.', rating: 4.8, reviewCount: 91, isNew: true, stock: 55, category: 'decor', tags: ['bestseller'] },
        { id: 606, name: 'Tabletop Fountain', price: 89.99, image: 'https://images.unsplash.com/photo-1544376664-80b17f09d399?auto=format&fit=crop&w=800&q=80', desc: 'Indoor Zen water fountain.', rating: 4.3, reviewCount: 15, stock: 8, category: 'decor', tags: [] },
        { id: 607, name: 'Wall Clock Modern', price: 59.99, oldPrice: 79.99, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80', desc: 'Silent 12" minimal clock.', rating: 4.6, reviewCount: 33, stock: 28, category: 'decor', tags: [] },
        { id: 608, name: 'Plant Pot Set', price: 44.99, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80', desc: 'Set of 3 cement planters.', rating: 4.5, reviewCount: 22, stock: 32, category: 'decor', tags: ['eco'] },
        { id: 609, name: 'Decorative Tray', price: 29.99, image: 'https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=800&q=80', desc: 'Brass mirrored serving tray.', rating: 4.7, reviewCount: 26, stock: 21, category: 'decor', tags: [] },
        { id: 610, name: 'Bookends Marble', price: 54.99, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80', desc: 'Pair of marble geometric bookends.', rating: 4.6, reviewCount: 18, stock: 17, category: 'decor', tags: [] }
    ];

    // Category definitions for home page
    const CATEGORIES = [
        { key: 'living', name: 'Living Room', icon: 'fa-couch' },
        { key: 'bedroom', name: 'Bedroom', icon: 'fa-bed' },
        { key: 'dining', name: 'Dining', icon: 'fa-utensils' },
        { key: 'office', name: 'Office', icon: 'fa-chair' },
        { key: 'lighting', name: 'Lighting', icon: 'fa-lamp' },
        { key: 'decor', name: 'Decor', icon: 'fa-rug' }
    ];

    // Ensure images + tags arrays
    DEFAULT_PRODUCTS.forEach(p => {
        if (!p.images || !Array.isArray(p.images)) p.images = [p.image];
        if (!p.tags || !Array.isArray(p.tags)) p.tags = [];
    });

    // Load or seed products
    let storedProducts = Storage.safeGet(Storage.KEYS.PRODUCTS, null);
    if (!storedProducts || !Array.isArray(storedProducts) || storedProducts.length < 30) {
        storedProducts = [...DEFAULT_PRODUCTS];
        Storage.safeSet(Storage.KEYS.PRODUCTS, storedProducts);
    } else {
        storedProducts.forEach(p => {
            if (!p.images || !Array.isArray(p.images)) p.images = [p.image];
            if (!p.tags || !Array.isArray(p.tags)) p.tags = [];
        });
    }
    let PRODUCTS = storedProducts;

    // App state
    let cart = Storage.safeGet(Storage.KEYS.CART, []);
    let wishlist = Storage.safeGet(Storage.KEYS.WISHLIST, []);
    let theme = Storage.safeGet(Storage.KEYS.THEME, 'light');
    let compareList = Storage.safeGet(Storage.KEYS.COMPARE, []);
    let recentViews = Storage.safeGet(Storage.KEYS.RECENT, []);
    let currentCategory = null;
    let currentSort = 'default';
    let currentPriceMin = null;
    let currentPriceMax = null;
    let detailProductId = null;
    let detailSize = 'medium';
    let detailQty = 1;
    let detailImageIndex = 0;
    let reviewDraftRating = 0;
    let pointsRedeem = 0;

    /* CURRENCY */
    const CURRENCIES = {
        USD: { symbol: '$', rate: 1, code: 'USD' },
        EUR: { symbol: '€', rate: 0.92, code: 'EUR' },
        GBP: { symbol: '£', rate: 0.79, code: 'GBP' },
        PKR: { symbol: '₨', rate: 278, code: 'PKR' }
    };
    let currentCurrency = Storage.safeGet(Storage.KEYS.CURRENCY, 'USD');
    if (!CURRENCIES[currentCurrency]) currentCurrency = 'USD';

    function formatPrice(usdAmount) {
        const c = CURRENCIES[currentCurrency];
        const conv = usdAmount * c.rate;
        if (c.code === 'PKR') return `${c.symbol}${Math.round(conv).toLocaleString()}`;
        return `${c.symbol}${conv.toFixed(2)}`;
    }
    function getShippingRate() {
        const thresholds = { USD: 100, EUR: 92, GBP: 79, PKR: 27800 };
        const rates = { USD: 12, EUR: 11, GBP: 9.5, PKR: 3300 };
        return { threshold: thresholds[currentCurrency] || 100, rate: rates[currentCurrency] || 12 };
    }
    function calculateShipping(subtotalUSD) {
        const { threshold, rate } = getShippingRate();
        const subInCur = subtotalUSD * CURRENCIES[currentCurrency].rate;
        if (subInCur >= threshold) return 0;
        return rate / CURRENCIES[currentCurrency].rate;
    }

    /* COUPONS */
    const COUPONS = {
        SAVE10: { type: 'percent', value: 10, permanent: true },
        WELCOME20: { type: 'percent', value: 20, permanent: true },
        FURNI15: { type: 'percent', value: 15, permanent: true },
        FREESHIP: { type: 'fixed', value: 15, permanent: true },
        FIRST15: { type: 'percent', value: 15, firstOrderOnly: true },
        SUMMER25: { type: 'percent', value: 25, expires: '2025-12-31' },
        SPRING20: { type: 'percent', value: 20, expires: '2026-03-31' }
    };
    let appliedCoupon = Storage.safeGet(Storage.KEYS.COUPON, null);

    function validateCoupon(code) {
        const c = String(code || '').trim().toUpperCase();
        if (!c) return { ok: false, error: 'Enter a coupon code.' };
        const def = COUPONS[c];
        if (!def) return { ok: false, error: 'Invalid coupon code.' };
        if (def.expires && new Date(def.expires) < new Date()) return { ok: false, error: `Coupon expired on ${new Date(def.expires).toLocaleDateString()}.` };
        if (def.firstOrderOnly) {
            const user = Auth.getCurrentUser();
            if (!user) return { ok: false, error: 'Sign in to use this coupon.' };
            if (Storage.safeGet(Storage.KEYS.ORDERS(user.email), []).length > 0) return { ok: false, error: 'This coupon is for first orders only.' };
        }
        return { ok: true, code: c, ...def };
    }
    function applyCoupon(code) {
        const r = validateCoupon(code); if (!r.ok) return r;
        appliedCoupon = { code: r.code, type: r.type, value: r.value };
        Storage.safeSet(Storage.KEYS.COUPON, appliedCoupon);
        return { ok: true };
    }
    function removeCoupon() { appliedCoupon = null; Storage.safeRemove(Storage.KEYS.COUPON); }
    function calculateCouponDiscount(subtotal) {
        if (!appliedCoupon) return 0;
        const def = COUPONS[appliedCoupon.code]; if (!def) return 0;
        if (def.expires && new Date(def.expires) < new Date()) return 0;
        if (def.type === 'percent') return subtotal * (def.value / 100);
        return Math.min(subtotal, def.value);
    }

    /* COMPARE */
    const MAX_COMPARE = 4;
    function addToCompare(id) {
        if (compareList.includes(id)) { showToast('Already in compare', 'info'); return; }
        if (compareList.length >= MAX_COMPARE) { showToast(`Max ${MAX_COMPARE} products`, 'warning'); return; }
        compareList.push(id);
        Storage.safeSet(Storage.KEYS.COMPARE, compareList);
        updateCompareUI();
        showToast('Added to compare', 'success');
    }
    function removeFromCompare(id) {
        compareList = compareList.filter(x => x !== id);
        Storage.safeSet(Storage.KEYS.COMPARE, compareList);
        updateCompareUI();
        if (!$('#comparePage').classList.contains('hidden')) renderComparePage();
    }
    function clearCompare() { compareList = []; Storage.safeSet(Storage.KEYS.COMPARE, []); updateCompareUI(); }
    function updateCompareUI() {
        const badge = $('#compareCount');
        if (badge) {
            badge.textContent = compareList.length;
            badge.classList.toggle('hidden', compareList.length === 0);
            badge.classList.toggle('flex', compareList.length > 0);
        }
        const bar = $('#compareBar'); const cnt = $('#compareBarCount'); const items = $('#compareBarItems');
        if (!bar || !cnt || !items) return;
        bar.classList.toggle('translate-y-full', compareList.length === 0);
        cnt.textContent = compareList.length;
        items.innerHTML = compareList.map(id => {
            const p = PRODUCTS.find(x => x.id === id); if (!p) return '';
            return `<div class="relative shrink-0">
                <img src="${p.image}" class="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700" alt="">
                <button class="compare-remove absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[0.6rem] flex items-center justify-center hover:bg-red-600 transition" data-id="${p.id}" aria-label="Remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>`;
        }).join('');
        items.querySelectorAll('.compare-remove').forEach(b => b.addEventListener('click', function () {
            removeFromCompare(parseInt(this.dataset.id));
        }));
    }
    function renderComparePage() {
        const content = $('#compareContent'); if (!content) return;
        const items = compareList.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
        if (items.length === 0) {
            content.innerHTML = '<div class="text-center py-12 text-slate-400"><i class="fas fa-balance-scale text-4xl mb-3 block opacity-30"></i><p>No products selected.</p></div>';
            return;
        }
        const rows = [
            { label: 'Price', render: p => `<span class="font-bold text-brand-600 dark:text-brand-400 text-lg">${formatPrice(p.price)}</span>${p.oldPrice ? ` <span class="text-xs text-slate-400 line-through">${formatPrice(p.oldPrice)}</span>` : ''}` },
            { label: 'Category', render: p => `<span class="inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">${p.category}</span>` },
            { label: 'Rating', render: p => `<div class="flex items-center gap-1 justify-center"><span class="text-amber-400 text-xs">${getStars(p.rating || 4.5)}</span><span class="text-xs text-slate-400">(${p.reviewCount || 0})</span></div>` },
            { label: 'Stock', render: p => { const ss = getStockStatus(p.stock); return `<span class="inline-block px-2 py-0.5 rounded-full text-xs font-bold ${ss.cls}">${ss.label}</span>`; } },
            { label: 'Description', render: p => `<span class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${escapeHtml(p.desc)}</span>` },
            { label: 'Sizes', render: () => `<span class="text-xs text-slate-500">S / M / L</span>` },
            { label: 'Availability', render: p => p.stock === 0 ? '<span class="text-red-500 font-bold text-xs">Out of stock</span>' : '<span class="text-green-600 font-bold text-xs">Ships in 2–5 days</span>' }
        ];
        content.innerHTML = `<table class="w-full border-collapse min-w-[600px] bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <thead><tr class="border-b border-slate-200 dark:border-slate-700">
                <th class="w-32 sm:w-40 p-3 text-left text-xs font-bold uppercase text-slate-400 sticky left-0 bg-white dark:bg-slate-800 z-10">Product</th>
                ${items.map(p => `<th class="p-3 text-center min-w-[160px]"><div class="flex flex-col items-center gap-2">
                    <img src="${p.image}" class="w-24 h-24 object-cover rounded-xl border border-slate-200 dark:border-slate-700" alt="">
                    <div class="font-bold text-xs line-clamp-2">${escapeHtml(p.name)}</div>
                    <button class="compare-remove-table text-red-500 hover:text-red-700 text-xs" data-id="${p.id}"><i class="fas fa-times-circle"></i> Remove</button>
                </div></th>`).join('')}
            </tr></thead>
            <tbody>${rows.map((r, i) => `<tr class="${i % 2 === 0 ? 'bg-slate-50 dark:bg-slate-900/50' : ''} border-b border-slate-200 dark:border-slate-700">
                <td class="p-3 text-xs font-bold uppercase text-slate-500 sticky left-0 bg-inherit z-10">${r.label}</td>
                ${items.map(p => `<td class="p-3 text-center align-middle">${r.render(p)}</td>`).join('')}
            </tr>`).join('')}
            <tr class="border-t-2 border-slate-300 dark:border-slate-600">
                <td class="p-3 sticky left-0 bg-white dark:bg-slate-800 z-10"></td>
                ${items.map(p => `<td class="p-3 text-center align-middle"><button class="compare-add-cart w-full py-2 rounded-full ${p.stock === 0 ? 'border-2 border-brand-600 text-brand-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'} font-semibold text-xs" data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}><i class="fas fa-cart-plus"></i> Add to Cart</button></td>`).join('')}
            </tr></tbody></table>`;
        content.querySelectorAll('.compare-remove-table').forEach(b => b.addEventListener('click', function () { removeFromCompare(parseInt(this.dataset.id)); }));
        content.querySelectorAll('.compare-add-cart').forEach(b => b.addEventListener('click', function () { if (!this.disabled) addToCart(parseInt(this.dataset.id)); }));
    }
    function showComparePage() {
        if (compareList.length === 0) { showToast('Add products to compare first', 'info'); return; }
        $('#mainSections').classList.add('hidden');
        document.querySelector('section.gradient-brand').classList.add('hidden');
        document.querySelector('footer').classList.add('hidden');
        $('#categoryPage').classList.add('hidden');
        $('#dashboardWrapper').classList.add('hidden');
        $('#adminPage').classList.remove('active');
        $('#comparePage').classList.remove('hidden');
        renderComparePage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function hideComparePage() {
        $('#comparePage').classList.add('hidden');
        $('#mainSections').classList.remove('hidden');
        document.querySelector('section.gradient-brand').classList.remove('hidden');
        document.querySelector('footer').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* RECENTLY VIEWED */
    const MAX_RECENT = 6;
    function trackRecentlyViewed(id) {
        recentViews = recentViews.filter(x => x !== id);
        recentViews.unshift(id);
        if (recentViews.length > MAX_RECENT) recentViews = recentViews.slice(0, MAX_RECENT);
        Storage.safeSet(Storage.KEYS.RECENT, recentViews);
    }
    function renderRecentlyViewed() {
        const section = $('#recentlyViewedSection'); const grid = $('#recentlyViewedGrid');
        if (!section || !grid) return;
        const items = recentViews.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
        if (items.length < 2) { section.classList.add('hidden'); return; }
        section.classList.remove('hidden');
        grid.innerHTML = items.map(p => `<div class="recent-card shrink-0 w-40 sm:w-48 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer" data-id="${p.id}">
            <img src="${p.image}" alt="${escapeHtml(p.name)}" class="w-full h-28 sm:h-32 object-cover" loading="lazy">
            <div class="p-3">
                <div class="font-semibold text-xs line-clamp-1">${escapeHtml(p.name)}</div>
                <div class="text-brand-600 dark:text-brand-400 font-bold text-sm mt-1">${formatPrice(p.price)}</div>
            </div>
        </div>`).join('');
        grid.querySelectorAll('.recent-card').forEach(card => card.addEventListener('click', function () {
            openProductDetail(parseInt(this.dataset.id));
        }));
    }

    /* SIZE / BULK */
    const SIZE_MULTIPLIERS = { small: 0.85, medium: 1.0, large: 1.25 };
    const BULK_DISCOUNTS = [{ min: 5, percent: 15 }, { min: 3, percent: 10 }, { min: 1, percent: 0 }];
    function getBulkDiscount(qty) {
        for (const tier of BULK_DISCOUNTS) if (qty >= tier.min) return tier;
        return BULK_DISCOUNTS[BULK_DISCOUNTS.length - 1];
    }
    function getNextBulkTier(qty) {
        const tiers = [...BULK_DISCOUNTS].sort((a, b) => a.min - b.min);
        for (const tier of tiers) if (qty < tier.min && tier.percent > 0) return tier;
        return null;
    }

    const $ = (s) => document.querySelector(s);
    const $$ = (s) => document.querySelectorAll(s);

    function saveAll() {
        Storage.safeSet(Storage.KEYS.PRODUCTS, PRODUCTS);
        Storage.safeSet(Storage.KEYS.CART, cart);
        Storage.safeSet(Storage.KEYS.WISHLIST, wishlist);
        Storage.safeSet(Storage.KEYS.THEME, theme);
    }
    function saveFilterState() {
        Storage.safeSet(Storage.KEYS.FILTER, { category: currentCategory, sort: currentSort, priceMin: currentPriceMin, priceMax: currentPriceMax });
    }
    function restoreFilterState() {
        const f = Storage.safeGet(Storage.KEYS.FILTER, null);
        if (f && f.category) setTimeout(() => showCategory(f.category, f.sort, f.priceMin, f.priceMax), 100);
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
    function getTagBadges(p) {
        const styles = {
            bestseller: { label: 'Bestseller', cls: 'bg-amber-500 text-white', icon: 'fa-fire', anim: 'icon-glow' },
            limited: { label: 'Limited', cls: 'bg-purple-500 text-white', icon: 'fa-clock', anim: '' },
            eco: { label: 'Eco', cls: 'bg-emerald-500 text-white', icon: 'fa-leaf', anim: 'icon-bounce' }
        };
        const tags = (p.tags || []).map(t => styles[t]).filter(Boolean);
        if (tags.length === 0) return '';
        return `<div class="absolute top-2 left-2 flex flex-col gap-1 z-10">
            ${tags.map(t => `<span class="${t.cls} text-[0.55rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-1 shadow-sm">
                <i class="fas ${t.icon} ${t.anim}"></i> ${t.label}
            </span>`).join('')}
        </div>`;
    }
    function escapeHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }
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

    /* ============================================================
       CATEGORY CARDS — rendered dynamically
       ============================================================ */
    function renderCategoryCards() {
        const grid = $('#categoryGrid'); if (!grid) return;
        grid.innerHTML = CATEGORIES.map(cat => `
            <div class="category-card group bg-white dark:bg-slate-800 rounded-2xl text-center border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-brand-500 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 relative overflow-hidden" data-category="${cat.key}">
                <div class="absolute inset-0 bg-gradient-to-br from-brand-50/0 to-brand-50 dark:from-brand-900/0 dark:to-brand-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative">
                    <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900/40 dark:to-brand-800/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                        <i class="fas ${cat.icon} text-lg sm:text-xl text-brand-600 dark:text-brand-400"></i>
                    </div>
                    <h4 class="font-bold text-xs sm:text-sm">${cat.name}</h4>
                    <span class="cat-count block text-[0.65rem] sm:text-xs text-slate-400 mt-1 font-medium"></span>
                </div>
            </div>
        `).join('');
        grid.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', function () { showCategory(this.dataset.category); });
        });
        updateCategoryCounts();
    }
    function updateCategoryCounts() {
        $$('.category-card').forEach(card => {
            const c = card.dataset.category;
            const n = PRODUCTS.filter(p => p.category === c).length;
            const el = card.querySelector('.cat-count');
            if (el) el.textContent = `${n} item${n !== 1 ? 's' : ''}`;
        });
    }

    /* ============================================================
       SKELETON LOADERS
       ============================================================ */
    function renderSkeletons(container, count = 8) {
        if (!container) return;
        container.innerHTML = Array(count).fill(0).map(() => `
            <div class="skeleton-card overflow-hidden flex flex-col">
                <div class="skeleton-box w-full" style="aspect-ratio:4/3;"></div>
                <div class="p-3 sm:p-4 flex-1 flex flex-col gap-2">
                    <div class="skeleton-box h-4 w-3/4"></div>
                    <div class="skeleton-box h-3 w-1/2"></div>
                    <div class="skeleton-box h-3 w-full"></div>
                    <div class="skeleton-box h-5 w-1/3 mt-2"></div>
                    <div class="skeleton-box h-9 w-full mt-2 rounded-full"></div>
                </div>
            </div>
        `).join('');
    }

    /* ============================================================
       PRODUCT GRID
       ============================================================ */
    function renderProductGrid(products, container) {
        if (!container) return;
        container.innerHTML = products.map((p, idx) => {
            const inWish = wishlist.includes(p.id);
            const inCompare = compareList.includes(p.id);
            const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
            const ss = getStockStatus(p.stock);
            const isOut = p.stock === 0;
            return `
            <div class="product-card bg-white dark:bg-slate-800 overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col animate-fadeInUp" data-id="${p.id}" style="animation-delay:${idx * 0.04}s">
                <div class="product-image-wrapper relative cursor-pointer group">
                    ${p.isNew ? '<span class="absolute top-2 left-2 bg-green-500 text-white text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full z-10">New</span>' : ''}
                    ${discount > 0 && !p.isNew ? `<span class="absolute top-2 left-2 bg-red-500 text-white text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full z-10">-${discount}%</span>` : ''}
                    ${getTagBadges(p)}
                    <span class="absolute bottom-2 left-2 ${ss.cls} text-[0.6rem] font-bold px-2 py-0.5 rounded-full z-10">${ss.label}</span>
                    <button class="wishlist-btn absolute top-2 right-2 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center ${inWish ? 'text-red-500 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'} z-10 text-xs transition-all hover-pulse" data-id="${p.id}" aria-label="Wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="compare-btn absolute top-12 right-2 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center ${inCompare ? 'text-brand-600 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'} z-10 text-xs transition-all" data-id="${p.id}" aria-label="Compare">
                        <i class="fas fa-balance-scale"></i>
                    </button>
                    <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    <button class="quick-view-btn px-4 py-2 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-lg hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all duration-300 flex items-center gap-2" data-id="${p.id}">
                        <i class="fas fa-eye"></i> Quick View
                    </button>
                </div>
                <div class="p-3 sm:p-4 flex-1 flex flex-col">
                    <h3 class="font-semibold text-sm mb-1 line-clamp-1">${escapeHtml(p.name)}</h3>
                    <div class="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                        <span class="text-amber-400 text-[0.65rem]">${getStars(p.rating || 4.5)}</span>
                        <span>(${p.reviewCount || 0})</span>
                    </div>
                    <div class="text-xs text-slate-400 mb-2 flex-1 line-clamp-2">${escapeHtml(p.desc)}</div>
                    <div class="flex items-baseline gap-2 mb-2">
                        <span class="font-bold text-base text-brand-600 dark:text-brand-400">${formatPrice(p.price)}</span>
                        ${p.oldPrice ? `<span class="text-xs text-slate-400 line-through">${formatPrice(p.oldPrice)}</span>` : ''}
                    </div>
                    <button class="add-cart w-full py-2 rounded-full ${isOut ? 'border-2 border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'} font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all" data-id="${p.id}" ${isOut ? 'disabled' : ''}>
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
        renderRecentlyViewed();
    }
    function addToCart(id) {
        if (!Auth.isAuthenticated()) { showToast('Please sign in first', 'warning'); AuthUI.openAuthModalUI('login'); return; }
        const p = PRODUCTS.find(x => x.id === id);
        if (!p || p.stock === 0) return;
        const ex = cart.find(i => i.id === id && !i.cartId);
        if (ex) ex.qty++;
        else cart.push({ id, name: p.name, price: p.price, image: p.image, qty: 1 });
        saveAll(); updateCartUI();
        if (typeof window.broadcastSync === 'function') window.broadcastSync('cart');
        showToast(`${p.name} added to cart`, 'success');
    }
    function getUserPoints() {
        const u = Auth.getCurrentUser(); if (!u) return 0;
        return Storage.safeGet(Storage.KEYS.POINTS(u.email), 0);
    }

    /* ============================================================
       CART UI
       ============================================================ */
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
                <img src="${i.image}" alt="${escapeHtml(i.name)}" class="w-12 h-12 object-cover rounded-lg shrink-0">
                <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-semibold line-clamp-1">${escapeHtml(i.name)}</h4>
                    <div class="text-xs font-semibold text-brand-600 dark:text-brand-400">${formatPrice(i.price)}</div>
                    <div class="flex items-center gap-2 mt-1">
                        <button class="qty-dec w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-xs" data-key="${i.cartId || i.id}">−</button>
                        <span class="min-w-[20px] text-center font-semibold text-sm">${i.qty}</span>
                        <button class="qty-inc w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-xs" data-key="${i.cartId || i.id}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove text-slate-400 hover:text-red-500 transition shrink-0" data-key="${i.cartId || i.id}" aria-label="Remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
        const totalQty = cart.reduce((s, i) => s + i.qty, 0);
        const tier = getBulkDiscount(totalQty);
        const bulkDiscount = subtotal * (tier.percent / 100);
        const afterBulk = subtotal - bulkDiscount;
        const couponDiscount = calculateCouponDiscount(afterBulk);
        const afterCoupon = afterBulk - couponDiscount;
        const shippingCost = calculateShipping(afterCoupon);
        const afterShipping = afterCoupon + shippingCost;
        const userPoints = getUserPoints();
        const maxPointsValue = afterShipping * 0.5;
        const maxRedeemablePts = Math.min(userPoints, Math.floor(maxPointsValue * 100));
        let redeemPts = pointsRedeem || 0;
        if (redeemPts > maxRedeemablePts) redeemPts = maxRedeemablePts;
        if (redeemPts < 0) redeemPts = 0;
        const pointsDiscount = redeemPts / 100;
        const finalTotal = Math.max(0, afterShipping - pointsDiscount);

        if ($('#cartSubtotal')) $('#cartSubtotal').textContent = formatPrice(subtotal);
        const bulkRow = $('#cartBulkDiscountRow');
        if (bulkRow) {
            if (tier.percent > 0) {
                bulkRow.classList.remove('hidden'); bulkRow.classList.add('flex');
                $('#cartBulkDiscount').textContent = `-${formatPrice(bulkDiscount)} (${tier.percent}%)`;
            } else { bulkRow.classList.add('hidden'); bulkRow.classList.remove('flex'); }
        }
        const couponWrap = $('#couponInputWrap'); const couponAppliedEl = $('#couponApplied'); const couponErr = $('#couponError'); const couponRow = $('#cartCouponRow');
        if (appliedCoupon) {
            couponWrap?.classList.add('hidden');
            couponAppliedEl?.classList.remove('hidden');
            $('#couponCodeLabel').textContent = appliedCoupon.code;
            if (couponRow) { couponRow.classList.remove('hidden'); couponRow.classList.add('flex'); $('#cartCouponDiscount').textContent = `-${formatPrice(couponDiscount)}`; }
        } else {
            couponWrap?.classList.remove('hidden');
            couponAppliedEl?.classList.add('hidden');
            if (couponRow) { couponRow.classList.add('hidden'); couponRow.classList.remove('flex'); }
        }
        couponErr?.classList.add('hidden');

        const shippingEl = $('#cartShipping');
        const freeShipHint = $('#cartFreeShipHint');
        const freeShipText = $('#cartFreeShipText');
        const { threshold } = getShippingRate();
        const subInCur = subtotal * CURRENCIES[currentCurrency].rate;
        if (shippingEl) {
            if (shippingCost === 0) { shippingEl.textContent = 'FREE'; shippingEl.className = 'font-semibold text-green-600'; }
            else { shippingEl.textContent = formatPrice(shippingCost); shippingEl.className = 'font-semibold text-slate-800 dark:text-slate-200'; }
        }
        if (freeShipHint && freeShipText) {
            if (shippingCost > 0) {
                const remaining = threshold - subInCur;
                const sym = CURRENCIES[currentCurrency].symbol;
                freeShipHint.classList.remove('hidden');
                freeShipText.textContent = `Add ${sym}${Math.round(remaining).toLocaleString()} more for FREE shipping!`;
            } else freeShipHint.classList.add('hidden');
        }
        const pWrap = $('#pointsRedeemWrap');
        if (pWrap) {
            if (userPoints > 0 && maxRedeemablePts > 0) {
                pWrap.classList.remove('hidden');
                $('#pointsBalanceLabel').textContent = `${userPoints.toLocaleString()} pts`;
                const pRange = $('#pointsRange'); const pInput = $('#pointsInput');
                if (pRange) { pRange.max = maxRedeemablePts; pRange.value = redeemPts; }
                if (pInput) { pInput.max = maxRedeemablePts; pInput.value = redeemPts; }
                $('#pointsValueLabel').textContent = `-${formatPrice(pointsDiscount)}`;
                const pRow = $('#cartPointsRow');
                if (pRow) {
                    if (pointsDiscount > 0) {
                        pRow.classList.remove('hidden'); pRow.classList.add('flex');
                        $('#cartPointsDiscount').textContent = `-${formatPrice(pointsDiscount)} (${redeemPts} pts)`;
                    } else { pRow.classList.add('hidden'); pRow.classList.remove('flex'); }
                }
            } else pWrap.classList.add('hidden');
        }
        if ($('#cartTotal')) $('#cartTotal').textContent = formatPrice(finalTotal);
        if (footerEl) footerEl.style.display = 'block';
    }
    function updateQty(key, d) {
        const item = cart.find(i => (i.cartId || i.id) === key);
        if (!item) return;
        item.qty += d;
        if (item.qty <= 0) return removeFromCart(key);
        saveAll(); updateCartUI();
        if (typeof window.broadcastSync === 'function') window.broadcastSync('cart');
    }
    function removeFromCart(key) {
        cart = cart.filter(i => (i.cartId || i.id) !== key);
        saveAll(); updateCartUI();
        if (typeof window.broadcastSync === 'function') window.broadcastSync('cart');
    }
    function toggleWishlist(id) {
        if (!Auth.isAuthenticated()) { showToast('Please sign in first', 'warning'); AuthUI.openAuthModalUI('login'); return; }
        const idx = wishlist.indexOf(id);
        if (idx > -1) { wishlist.splice(idx, 1); showToast('Removed from wishlist', 'info'); }
        else { wishlist.push(id); showToast('Added to wishlist!', 'success'); }
        saveAll(); updateWishlistUI();
        if (typeof window.broadcastSync === 'function') window.broadcastSync('wishlist');
        if (!$('#categoryPage').classList.contains('hidden') && currentCategory) renderCategoryWithFilters();
        else rerenderAll();
    }
    function updateWishlistUI() {
        const count = wishlist.length; const badge = $('#wishlistCount');
        if (badge) { badge.textContent = count; badge.classList.toggle('hidden', count === 0); badge.classList.toggle('flex', count > 0); }
        const sidebarWish = $('#sidebarWishlistCount');
        if (sidebarWish) sidebarWish.textContent = count;
    }

    /* ============================================================
       CATEGORY PAGE
       ============================================================ */
    function getSortedCategoryItems(cat, sort, priceMin, priceMax) {
        let items = PRODUCTS.filter(p => p.category === cat);
        if (priceMin != null && !isNaN(priceMin)) items = items.filter(p => p.price >= priceMin);
        if (priceMax != null && !isNaN(priceMax)) items = items.filter(p => p.price <= priceMax);
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
    function renderCategoryWithFilters() {
        if (!currentCategory) return;
        const items = getSortedCategoryItems(currentCategory, currentSort, currentPriceMin, currentPriceMax);
        renderCategoryGrid(items);
        const clearBtn = $('#priceClearBtn');
        if (clearBtn) {
            const hasFilter = currentPriceMin != null || currentPriceMax != null;
            clearBtn.classList.toggle('hidden', !hasFilter);
        }
        saveFilterState();
    }
    function showCategory(cat, sort, min, max) {
        const items = PRODUCTS.filter(p => p.category === cat);
        if (items.length === 0) { showToast('No products in this category', 'warning'); return; }
        currentCategory = cat;
        currentSort = sort || 'default';
        currentPriceMin = (min != null && min !== '') ? parseFloat(min) : null;
        currentPriceMax = (max != null && max !== '') ? parseFloat(max) : null;
        const sortEl = $('#categorySort'); if (sortEl) sortEl.value = currentSort;
        const minIn = $('#priceMin'); if (minIn) minIn.value = currentPriceMin != null ? currentPriceMin : '';
        const maxIn = $('#priceMax'); if (maxIn) maxIn.value = currentPriceMax != null ? currentPriceMax : '';

        $('#mainSections').classList.add('hidden');
        document.querySelector('section.gradient-brand').classList.add('hidden');
        document.querySelector('footer').classList.add('hidden');
        $('#dashboardWrapper').classList.add('hidden');
        $('#comparePage').classList.add('hidden');
        $('#adminPage').classList.remove('active');
        $('#categoryPage').classList.remove('hidden');

        const catDef = CATEGORIES.find(c => c.key === cat);
        const displayName = catDef ? catDef.name : (cat.charAt(0).toUpperCase() + cat.slice(1));
        $('#categoryPageTitle').innerHTML = `${displayName} <span class="text-brand-600 dark:text-brand-400">Collection</span>`;
        $('#categoryPageMeta').textContent = `Browse our premium ${displayName.toLowerCase()} furniture`;

        // Show skeletons first
        renderSkeletons($('#categoryProductGrid'), 8);
        setTimeout(() => renderCategoryWithFilters(), 300);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function hideCategoryPage() {
        $('#categoryPage').classList.add('hidden');
        $('#mainSections').classList.remove('hidden');
        document.querySelector('section.gradient-brand').classList.remove('hidden');
        document.querySelector('footer').classList.remove('hidden');
        currentCategory = null;
        Storage.safeRemove(Storage.KEYS.FILTER);
        document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
    }

    /* ============================================================
       PRODUCT DETAIL
       ============================================================ */
    function openProductDetail(id) {
        const p = PRODUCTS.find(x => x.id === id);
        if (!p) return;
        trackRecentlyViewed(id);
        detailProductId = id; detailSize = 'medium'; detailQty = 1; detailImageIndex = 0; reviewDraftRating = 0;

        const imgs = (p.images && p.images.length) ? p.images : [p.image];
        renderDetailGallery(imgs, 0);

        $('#detailCategory').textContent = p.category.charAt(0).toUpperCase() + p.category.slice(1);
        $('#detailName').textContent = p.name;
        $('#detailStars').innerHTML = getStars(p.rating || 4.5);
        $('#detailReviews').textContent = `(${p.reviewCount || 0} reviews)`;
        $('#detailDesc').textContent = p.desc;

        const currentPrice = p.price * SIZE_MULTIPLIERS[detailSize];
        $('#detailPrice').textContent = formatPrice(currentPrice);
        if (p.oldPrice) {
            $('#detailOldPrice').textContent = formatPrice(p.oldPrice);
            $('#detailOldPrice').classList.remove('hidden');
            $('#detailDiscount').textContent = `-${Math.round((1 - p.price / p.oldPrice) * 100)}%`;
            $('#detailDiscount').classList.remove('hidden');
        } else {
            $('#detailOldPrice').classList.add('hidden');
            $('#detailDiscount').classList.add('hidden');
        }

        const ss = getStockStatus(p.stock);
        const badge = $('#detailStockBadge');
        badge.className = 'absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold z-10 ' + ss.cls;
        badge.textContent = ss.label;
        $('#detailNewBadge').classList.toggle('hidden', !p.isNew);

        // Tags
        const tagsWrap = $('#detailTags');
        if (tagsWrap) {
            const styles = { bestseller: 'bg-amber-500 text-white', limited: 'bg-purple-500 text-white', eco: 'bg-emerald-500 text-white' };
            const labels = {
                bestseller: '<i class="fas fa-fire icon-glow"></i> Bestseller',
                limited: '<i class="fas fa-clock"></i> Limited',
                eco: '<i class="fas fa-leaf icon-bounce"></i> Eco-Friendly'
            };
            tagsWrap.innerHTML = (p.tags || []).map(t => styles[t] ? `<span class="${styles[t]} text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">${labels[t]}</span>` : '').join('');
            tagsWrap.classList.toggle('hidden', !p.tags || p.tags.length === 0);
        }

        renderDetailSizes();
        $('#detailQty').textContent = detailQty;
        updateDetailTotal();
        updateBulkDiscountHint();

        const wlBtn = $('#detailWishlist');
        const inWish = wishlist.includes(id);
        wlBtn.classList.toggle('border-red-500', inWish);
        wlBtn.classList.toggle('text-red-500', inWish);
        wlBtn.classList.toggle('border-slate-200', !inWish);
        wlBtn.classList.toggle('text-slate-400', !inWish);

        const addBtn = $('#detailAddToCart');
        if (p.stock === 0) {
            addBtn.disabled = true;
            addBtn.classList.add('opacity-50', 'cursor-not-allowed');
            addBtn.innerHTML = '<i class="fas fa-times"></i> Out of Stock';
        } else {
            addBtn.disabled = false;
            addBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            addBtn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
        }

        renderReviews(p.id);
        renderRelatedProducts(p);
        $('#reviewForm').classList.add('hidden');
        $('#reviewText').value = '';
        $('#reviewCharCount').textContent = '0';

        const modal = $('#productDetailModal');
        modal.classList.remove('hidden'); modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        renderRecentlyViewed();
    }
    function closeProductDetail() {
        const m = $('#productDetailModal'); if (!m) return;
        m.classList.add('hidden'); m.classList.remove('flex');
        document.body.style.overflow = '';
        detailProductId = null;
    }
    function renderDetailGallery(imgs, index) {
        const main = $('#detailImage');
        if (main) {
            main.src = imgs[index];
            main.style.transform = 'scale(1)';
            main.style.transformOrigin = 'center center';
        }
        const thumbs = $('#detailThumbs'); if (!thumbs) return;
        thumbs.innerHTML = imgs.map((src, i) => `
            <button class="thumb-btn shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 ${i === index ? 'border-white' : 'border-white/40 opacity-70'} transition hover:opacity-100" data-index="${i}" aria-label="View image ${i + 1}">
                <img src="${src}" class="w-full h-full object-cover" alt="">
            </button>
        `).join('');
        thumbs.querySelectorAll('.thumb-btn').forEach(btn => btn.addEventListener('click', function () {
            detailImageIndex = parseInt(this.dataset.index);
            renderDetailGallery(imgs, detailImageIndex);
        }));
    }
    function renderDetailSizes() {
        const p = PRODUCTS.find(x => x.id === detailProductId); if (!p) return;
        const sizes = [
            { key: 'small', label: 'Small', sub: 'Compact' },
            { key: 'medium', label: 'Medium', sub: 'Standard' },
            { key: 'large', label: 'Large', sub: 'Spacious' }
        ];
        const container = $('#detailSizes');
        container.innerHTML = sizes.map(s => {
            const price = p.price * SIZE_MULTIPLIERS[s.key];
            const active = detailSize === s.key;
            return `<button class="size-btn px-2 py-2 sm:py-2.5 rounded-xl border-2 font-semibold text-xs sm:text-sm transition-all ${active ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400' : 'border-slate-200 dark:border-slate-600 text-slate-500 hover:border-brand-500'}" data-size="${s.key}">
                <div class="font-bold">${s.label}</div>
                <div class="text-[0.65rem] opacity-60">${s.sub}</div>
                <div class="text-xs font-bold mt-0.5">${formatPrice(price)}</div>
            </button>`;
        }).join('');
        container.querySelectorAll('.size-btn').forEach(btn => btn.addEventListener('click', function () {
            detailSize = this.dataset.size;
            const p = PRODUCTS.find(x => x.id === detailProductId);
            $('#detailPrice').textContent = formatPrice(p.price * SIZE_MULTIPLIERS[detailSize]);
            renderDetailSizes();
            updateDetailTotal();
            updateBulkDiscountHint();
        }));
    }
    function updateDetailTotal() {
        const p = PRODUCTS.find(x => x.id === detailProductId); if (!p) return;
        const unit = p.price * SIZE_MULTIPLIERS[detailSize];
        const subtotal = unit * detailQty;
        const tier = getBulkDiscount(detailQty);
        const total = subtotal * (1 - tier.percent / 100);
        const el = $('#detailTotal');
        if (el) {
            if (tier.percent > 0) el.innerHTML = `<span class="line-through text-slate-400 text-xs">${formatPrice(subtotal)}</span> ${formatPrice(total)}`;
            else el.textContent = formatPrice(total);
        }
    }
    function updateBulkDiscountHint() {
        const hint = $('#detailBulkDiscount');
        const text = $('#detailBulkDiscountText');
        if (!hint || !text) return;
        const tier = getBulkDiscount(detailQty);
        const next = getNextBulkTier(detailQty);
        if (tier.percent > 0) {
            hint.classList.remove('hidden');
            text.innerHTML = `You're saving <strong>${tier.percent}%</strong> (${detailQty}+ items)${next ? ` — add ${next.min - detailQty} more for ${next.percent}% off!` : ''}`;
        } else if (next) {
            hint.classList.remove('hidden');
            text.innerHTML = `Add <strong>${next.min - detailQty}</strong> more to save <strong>${next.percent}%</strong>!`;
        } else hint.classList.add('hidden');
    }
    function renderRelatedProducts(p) {
        const c = $('#detailRelated'); if (!c) return;
        const related = PRODUCTS.filter(x => x.id !== p.id && x.category === p.category).slice(0, 3);
        if (related.length === 0) { c.innerHTML = ''; return; }
        c.innerHTML = related.map(r => `
            <button class="related-card bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:-translate-y-1 transition text-left w-full" data-id="${r.id}">
                <img src="${r.image}" class="w-full h-16 sm:h-20 object-cover" loading="lazy" alt="">
                <div class="p-2">
                    <div class="font-semibold text-[0.7rem] sm:text-xs line-clamp-1">${escapeHtml(r.name)}</div>
                    <div class="text-brand-600 dark:text-brand-400 font-bold text-xs mt-0.5">${formatPrice(r.price)}</div>
                </div>
            </button>
        `).join('');
        c.querySelectorAll('.related-card').forEach(card => card.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            closeProductDetail();
            setTimeout(() => openProductDetail(id), 150);
        }));
    }
    function addDetailToCart() {
        if (!Auth.isAuthenticated()) { showToast('Please sign in first', 'warning'); AuthUI.openAuthModalUI('login'); return; }
        const p = PRODUCTS.find(x => x.id === detailProductId);
        if (!p || p.stock === 0) return;
        const unit = p.price * SIZE_MULTIPLIERS[detailSize];
        const sizeLabel = detailSize.charAt(0).toUpperCase() + detailSize.slice(1);
        const cartId = p.id * 100 + ['small', 'medium', 'large'].indexOf(detailSize);
        const ex = cart.find(i => i.cartId === cartId);
        if (ex) ex.qty += detailQty;
        else cart.push({ cartId, id: p.id, name: `${p.name} (${sizeLabel})`, price: unit, image: p.image, qty: detailQty });
        saveAll(); updateCartUI();
        if (typeof window.broadcastSync === 'function') window.broadcastSync('cart');
        showToast(`${p.name} (${sizeLabel}) × ${detailQty} added to cart`, 'success');
        closeProductDetail();
    }

    /* ============================================================
       REVIEWS
       ============================================================ */
    function getReviews(productId) {
        const all = Storage.safeGet(Storage.KEYS.REVIEWS, {});
        return all[productId] || [];
    }
    function saveReview(productId, review) {
        const all = Storage.safeGet(Storage.KEYS.REVIEWS, {});
        if (!all[productId]) all[productId] = [];
        all[productId].unshift(review);
        Storage.safeSet(Storage.KEYS.REVIEWS, all);
        const p = PRODUCTS.find(x => x.id === productId);
        if (p) {
            const reviews = all[productId];
            const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
            p.rating = Math.round(avg * 10) / 10;
            p.reviewCount = reviews.length;
            saveAll();
        }
    }
    function hasUserPurchased() {
        const user = Auth.getCurrentUser(); if (!user) return false;
        return Storage.safeGet(Storage.KEYS.ORDERS(user.email), []).length > 0;
    }
    function hasUserReviewed(productId) {
        const user = Auth.getCurrentUser(); if (!user) return false;
        return getReviews(productId).some(r => r.userId === user.id);
    }
    function getRatingBreakdown(reviews) {
        const b = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => b[Math.round(r.rating)] = (b[Math.round(r.rating)] || 0) + 1);
        return b;
    }
    function renderReviews(productId) {
        const reviews = getReviews(productId);
        const summary = $('#reviewSummary'); const list = $('#reviewList'); const writeBtn = $('#writeReviewBtn');
        if (!summary || !list) return;
        const p = PRODUCTS.find(x => x.id === productId);
        const total = reviews.length;
        const avg = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : (p?.rating || 4.5);
        const buckets = getRatingBreakdown(reviews);
        summary.innerHTML = `
            <div class="flex items-center gap-4 mb-4 flex-wrap">
                <div class="text-center">
                    <div class="text-4xl font-black text-brand-600 dark:text-brand-400">${avg.toFixed(1)}</div>
                    <div class="text-amber-400 text-sm">${getStars(avg)}</div>
                    <div class="text-xs text-slate-400 mt-0.5">${total} review${total !== 1 ? 's' : ''}</div>
                </div>
                <div class="flex-1 min-w-[180px] flex flex-col gap-1">
                    ${[5, 4, 3, 2, 1].map(star => {
            const count = buckets[star] || 0;
            const pct = total > 0 ? (count / total) * 100 : 0;
            return `<div class="flex items-center gap-2 text-xs">
                            <span class="w-8 text-slate-500">${star}★</span>
                            <div class="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div class="h-full bg-amber-400 rounded-full transition-all" style="width:${pct}%"></div>
                            </div>
                            <span class="w-8 text-right text-slate-400">${count}</span>
                        </div>`;
        }).join('')}
                </div>
            </div>`;
        if (reviews.length === 0) {
            list.innerHTML = `<div class="text-center py-6 text-slate-400 text-sm"><i class="far fa-comment-dots text-2xl mb-2 block opacity-40"></i>No reviews yet. Be the first!</div>`;
        } else {
            list.innerHTML = reviews.map(r => `
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div class="flex items-start gap-3">
                        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            ${r.userName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="font-semibold text-sm">${escapeHtml(r.userName)}</span>
                                ${r.verified ? '<span class="text-[0.6rem] font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-1.5 py-0.5 rounded-full"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
                            </div>
                            <div class="flex items-center gap-2 mt-0.5">
                                <span class="text-amber-400 text-xs">${getStars(r.rating)}</span>
                                <span class="text-[0.7rem] text-slate-400">${new Date(r.date).toLocaleDateString()}</span>
                            </div>
                            <div class="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">${escapeHtml(r.text)}</div>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        const user = Auth.getCurrentUser();
        if (!user) { writeBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign in to review'; writeBtn.disabled = false; writeBtn.classList.remove('opacity-50', 'cursor-not-allowed'); }
        else if (hasUserReviewed(productId)) { writeBtn.innerHTML = '<i class="fas fa-check"></i> Already reviewed'; writeBtn.disabled = true; writeBtn.classList.add('opacity-50', 'cursor-not-allowed'); }
        else if (!hasUserPurchased()) { writeBtn.innerHTML = '<i class="fas fa-lock"></i> Purchase to review'; writeBtn.disabled = false; writeBtn.classList.remove('opacity-50', 'cursor-not-allowed'); }
        else { writeBtn.innerHTML = '<i class="fas fa-pen"></i> Write a Review'; writeBtn.disabled = false; writeBtn.classList.remove('opacity-50', 'cursor-not-allowed'); }
    }
    function renderReviewStarInput() {
        const c = $('#reviewStars'); if (!c) return;
        c.innerHTML = [1, 2, 3, 4, 5].map(n => `<button class="review-star ${n <= reviewDraftRating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'} hover:text-amber-400 transition" data-star="${n}"><i class="fas fa-star"></i></button>`).join('');
        c.querySelectorAll('.review-star').forEach(btn => btn.addEventListener('click', function () {
            reviewDraftRating = parseInt(this.dataset.star);
            renderReviewStarInput();
        }));
    }

    /* ============================================================
       ORDER TIMELINE + CANCEL + BUY AGAIN
       ============================================================ */
    function canCancelOrder(order) {
        if (!order || order.cancelled) return false;
        if (order.status !== 'processing' && order.status !== 'pending') return false;
        const hoursSince = (Date.now() - new Date(order.date).getTime()) / 3600000;
        return hoursSince < 24;
    }
    function cancelOrder(orderId) {
        const user = Auth.getCurrentUser(); if (!user) return;
        const orders = Storage.safeGet(Storage.KEYS.ORDERS(user.email), []);
        const idx = orders.findIndex(o => o.id === orderId);
        if (idx === -1) return;
        const o = orders[idx];
        if (!canCancelOrder(o)) { showToast('This order can no longer be cancelled.', 'warning'); return; }
        if (!confirm('Are you sure you want to cancel this order?')) return;
        o.cancelled = true; o.status = 'cancelled'; o.cancelledAt = new Date().toISOString();
        if (o.pointsUsed > 0) {
            const cur = getUserPoints();
            Storage.safeSet(Storage.KEYS.POINTS(user.email), cur + o.pointsUsed);
        }
        const earned = Math.floor(o.total * 10);
        const cur2 = getUserPoints();
        Storage.safeSet(Storage.KEYS.POINTS(user.email), Math.max(0, cur2 - earned));
        Storage.safeSet(Storage.KEYS.ORDERS(user.email), orders);
        showToast('Order cancelled. Points refunded.', 'success');
        renderDashboardPage('orders'); loadDashboard();
    }
    function buyAgain(orderId) {
        if (!Auth.isAuthenticated()) { showToast('Please sign in first', 'warning'); AuthUI.openAuthModalUI('login'); return; }
        const user = Auth.getCurrentUser();
        const orders = Storage.safeGet(Storage.KEYS.ORDERS(user.email), []);
        const order = orders.find(o => o.id === orderId);
        if (!order || !order.itemsList) { showToast('Order details unavailable', 'warning'); return; }
        let added = 0, skipped = 0;
        order.itemsList.forEach(item => {
            const product = PRODUCTS.find(p => p.id === item.id);
            if (!product || product.stock === 0) { skipped++; return; }
            if (item.cartId) {
                const existing = cart.find(i => i.cartId === item.cartId);
                if (existing) existing.qty += item.qty;
                else {
                    const sizeMatch = item.name.match(/\((Small|Medium|Large)\)/i);
                    const sizeKey = sizeMatch ? sizeMatch[1].toLowerCase() : 'medium';
                    cart.push({ cartId: item.cartId, id: item.id, name: item.name, price: product.price * SIZE_MULTIPLIERS[sizeKey], image: item.image, qty: item.qty });
                }
            } else {
                const existing = cart.find(i => i.id === item.id && !i.cartId);
                if (existing) existing.qty += item.qty;
                else cart.push({ id: item.id, name: item.name, price: product.price, image: item.image, qty: item.qty });
            }
            added++;
        });
        if (added === 0) { showToast('All items are out of stock', 'warning'); return; }
        saveAll(); updateCartUI();
        if (typeof window.broadcastSync === 'function') window.broadcastSync('cart');
        showToast(`Added ${added} item${added !== 1 ? 's' : ''} to cart${skipped ? ` (${skipped} skipped)` : ''}`, 'success');
        $('#cartSidebar').classList.remove('translate-x-full');
        $('#cartOverlay').classList.remove('hidden');
    }
    function renderOrderTimeline(order) {
        const currentIdx = order.cancelled ? 0 : (order.status === 'pending' ? 0 : order.status === 'delivered' ? 3 : order.status === 'shipped' ? 2 : 1);
        const steps = [
            { key: 'placed', label: 'Placed', icon: 'fa-check' },
            { key: 'processing', label: 'Processing', icon: 'fa-cog' },
            { key: 'shipped', label: 'Shipped', icon: 'fa-truck' },
            { key: 'delivered', label: 'Delivered', icon: 'fa-home' }
        ];
        const progress = order.cancelled ? 0 : (currentIdx / (steps.length - 1)) * 100;
        const statusPillColor = order.cancelled ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
            : order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                : order.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    : order.status === 'pending' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300';
        const estDate = new Date(new Date(order.date).getTime() + 5 * 86400000);
        const estStr = estDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        return `
        <div class="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
            <div class="flex justify-between items-start flex-wrap gap-2 mb-4">
                <div>
                    <div class="font-bold text-sm sm:text-base">Order #${order.id}</div>
                    <div class="text-xs text-slate-400">Placed ${new Date(order.date).toLocaleDateString()}</div>
                </div>
                <div class="flex flex-col items-end gap-1">
                    <span class="inline-block px-2.5 py-0.5 rounded-full text-[0.68rem] font-bold uppercase ${statusPillColor}">${order.status}</span>
                    <div class="font-extrabold text-brand-600 dark:text-brand-400 text-sm">${formatPrice(order.total)}</div>
                </div>
            </div>
            <div class="relative mb-5 mt-6">
                <div class="absolute top-4 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                <div class="absolute top-4 left-0 h-1 bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-700" style="width:${progress}%"></div>
                <div class="relative flex justify-between">
                    ${steps.map((s, i) => {
            const isDone = i <= currentIdx && !order.cancelled;
            const isCurrent = i === currentIdx && !order.cancelled;
            return `<div class="flex flex-col items-center flex-1">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${isDone ? 'bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'} ${isCurrent ? 'ring-4 ring-brand-500/30' : ''}">
                                <i class="fas ${s.icon}"></i>
                            </div>
                            <div class="text-[0.6rem] sm:text-xs font-semibold mt-1.5 text-center ${isDone ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}">${s.label}</div>
                        </div>`;
        }).join('')}
                </div>
            </div>
            ${!order.cancelled ? `
                <div class="flex items-center gap-2 text-xs sm:text-sm bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl p-3 mb-3">
                    <i class="fas fa-calendar-check text-brand-600 dark:text-brand-400"></i>
                    <span class="text-brand-700 dark:text-brand-300">
                        ${order.status === 'delivered' ? '<strong>Delivered!</strong> Hope you love it <i class="fas fa-champagne-glasses"></i>' : `<strong>Est. delivery:</strong> ${estStr}`}
                    </span>
                </div>` : ''}
            <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="bg-white dark:bg-slate-800 rounded-lg p-2.5 border border-slate-200 dark:border-slate-700">
                    <div class="text-slate-400 uppercase text-[0.6rem] font-bold mb-0.5">Items</div>
                    <div class="font-semibold">${order.items} item${order.items !== 1 ? 's' : ''}</div>
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-lg p-2.5 border border-slate-200 dark:border-slate-700">
                    <div class="text-slate-400 uppercase text-[0.6rem] font-bold mb-0.5">Tracking #</div>
                    <div class="font-mono font-semibold text-[0.7rem]">${order.trackingNumber || '—'}</div>
                </div>
            </div>
            ${order.discount > 0 ? `
                <div class="mt-3 text-xs bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2.5 text-green-700 dark:text-green-300 flex items-center gap-2">
                    <i class="fas fa-tag"></i> Discount: <strong>${formatPrice(order.discount)}</strong>
                </div>` : ''}
            ${order.adminNote ? `
                <div class="mt-3 text-xs bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-2.5 text-amber-700 dark:text-amber-300 flex items-start gap-2">
                    <i class="fas fa-comment-dots mt-0.5"></i>
                    <div><strong>Note from us:</strong> ${escapeHtml(order.adminNote)}</div>
                </div>` : ''}
            ${order.itemsList && order.itemsList.length > 0 ? `
                <div class="mt-3">
                    <button class="buy-again-btn w-full py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition flex items-center justify-center gap-2" data-id="${order.id}">
                        <i class="fas fa-redo"></i> Buy Again (${order.itemsList.length} item${order.itemsList.length !== 1 ? 's' : ''})
                    </button>
                </div>` : ''}
            ${order.cancelled ? `
                <div class="mt-3 text-xs bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2.5 text-red-700 dark:text-red-300 flex items-center gap-2">
                    <i class="fas fa-ban"></i> This order was cancelled. Points refunded.
                </div>` : (canCancelOrder(order) ? `
                <button class="cancel-order-btn mt-3 w-full py-2 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold text-xs transition flex items-center justify-center gap-2" data-id="${order.id}">
                    <i class="fas fa-times-circle"></i> Cancel Order (within 24h)
                </button>` : '')}
        </div>`;
    }

    /* ============================================================
       DASHBOARD
       ============================================================ */
    function showDashboard() {
        if (!Guards.requireAuth()) return;
        $('#mainSections').classList.add('hidden');
        document.querySelector('section.gradient-brand').classList.add('hidden');
        document.querySelector('footer').classList.add('hidden');
        $('#categoryPage').classList.add('hidden');
        $('#comparePage').classList.add('hidden');
        $('#adminPage').classList.remove('active');
        $('#dashboardWrapper').classList.remove('hidden');
        loadDashboard();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function hideDashboard() {
        $('#dashboardWrapper').classList.add('hidden');
        $('#mainSections').classList.remove('hidden');
        document.querySelector('section.gradient-brand').classList.remove('hidden');
        document.querySelector('footer').classList.remove('hidden');
        $$('.dash-nav-item[data-page]').forEach(i => i.dataset.active = i.dataset.page === 'overview' ? 'true' : 'false');
        $('#dashboardSidebar')?.classList.add('-translate-x-full');
        $('#dashboardSidebar')?.classList.remove('translate-x-0');
        const ov = $('#sidebarOverlay'); if (ov) ov.style.display = 'none';
    }
    function getOrdersForUser() {
        const u = Auth.getCurrentUser(); if (!u) return [];
        return Storage.safeGet(Storage.KEYS.ORDERS(u.email), []);
    }
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
        if (da) {
            if (user.role === 'admin') {
                da.classList.add('from-amber-400', 'to-yellow-600');
                da.classList.remove('from-brand-500', 'to-brand-700');
            } else {
                da.classList.remove('from-amber-400', 'to-yellow-600');
                da.classList.add('from-brand-500', 'to-brand-700');
            }
        }
        // Sidebar counts
        const ordersCountEl = el('sidebarOrdersCount');
        if (ordersCountEl) ordersCountEl.textContent = orders.length;
        const wishCountEl = el('sidebarWishlistCount');
        if (wishCountEl) wishCountEl.textContent = wishlist.length;
        // Tier badge
        const tierBadge = el('sidebarUserTier');
        if (tierBadge) {
            const t = points >= 10000 ? 'Platinum' : points >= 5000 ? 'Gold' : points >= 1000 ? 'Silver' : 'Bronze';
            const iconCls = t === 'Platinum' ? 'fa-gem text-cyan-500'
                : t === 'Gold' ? 'fa-medal text-amber-500'
                    : t === 'Silver' ? 'fa-medal text-slate-400'
                        : 'fa-award text-orange-500';
            tierBadge.innerHTML = `<i class="fas ${iconCls}"></i> <span>${t}</span>`;
        }
        // Admin shortcut
        const adminBtn = el('sidebarAdminBtn');
        if (adminBtn) adminBtn.style.display = user.role === 'admin' ? 'flex' : 'none';
        // Stats
        animateCounter(el('dashStatOrders'), orders.length);
        animateCounter(el('dashStatPoints'), points);
        animateCounter(el('dashStatWishlist'), wishlist.length);
        animateCounter(el('statOrders'), orders.length);
        if (el('statSpent')) el('statSpent').textContent = formatPrice(spent);
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
        const tierIconMap = {
            Platinum: '<i class="fas fa-gem text-cyan-300 icon-pulse"></i>',
            Gold: '<i class="fas fa-medal text-amber-300 icon-pulse"></i>',
            Silver: '<i class="fas fa-medal text-slate-300"></i>',
            Bronze: '<i class="fas fa-award text-orange-400"></i>'
        };
        const tierIcon = tierIconMap[tier] || tierIconMap.Bronze;

        if (page === 'overview') {
            content.innerHTML = `
                <div class="grid lg:grid-cols-2 gap-5 mb-5">
                    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                            <h3 class="font-bold text-sm flex items-center gap-2"><i class="fas fa-chart-line text-brand-600"></i> Spending Overview</h3>
                        </div>
                        <div class="flex items-end gap-1.5 h-24">
                            ${[40, 65, 50, 80, 60, 90, 75].map(v => `<div class="flex-1 rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400" style="height:${v}%"></div>`).join('')}
                        </div>
                    </div>
                    <div class="gradient-hero text-white rounded-2xl p-5 relative overflow-hidden">
                        <div class="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full font-bold text-xs mb-3">
                            ${tierIcon} ${tier} Member
                        </div>
                        <div class="text-3xl font-black flex items-baseline gap-1.5">
                            ${points.toLocaleString()}<span class="text-sm font-medium opacity-85">points</span>
                        </div>
                        <div class="text-xs opacity-85 mt-2">
                            ${nextTier ? (nextTier - points).toLocaleString() + ' pts to next tier' : 'Max tier reached!'}
                        </div>
                        <div class="h-2 bg-white/20 rounded-full overflow-hidden mt-4">
                            <div class="h-full bg-white rounded-full" style="width:${progress}%"></div>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                    <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                        <h3 class="font-bold text-sm flex items-center gap-2"><i class="fas fa-history text-brand-600"></i> Recent Orders</h3>
                    </div>
                    ${orders.length === 0 ? '<div class="text-center py-8 text-slate-400"><i class="fas fa-shopping-bag text-3xl mb-2 block opacity-30"></i><p>No orders yet — start shopping!</p></div>' : `
                        <div class="flex flex-col gap-3">
                            ${orders.slice(0, 4).map(o => `
                                <div class="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <div class="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center text-xs shrink-0">
                                        <i class="fas fa-cog icon-spin-slow"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="font-bold text-sm">Order #${o.id}</div>
                                        <div class="text-xs text-slate-400">${new Date(o.date).toLocaleDateString()} · ${o.items} items</div>
                                    </div>
                                    <div class="font-extrabold text-brand-600 dark:text-brand-400 shrink-0">${formatPrice(o.total)}</div>
                                </div>
                            `).join('')}
                        </div>`}
                </div>
            `;
        } else if (page === 'orders') {
            content.innerHTML = `
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
                    <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                        <h3 class="font-bold text-sm flex items-center gap-2"><i class="fas fa-history text-brand-600"></i> All Orders (${orders.length})</h3>
                    </div>
                    ${orders.length === 0
                    ? '<div class="text-center py-8 text-slate-400"><i class="fas fa-shopping-bag text-3xl mb-2 block opacity-30"></i><p>No orders yet</p></div>'
                    : `<div class="flex flex-col gap-4">${orders.map(o => renderOrderTimeline(o)).join('')}</div>`}
                </div>
            `;
        } else if (page === 'wishlist') {
            const wp = wishlist.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
            content.innerHTML = `
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                    <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700 flex-wrap gap-2">
                        <h3 class="font-bold text-sm flex items-center gap-2"><i class="fas fa-heart text-red-500"></i> Wishlist (${wp.length})</h3>
                        ${wp.length > 0 ? `
                            <div class="flex gap-2">
                                <button id="wishlistAddAllBtn" class="px-3 py-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold flex items-center gap-1.5 transition">
                                    <i class="fas fa-cart-plus"></i> Add All to Cart
                                </button>
                                <button id="wishlistClearBtn" class="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                    <i class="fas fa-trash"></i> Clear
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    ${wp.length === 0
                    ? '<div class="text-center py-8 text-slate-400"><i class="fas fa-heart text-3xl mb-2 block opacity-30"></i><p>Wishlist is empty — add products you love!</p></div>'
                    : `<div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            ${wp.map(p => `
                                <div class="bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                    <img src="${p.image}" class="w-full h-32 object-cover" alt="" loading="lazy">
                                    <div class="p-3">
                                        <h3 class="font-semibold text-sm mb-1 line-clamp-1">${escapeHtml(p.name)}</h3>
                                        <div class="font-bold text-brand-600 dark:text-brand-400 mb-3">${formatPrice(p.price)}</div>
                                        <div class="flex gap-2">
                                            <button class="wl-add flex-1 py-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold text-xs flex items-center justify-center gap-1 transition" data-id="${p.id}">
                                                <i class="fas fa-cart-plus"></i> Add
                                            </button>
                                            <button class="wl-remove w-9 h-9 rounded-full border-2 border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 hover:bg-brand-600 hover:text-white flex items-center justify-center transition shrink-0" data-id="${p.id}" aria-label="Remove">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>`}
                </div>
            `;
            $('#wishlistAddAllBtn')?.addEventListener('click', () => {
                let added = 0, skipped = 0;
                wp.forEach(p => {
                    if (p.stock === 0) { skipped++; return; }
                    const ex = cart.find(i => i.id === p.id && !i.cartId);
                    if (ex) ex.qty++;
                    else cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 });
                    added++;
                });
                if (added > 0) {
                    saveAll(); updateCartUI();
                    if (typeof window.broadcastSync === 'function') window.broadcastSync('cart');
                    showToast(`Added ${added} item${added !== 1 ? 's' : ''} to cart${skipped ? ` (${skipped} skipped out-of-stock)` : ''}`, 'success');
                } else showToast('No items could be added (all out of stock)', 'warning');
            });
            $('#wishlistClearBtn')?.addEventListener('click', () => {
                if (!confirm('Remove all items from your wishlist?')) return;
                wishlist = [];
                saveAll(); updateWishlistUI();
                if (typeof window.broadcastSync === 'function') window.broadcastSync('wishlist');
                showToast('Wishlist cleared', 'info');
                renderDashboardPage('wishlist'); loadDashboard();
            });
        } else if (page === 'profile') {
            content.innerHTML = `
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                    <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                        <h3 class="font-bold text-sm flex items-center gap-2"><i class="fas fa-user-gear text-brand-600"></i> Profile Settings</h3>
                    </div>
                    <form id="profileForm" class="space-y-4">
                        <div><label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Full Name</label><input type="text" id="pName" value="${escapeHtml(user.name)}" required class="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 outline-none focus:border-brand-500 transition"></div>
                        <div><label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Email</label><input type="email" id="pEmail" value="${escapeHtml(user.email)}" required class="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 outline-none focus:border-brand-500 transition"></div>
                        <div><label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Phone</label><input type="tel" id="pPhone" value="${escapeHtml(user.phone || '')}" class="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 outline-none focus:border-brand-500 transition"></div>
                        <div><label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Role</label><input type="text" value="${user.role}" disabled class="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-slate-100 dark:bg-slate-700 outline-none opacity-60"></div>
                        <button type="submit" class="px-4 py-2.5 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold text-sm flex items-center gap-2 transition">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                    </form>
                </div>
            `;
            $('#profileForm').addEventListener('submit', function (e) {
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

    /* ============================================================
       CHECKOUT
       ============================================================ */
    function checkout() {
        if (!Auth.isAuthenticated()) { showToast('Please sign in to checkout', 'warning'); AuthUI.openAuthModalUI('login'); return; }
        if (cart.length === 0) { showToast('Cart is empty', 'warning'); return; }
        const user = Auth.getCurrentUser();
        const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
        const totalQty = cart.reduce((s, i) => s + i.qty, 0);
        const tier = getBulkDiscount(totalQty);
        const bulkDiscount = subtotal * (tier.percent / 100);
        const afterBulk = subtotal - bulkDiscount;
        const couponDiscount = calculateCouponDiscount(afterBulk);
        const afterCoupon = afterBulk - couponDiscount;
        const shippingCost = calculateShipping(afterCoupon);
        const afterShipping = afterCoupon + shippingCost;
        const userPoints = getUserPoints();
        const maxPointsValue = afterShipping * 0.5;
        const maxRedeemablePts = Math.min(userPoints, Math.floor(maxPointsValue * 100));
        const ptsUsed = Math.min(pointsRedeem, maxRedeemablePts);
        const pointsDiscount = ptsUsed / 100;
        const finalTotal = Math.max(0, afterShipping - pointsDiscount);
        const order = {
            id: 'ORD-' + Date.now().toString().slice(-6),
            date: new Date().toISOString(),
            items: totalQty, subtotal, bulkDiscount, discountPercent: tier.percent,
            coupon: appliedCoupon ? { code: appliedCoupon.code, discount: couponDiscount } : null,
            couponDiscount, shipping: shippingCost, pointsUsed: ptsUsed, pointsDiscount,
            discount: bulkDiscount + couponDiscount + pointsDiscount,
            total: finalTotal, currency: currentCurrency, status: 'processing', cancelled: false,
            itemsList: cart.map(i => ({ id: i.id, cartId: i.cartId || null, name: i.name, price: i.price, image: i.image, qty: i.qty }))
        };
        const orders = Storage.safeGet(Storage.KEYS.ORDERS(user.email), []);
        orders.unshift(order);
        Storage.safeSet(Storage.KEYS.ORDERS(user.email), orders);
        const earnedPoints = Math.floor(finalTotal * 10);
        const newBalance = userPoints - ptsUsed + earnedPoints;
        Storage.safeSet(Storage.KEYS.POINTS(user.email), newBalance);
        cart = []; removeCoupon(); pointsRedeem = 0;
        saveAll(); updateCartUI();
        if (typeof window.broadcastSync === 'function') window.broadcastSync('cart');
        createConfetti();
        $('#cartSidebar').classList.add('translate-x-full');
        $('#cartOverlay').classList.add('hidden');
        showOrderEmail(order);
        showToast(`Order placed! +${earnedPoints} pts`, 'success');
        if (!$('#dashboardWrapper').classList.contains('hidden')) loadDashboard();
    }

    /* ============================================================
       ORDER EMAIL MODAL
       ============================================================ */
    function showOrderEmail(order) {
        const user = Auth.getCurrentUser(); if (!user) return;
        $('#emailTo').textContent = user.email;
        $('#emailSubject').textContent = `Order Confirmation #${order.id}`;
        $('#emailDate').textContent = new Date(order.date).toLocaleString();
        $('#emailOrderId').textContent = `#${order.id}`;
        $('#emailOrderDate').textContent = new Date(order.date).toLocaleString();
        const itemsList = $('#emailItemsList');
        if (itemsList && order.itemsList) {
            itemsList.innerHTML = order.itemsList.slice(0, 5).map(item => `
                <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <img src="${item.image}" class="w-10 h-10 object-cover rounded-lg" alt="">
                    <div class="flex-1 text-sm">
                        <div class="font-semibold line-clamp-1">${escapeHtml(item.name)}</div>
                        <div class="text-xs text-slate-400">Qty ${item.qty} · ${formatPrice(item.price * item.qty)}</div>
                    </div>
                </div>
            `).join('') + (order.itemsList.length > 5 ? `<div class="text-center text-xs text-slate-400 py-2">+ ${order.itemsList.length - 5} more</div>` : '');
        }
        $('#emailSubtotal').textContent = formatPrice(order.subtotal || 0);
        const bulkRow = $('#emailBulkRow');
        if (order.bulkDiscount > 0) { bulkRow.classList.remove('hidden'); bulkRow.classList.add('flex'); $('#emailBulkDiscount').textContent = `-${formatPrice(order.bulkDiscount)}`; }
        else { bulkRow.classList.add('hidden'); bulkRow.classList.remove('flex'); }
        const cpnRow = $('#emailCouponRow');
        if (order.couponDiscount > 0) {
            cpnRow.classList.remove('hidden'); cpnRow.classList.add('flex');
            $('#emailCouponLabel').textContent = order.coupon ? `Coupon (${order.coupon.code})` : 'Coupon';
            $('#emailCouponDiscount').textContent = `-${formatPrice(order.couponDiscount)}`;
        } else { cpnRow.classList.add('hidden'); cpnRow.classList.remove('flex'); }
        const ptsRow = $('#emailPointsRow');
        if (order.pointsDiscount > 0) {
            ptsRow.classList.remove('hidden'); ptsRow.classList.add('flex');
            $('#emailPointsDiscount').textContent = `-${formatPrice(order.pointsDiscount)} (${order.pointsUsed} pts)`;
        } else { ptsRow.classList.add('hidden'); ptsRow.classList.remove('flex'); }
        $('#emailShipping').textContent = order.shipping === 0 ? 'FREE' : formatPrice(order.shipping);
        $('#emailTotal').textContent = formatPrice(order.total);
        const modal = $('#orderEmailModal');
        modal.classList.remove('hidden'); modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
    function closeOrderEmail() {
        const m = $('#orderEmailModal'); if (!m) return;
        m.classList.add('hidden'); m.classList.remove('flex');
        document.body.style.overflow = '';
    }

    /* ============================================================
       ADMIN (full-page)
       ============================================================ */
    function openAdmin() {
        if (!Guards.requireRole('admin')) return;
        $('#mainSections').classList.add('hidden');
        document.querySelector('section.gradient-brand').classList.add('hidden');
        document.querySelector('footer').classList.add('hidden');
        $('#categoryPage').classList.add('hidden');
        $('#comparePage').classList.add('hidden');
        $('#dashboardWrapper').classList.add('hidden');
        $('#adminPage').classList.add('active');
        document.body.style.overflow = '';
        updateAdminCounts();
        renderAdminPanel('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function closeAdmin() {
        $('#adminPage').classList.remove('active');
        if (Auth.isAuthenticated()) showDashboard();
        else {
            $('#mainSections').classList.remove('hidden');
            document.querySelector('section.gradient-brand').classList.remove('hidden');
            document.querySelector('footer').classList.remove('hidden');
        }
    }
    function getAllOrders() {
        const users = Storage.getUsers(); const all = [];
        users.forEach(u => {
            const orders = Storage.safeGet(Storage.KEYS.ORDERS(u.email), []);
            orders.forEach(o => all.push({ ...o, userEmail: u.email, userName: u.name }));
        });
        return all.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    function updateAdminCounts() {
        const users = Storage.getUsers();
        if ($('#adminProductCount')) $('#adminProductCount').textContent = PRODUCTS.length;
        if ($('#adminOrderCount')) $('#adminOrderCount').textContent = getAllOrders().length;
        if ($('#adminUserCount')) $('#adminUserCount').textContent = users.length;
    }
    function renderAdminPanel(panel) {
        $$('.admin-sidebar-item').forEach(i => i.dataset.active = i.dataset.panel === panel ? 'true' : 'false');
        const content = $('#adminContent'); if (!content) return;

        if (panel === 'dashboard') {
            const orders = getAllOrders();
            const users = Storage.getUsers();
            const revenue = orders.reduce((s, o) => s + o.total, 0);
            content.innerHTML = `
                <div class="flex justify-between items-center mb-5 flex-wrap gap-3">
                    <div>
                        <h3 class="text-lg sm:text-xl font-bold flex items-center gap-2"><i class="fas fa-chart-line text-brand-600"></i> Overview</h3>
                        <p class="text-slate-400 text-sm">Welcome back, ${escapeHtml(Auth.getCurrentUser().name.split(' ')[0])}!</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-5">
                    <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-400"></div>
                        <div class="text-xl sm:text-2xl font-extrabold text-brand-600">${PRODUCTS.length}</div>
                        <div class="text-[0.65rem] sm:text-xs text-slate-400 uppercase mt-1">Products</div>
                    </div>
                    <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-400"></div>
                        <div class="text-xl sm:text-2xl font-extrabold text-brand-600">${orders.length}</div>
                        <div class="text-[0.65rem] sm:text-xs text-slate-400 uppercase mt-1">Orders</div>
                    </div>
                    <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-400"></div>
                        <div class="text-xl sm:text-2xl font-extrabold text-brand-600">${users.length}</div>
                        <div class="text-[0.65rem] sm:text-xs text-slate-400 uppercase mt-1">Users</div>
                    </div>
                    <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-400"></div>
                        <div class="text-xl sm:text-2xl font-extrabold text-brand-600">${formatPrice(revenue)}</div>
                        <div class="text-[0.65rem] sm:text-xs text-slate-400 uppercase mt-1">Revenue</div>
                    </div>
                </div>
                <h3 class="font-bold flex items-center gap-2 mb-3"><i class="fas fa-history text-brand-600"></i> Recent Orders</h3>
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-auto max-h-96">
                    <table class="w-full text-xs sm:text-sm min-w-[600px]">
                        <thead class="bg-slate-50 dark:bg-slate-900 sticky top-0">
                            <tr>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Order</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Customer</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Date</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Total</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders.slice(0, 8).map(o => `
                                <tr class="border-b border-slate-200 dark:border-slate-700 hover:bg-brand-50 dark:hover:bg-brand-900/10">
                                    <td class="px-3 sm:px-4 py-3">#${o.id}</td>
                                    <td class="px-3 sm:px-4 py-3">${escapeHtml(o.userName)}</td>
                                    <td class="px-3 sm:px-4 py-3">${new Date(o.date).toLocaleDateString()}</td>
                                    <td class="px-3 sm:px-4 py-3 font-semibold">${formatPrice(o.total)}</td>
                                    <td class="px-3 sm:px-4 py-3"><span class="inline-block px-2 py-0.5 rounded-full text-[0.68rem] font-bold uppercase ${o.cancelled ? 'bg-slate-200 text-slate-600' : o.status === 'delivered' ? 'bg-green-100 text-green-700' : o.status === 'shipped' ? 'bg-blue-100 text-blue-700' : o.status === 'pending' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}">${o.status}</span></td>
                                </tr>
                            `).join('') || '<tr><td colspan="5" class="text-center py-8 text-slate-400">No orders</td></tr>'}
                        </tbody>
                    </table>
                </div>
            `;
        } else if (panel === 'products') {
            content.innerHTML = `
                <div class="flex justify-between items-center mb-5 flex-wrap gap-3">
                    <div>
                        <h3 class="text-lg sm:text-xl font-bold flex items-center gap-2"><i class="fas fa-box text-brand-600"></i> Products</h3>
                        <p class="text-slate-400 text-sm">Manage your inventory (${PRODUCTS.length} items)</p>
                    </div>
                    <button id="addProductBtn" class="bg-gradient-to-r from-brand-600 to-accent-500 text-white font-semibold text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 hover:-translate-y-0.5 transition">
                        <i class="fas fa-plus"></i> Add Product
                    </button>
                </div>
                <div class="mb-4 relative">
                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input type="text" id="adminProductSearch" placeholder="Search products..." class="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-brand-500 transition text-sm">
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-auto max-h-[600px]">
                    <table class="w-full text-xs sm:text-sm min-w-[700px]">
                        <thead class="bg-slate-50 dark:bg-slate-900 sticky top-0">
                            <tr>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Image</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Name</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Tags</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Price</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Stock</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="adminProductTableBody"></tbody>
                    </table>
                </div>
            `;
            renderAdminProducts(PRODUCTS);
            $('#addProductBtn')?.addEventListener('click', () => openProductForm());
            $('#adminProductSearch')?.addEventListener('input', function () {
                const q = this.value.toLowerCase();
                renderAdminProducts(PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)));
            });
        } else if (panel === 'orders') {
            const orders = getAllOrders();
            content.innerHTML = `
                <div class="flex justify-between items-center mb-5 flex-wrap gap-3">
                    <div>
                        <h3 class="text-lg sm:text-xl font-bold flex items-center gap-2"><i class="fas fa-shopping-bag text-brand-600"></i> Orders</h3>
                        <p class="text-slate-400 text-sm">${orders.length} total orders</p>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-auto max-h-[600px]">
                    <table class="w-full text-xs sm:text-sm min-w-[900px]">
                        <thead class="bg-slate-50 dark:bg-slate-900 sticky top-0">
                            <tr>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Order</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Customer</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Total</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Tracking</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Date</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders.length === 0 ? '<tr><td colspan="6" class="text-center py-8 text-slate-400">No orders yet</td></tr>' : orders.map(o => `
                                <tr class="border-b border-slate-200 dark:border-slate-700 hover:bg-brand-50 dark:hover:bg-brand-900/10">
                                    <td class="px-3 sm:px-4 py-3">#${o.id}</td>
                                    <td class="px-3 sm:px-4 py-3">${escapeHtml(o.userName)}</td>
                                    <td class="px-3 sm:px-4 py-3 font-semibold">${formatPrice(o.total)}</td>
                                    <td class="px-3 sm:px-4 py-3">
                                        <input type="text" class="tracking-input w-24 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs" value="${o.trackingNumber || ''}" placeholder="Auto" data-order-id="${o.id}" data-user-email="${o.userEmail}">
                                    </td>
                                    <td class="px-3 sm:px-4 py-3">${new Date(o.date).toLocaleDateString()}</td>
                                    <td class="px-3 sm:px-4 py-3">
                                        <select class="status-select px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold cursor-pointer outline-none" data-order-id="${o.id}" data-user-email="${o.userEmail}">
                                            <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>Processing</option>
                                            <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                                            <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                            <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pending</option>
                                        </select>
                                        <textarea class="admin-note-input mt-1 w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[0.7rem] resize-none" rows="1" placeholder="Add note..." data-order-id="${o.id}" data-user-email="${o.userEmail}">${o.adminNote || ''}</textarea>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            content.querySelectorAll('.status-select').forEach(sel => {
                sel.addEventListener('change', function () {
                    const oid = this.dataset.orderId;
                    const email = this.dataset.userEmail;
                    const st = this.value;
                    const orders = Storage.safeGet(Storage.KEYS.ORDERS(email), []);
                    const idx = orders.findIndex(o => o.id === oid);
                    if (idx > -1) {
                        orders[idx].status = st;
                        const now = new Date().toISOString();
                        if (st === 'shipped' && !orders[idx].shippedAt) orders[idx].shippedAt = now;
                        if (st === 'delivered' && !orders[idx].deliveredAt) orders[idx].deliveredAt = now;
                        if (st === 'shipped' && !orders[idx].trackingNumber) orders[idx].trackingNumber = 'FC-' + Math.random().toString(36).slice(2, 8).toUpperCase();
                        Storage.safeSet(Storage.KEYS.ORDERS(email), orders);
                        showToast(`Order #${oid} → ${st}`, 'success');
                    }
                });
            });
            content.querySelectorAll('.tracking-input').forEach(inp => {
                inp.addEventListener('change', function () {
                    const oid = this.dataset.orderId;
                    const email = this.dataset.userEmail;
                    const orders = Storage.safeGet(Storage.KEYS.ORDERS(email), []);
                    const idx = orders.findIndex(o => o.id === oid);
                    if (idx > -1) {
                        orders[idx].trackingNumber = this.value.trim();
                        Storage.safeSet(Storage.KEYS.ORDERS(email), orders);
                        showToast('Tracking updated', 'success');
                    }
                });
            });
            content.querySelectorAll('.admin-note-input').forEach(inp => {
                inp.addEventListener('blur', function () {
                    const oid = this.dataset.orderId;
                    const email = this.dataset.userEmail;
                    const orders = Storage.safeGet(Storage.KEYS.ORDERS(email), []);
                    const idx = orders.findIndex(o => o.id === oid);
                    if (idx > -1 && orders[idx].adminNote !== this.value) {
                        orders[idx].adminNote = this.value.trim();
                        Storage.safeSet(Storage.KEYS.ORDERS(email), orders);
                        showToast('Note saved', 'info');
                    }
                });
            });
        } else if (panel === 'users') {
            const users = Storage.getUsers();
            content.innerHTML = `
                <div class="flex justify-between items-center mb-5 flex-wrap gap-3">
                    <div>
                        <h3 class="text-lg sm:text-xl font-bold flex items-center gap-2"><i class="fas fa-users text-brand-600"></i> Users</h3>
                        <p class="text-slate-400 text-sm">${users.length} registered users</p>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-auto max-h-[600px]">
                    <table class="w-full text-xs sm:text-sm min-w-[700px]">
                        <thead class="bg-slate-50 dark:bg-slate-900 sticky top-0">
                            <tr>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Name</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Email</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Phone</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Role</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Orders</th>
                                <th class="px-3 sm:px-4 py-3 text-left text-[0.7rem] font-bold uppercase text-slate-400">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(u => {
                const orders = Storage.safeGet(Storage.KEYS.ORDERS(u.email), []);
                return `<tr class="border-b border-slate-200 dark:border-slate-700 hover:bg-brand-50 dark:hover:bg-brand-900/10">
                                    <td class="px-3 sm:px-4 py-3">${escapeHtml(u.name)}</td>
                                    <td class="px-3 sm:px-4 py-3">${escapeHtml(u.email)}</td>
                                    <td class="px-3 sm:px-4 py-3">${escapeHtml(u.phone || '—')}</td>
                                    <td class="px-3 sm:px-4 py-3">
                                        <span class="inline-block px-2 py-0.5 rounded-full text-[0.68rem] font-bold uppercase ${u.role === 'admin' ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white' : 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300'}">${u.role || 'customer'}</span>
                                    </td>
                                    <td class="px-3 sm:px-4 py-3">${orders.length}</td>
                                    <td class="px-3 sm:px-4 py-3">${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                                </tr>`;
            }).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }
    function renderAdminProducts(products) {
        const tbody = $('#adminProductTableBody'); if (!tbody) return;
        tbody.innerHTML = products.map(p => `
            <tr class="border-b border-slate-200 dark:border-slate-700 hover:bg-brand-50 dark:hover:bg-brand-900/10">
                <td class="px-3 sm:px-4 py-3"><img src="${p.image}" class="w-10 h-10 object-cover rounded-lg" alt=""></td>
                <td class="px-3 sm:px-4 py-3 font-semibold">${escapeHtml(p.name)}</td>
                <td class="px-3 sm:px-4 py-3">${(p.tags || []).map(t => `<span class="inline-block px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold bg-slate-100 dark:bg-slate-700 mr-1">${t}</span>`).join('') || '—'}</td>
                <td class="px-3 sm:px-4 py-3 font-semibold">${formatPrice(p.price)}</td>
                <td class="px-3 sm:px-4 py-3">${p.stock}</td>
                <td class="px-3 sm:px-4 py-3">
                    <div class="flex gap-1.5">
                        <button class="admin-btn-icon edit w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 hover:bg-brand-600 hover:text-white flex items-center justify-center transition text-xs" data-id="${p.id}" aria-label="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="admin-btn-icon delete w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition text-xs" data-id="${p.id}" aria-label="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="6" class="text-center py-8 text-slate-400">No products</td></tr>';
        tbody.querySelectorAll('.admin-btn-icon.edit').forEach(b => b.addEventListener('click', function () { openProductForm(parseInt(this.dataset.id)); }));
        tbody.querySelectorAll('.admin-btn-icon.delete').forEach(b => b.addEventListener('click', function () {
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
            $('#productFormTags').value = (p.tags || []).join(', ');
        } else {
            $('#productFormTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Add Product';
        }
        modal.classList.remove('hidden'); modal.classList.add('flex');
    }
    function closeProductForm() {
        const m = $('#productFormModal'); if (!m) return;
        m.classList.add('hidden'); m.classList.remove('flex');
    }
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
            image: $('#productFormImage').value.trim(),
            tags: $('#productFormTags').value.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
        };
        if (!data.name || !data.price || isNaN(data.stock) || !data.image) { showToast('Please fill all required fields', 'error'); return; }
        data.images = [data.image];
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

    /* ============================================================
       SEARCH WITH FILTERS
       ============================================================ */
    let searchFilters = { category: 'all', priceMin: null, priceMax: null };
    function renderSearchCatChips() {
        const c = $('#searchCatChips'); if (!c) return;
        const cats = ['all', ...CATEGORIES.map(x => x.key)];
        c.innerHTML = cats.map(cat => `
            <button class="search-cat-chip px-2.5 py-1 rounded-full text-[0.7rem] font-semibold border transition ${searchFilters.category === cat ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-500'}" data-cat="${cat}">
                ${cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
        `).join('');
        c.querySelectorAll('.search-cat-chip').forEach(chip => chip.addEventListener('click', function () {
            searchFilters.category = this.dataset.cat;
            renderSearchCatChips();
            handleSearch($('#searchInput').value);
        }));
    }
    function applySearchFilters(list) {
        let r = list;
        if (searchFilters.category !== 'all') r = r.filter(p => p.category === searchFilters.category);
        if (searchFilters.priceMin != null && !isNaN(searchFilters.priceMin)) r = r.filter(p => p.price >= searchFilters.priceMin);
        if (searchFilters.priceMax != null && !isNaN(searchFilters.priceMax)) r = r.filter(p => p.price <= searchFilters.priceMax);
        return r;
    }
    function handleSearch(q) {
        const box = $('#searchSuggestions');
        const results = $('#searchResults');
        const filters = $('#searchFilters');
        if (!box || !results) return;
        const query = (q || '').toLowerCase().trim();
        const hasFilter = searchFilters.category !== 'all' || searchFilters.priceMin != null || searchFilters.priceMax != null;
        if (!query && !hasFilter) { box.classList.add('hidden'); box.classList.remove('flex'); return; }
        filters.classList.remove('hidden');
        renderSearchCatChips();
        let matches = query
            ? PRODUCTS.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query) || (p.tags || []).some(t => t.includes(query)))
            : [...PRODUCTS];
        matches = applySearchFilters(matches);
        const top = matches.slice(0, 12);
        if (top.length === 0) {
            results.innerHTML = `<div class="p-5 text-center text-slate-400 text-sm"><i class="fas fa-search mb-1 block opacity-40"></i>No results${query ? ` for "${escapeHtml(q)}"` : ''}</div>`;
        } else {
            results.innerHTML = top.map(p => `
                <div class="suggestion-item flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-900/30 transition" data-id="${p.id}">
                    <img src="${p.image}" class="w-10 h-10 object-cover rounded-lg shrink-0" alt="">
                    <div class="min-w-0 flex-1">
                        <div class="font-medium text-sm line-clamp-1">${escapeHtml(p.name)}</div>
                        <div class="flex items-center gap-2 mt-0.5">
                            <span class="font-semibold text-xs text-brand-600 dark:text-brand-400">${formatPrice(p.price)}</span>
                            <span class="text-[0.65rem] text-slate-400 uppercase">${p.category}</span>
                        </div>
                    </div>
                    ${p.stock === 0 ? '<span class="text-[0.65rem] text-red-500 font-bold">Out</span>' : ''}
                </div>
            `).join('') + (matches.length > 12 ? `<div class="p-3 text-center text-xs text-slate-400">+ ${matches.length - 12} more</div>` : '');
            results.querySelectorAll('.suggestion-item').forEach(item => item.addEventListener('click', function () {
                const id = parseInt(this.dataset.id);
                const prod = PRODUCTS.find(p => p.id === id);
                if (prod) { box.classList.add('hidden'); box.classList.remove('flex'); showCategory(prod.category); setTimeout(() => openProductDetail(id), 200); }
                $('#searchInput').value = '';
            }));
        }
        box.classList.remove('hidden');
        box.classList.add('flex');
    }

    /* ============================================================
       INIT
       ============================================================ */
    function init() {
        // First render: category cards
        renderCategoryCards();
        // Skeleton for product grid
        renderSkeletons($('#productGrid'), 8);
        setTimeout(() => rerenderAll(), 350);

        updateCartUI();
        updateWishlistUI();
        updateCompareUI();
        renderRecentlyViewed();

        // Currency selector
        const currSel = $('#currencySelect');
        if (currSel) {
            currSel.value = currentCurrency;
            currSel.addEventListener('change', function () {
                currentCurrency = this.value;
                Storage.safeSet(Storage.KEYS.CURRENCY, currentCurrency);
                rerenderAll(); updateCartUI();
                if (!$('#categoryPage').classList.contains('hidden') && currentCategory) renderCategoryWithFilters();
                if (!$('#dashboardWrapper').classList.contains('hidden')) loadDashboard();
                if (!$('#comparePage').classList.contains('hidden')) renderComparePage();
                if (detailProductId) {
                    const p = PRODUCTS.find(x => x.id === detailProductId);
                    if (p) {
                        $('#detailPrice').textContent = formatPrice(p.price * SIZE_MULTIPLIERS[detailSize]);
                        if (p.oldPrice) $('#detailOldPrice').textContent = formatPrice(p.oldPrice);
                        renderDetailSizes();
                        updateDetailTotal();
                    }
                }
                showToast(`Currency: ${currentCurrency}`, 'info');
                if (typeof window.broadcastSync === 'function') window.broadcastSync('currency');
            });
        }

        // Flash sale timer
        const endTime = Date.now() + 8 * 3600000 + 45 * 60000;
        setInterval(() => {
            const d = endTime - Date.now(); if (d < 0) return;
            if ($('#flashHours')) $('#flashHours').textContent = String(Math.floor(d / 3600000)).padStart(2, '0');
            if ($('#flashMinutes')) $('#flashMinutes').textContent = String(Math.floor(d % 3600000 / 60000)).padStart(2, '0');
            if ($('#flashSeconds')) $('#flashSeconds').textContent = String(Math.floor(d % 60000 / 1000)).padStart(2, '0');
        }, 1000);

        // Category page filters
        $('#backFromCategory')?.addEventListener('click', hideCategoryPage);
        $('#categorySort')?.addEventListener('change', function () { currentSort = this.value; renderCategoryWithFilters(); });
        $('#priceApplyBtn')?.addEventListener('click', () => {
            const min = $('#priceMin').value; const max = $('#priceMax').value;
            currentPriceMin = min === '' ? null : parseFloat(min);
            currentPriceMax = max === '' ? null : parseFloat(max);
            renderCategoryWithFilters();
        });
        $('#priceClearBtn')?.addEventListener('click', () => {
            currentPriceMin = null; currentPriceMax = null;
            $('#priceMin').value = ''; $('#priceMax').value = '';
            renderCategoryWithFilters();
        });
        document.querySelectorAll('.price-chip').forEach(chip => chip.addEventListener('click', function () {
            const min = parseFloat(this.dataset.min); const max = parseFloat(this.dataset.max);
            $('#priceMin').value = min;
            $('#priceMax').value = max === 99999 ? '' : max;
            currentPriceMin = min;
            currentPriceMax = max === 99999 ? null : max;
            renderCategoryWithFilters();
        }));

        // Home link
        $('#homeLink')?.addEventListener('click', function () {
            if (!$('#categoryPage').classList.contains('hidden')) hideCategoryPage();
            if (!$('#dashboardWrapper').classList.contains('hidden')) hideDashboard();
            if (!$('#comparePage').classList.contains('hidden')) hideComparePage();
            if ($('#adminPage').classList.contains('active')) closeAdmin();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Search
        $('#searchInput')?.addEventListener('input', function () { handleSearch(this.value); });
        $('#searchPriceMin')?.addEventListener('input', function () {
            searchFilters.priceMin = this.value === '' ? null : parseFloat(this.value);
            handleSearch($('#searchInput').value);
        });
        $('#searchPriceMax')?.addEventListener('input', function () {
            searchFilters.priceMax = this.value === '' ? null : parseFloat(this.value);
            handleSearch($('#searchInput').value);
        });
        $('#searchClearFilters')?.addEventListener('click', () => {
            searchFilters = { category: 'all', priceMin: null, priceMax: null };
            $('#searchPriceMin').value = ''; $('#searchPriceMax').value = '';
            handleSearch($('#searchInput').value);
        });
        $('#searchToggle')?.addEventListener('click', function (e) {
            e.stopPropagation();
            const w = $('#searchWrapper'); if (!w) return;
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
                $('#searchSuggestions')?.classList.remove('flex');
            }
        });

        // Cart
        $('#cartOpen')?.addEventListener('click', () => {
            $('#cartSidebar').classList.remove('translate-x-full');
            $('#cartOverlay').classList.remove('hidden');
        });
        $('#cartClose')?.addEventListener('click', () => {
            $('#cartSidebar').classList.add('translate-x-full');
            $('#cartOverlay').classList.add('hidden');
        });
        $('#cartOverlay')?.addEventListener('click', () => {
            $('#cartSidebar').classList.add('translate-x-full');
            $('#cartOverlay').classList.add('hidden');
        });
        $('#checkoutBtn')?.addEventListener('click', checkout);

        // Coupon
        $('#couponApplyBtn')?.addEventListener('click', () => {
            const code = $('#couponInput')?.value || '';
            const result = applyCoupon(code);
            if (!result.ok) {
                const err = $('#couponError');
                if (err) { err.textContent = result.error; err.classList.remove('hidden'); }
                showToast(result.error, 'error');
                return;
            }
            if ($('#couponInput')) $('#couponInput').value = '';
            $('#couponError')?.classList.add('hidden');
            updateCartUI();
            showToast(`Coupon ${appliedCoupon.code} applied!`, 'success');
            if (typeof window.broadcastSync === 'function') window.broadcastSync('cart');
        });
        $('#couponInput')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); $('#couponApplyBtn')?.click(); }
        });
        $('#couponRemoveBtn')?.addEventListener('click', () => {
            removeCoupon(); pointsRedeem = 0; updateCartUI();
            showToast('Coupon removed', 'info');
            if (typeof window.broadcastSync === 'function') window.broadcastSync('cart');
        });
        $('#pointsRange')?.addEventListener('input', function () { pointsRedeem = parseInt(this.value) || 0; updateCartUI(); });
        $('#pointsInput')?.addEventListener('input', function () {
            const max = parseInt(this.max) || 0;
            let v = parseInt(this.value) || 0;
            if (v > max) v = max; if (v < 0) v = 0;
            pointsRedeem = Math.floor(v / 100) * 100;
            updateCartUI();
        });

        // Global delegation
        document.addEventListener('click', function (e) {
            // Quick View button
            const qvBtn = e.target.closest('.quick-view-btn');
            if (qvBtn) {
                e.preventDefault(); e.stopPropagation();
                openProductDetail(parseInt(qvBtn.dataset.id));
                return;
            }
            // Image wrapper (open product)
            const imageWrap = e.target.closest('.product-image-wrapper');
            if (imageWrap && !e.target.closest('.wishlist-btn') && !e.target.closest('.compare-btn') && !e.target.closest('.quick-view-btn')) {
                const card = imageWrap.closest('.product-card');
                if (card) { openProductDetail(parseInt(card.dataset.id)); return; }
            }
            const addBtn = e.target.closest('.add-cart');
            if (addBtn) { e.preventDefault(); e.stopPropagation(); if (!addBtn.disabled) addToCart(parseInt(addBtn.dataset.id)); return; }
            const wishBtn = e.target.closest('.wishlist-btn');
            if (wishBtn) { e.preventDefault(); e.stopPropagation(); toggleWishlist(parseInt(wishBtn.dataset.id)); return; }
            const cmpBtn = e.target.closest('.compare-btn');
            if (cmpBtn) {
                e.preventDefault(); e.stopPropagation();
                const id = parseInt(cmpBtn.dataset.id);
                if (compareList.includes(id)) removeFromCompare(id);
                else addToCompare(id);
                rerenderAll();
                if (!$('#categoryPage').classList.contains('hidden') && currentCategory) renderCategoryWithFilters();
                return;
            }
            const wlAdd = e.target.closest('.wl-add');
            if (wlAdd) { e.preventDefault(); addToCart(parseInt(wlAdd.dataset.id)); return; }
            const wlRemove = e.target.closest('.wl-remove');
            if (wlRemove) { e.preventDefault(); toggleWishlist(parseInt(wlRemove.dataset.id)); renderDashboardPage('wishlist'); return; }
            const qtyDec = e.target.closest('.qty-dec');
            if (qtyDec) { const k = qtyDec.dataset.key; updateQty(isNaN(k) ? k : parseInt(k), -1); return; }
            const qtyInc = e.target.closest('.qty-inc');
            if (qtyInc) { const k = qtyInc.dataset.key; updateQty(isNaN(k) ? k : parseInt(k), 1); return; }
            const cartRemove = e.target.closest('.cart-item-remove');
            if (cartRemove) { const k = cartRemove.dataset.key; removeFromCart(isNaN(k) ? k : parseInt(k)); return; }
            const cancelBtn = e.target.closest('.cancel-order-btn');
            if (cancelBtn) { cancelOrder(cancelBtn.dataset.id); return; }
            const buyAgainBtn = e.target.closest('.buy-again-btn');
            if (buyAgainBtn) { buyAgain(buyAgainBtn.dataset.id); return; }
        });

        // Detail modal
        $('#productDetailClose')?.addEventListener('click', closeProductDetail);
        $('#productDetailModal')?.addEventListener('click', function (e) { if (e.target === this) closeProductDetail(); });
        $('#detailQtyDec')?.addEventListener('click', () => {
            if (detailQty > 1) { detailQty--; $('#detailQty').textContent = detailQty; updateDetailTotal(); updateBulkDiscountHint(); }
        });
        $('#detailQtyInc')?.addEventListener('click', () => {
            const p = PRODUCTS.find(x => x.id === detailProductId);
            if (detailQty < (p?.stock || 99)) { detailQty++; $('#detailQty').textContent = detailQty; updateDetailTotal(); updateBulkDiscountHint(); }
        });
        $('#detailAddToCart')?.addEventListener('click', addDetailToCart);
        $('#detailWishlist')?.addEventListener('click', () => {
            if (!detailProductId) return;
            toggleWishlist(detailProductId);
            const inWish = wishlist.includes(detailProductId);
            const wlBtn = $('#detailWishlist');
            wlBtn.classList.toggle('border-red-500', inWish);
            wlBtn.classList.toggle('text-red-500', inWish);
            wlBtn.classList.toggle('border-slate-200', !inWish);
            wlBtn.classList.toggle('text-slate-400', !inWish);
        });

        // Image zoom + swipe
        const detailImg = $('#detailImage'); const detailWrap = $('#detailImageWrap');
        if (detailWrap && detailImg) {
            detailWrap.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                detailImg.style.transformOrigin = `${x}% ${y}%`;
                detailImg.style.transform = 'scale(2)';
            });
            detailWrap.addEventListener('mouseleave', function () {
                detailImg.style.transform = 'scale(1)';
                detailImg.style.transformOrigin = 'center center';
            });
            let touchStartX = 0;
            detailWrap.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
            detailWrap.addEventListener('touchend', function (e) {
                const p = PRODUCTS.find(x => x.id === detailProductId); if (!p) return;
                const imgs = (p.images && p.images.length) ? p.images : [p.image];
                if (imgs.length < 2) return;
                const dx = e.changedTouches[0].clientX - touchStartX;
                if (Math.abs(dx) > 40) {
                    if (dx < 0) detailImageIndex = (detailImageIndex + 1) % imgs.length;
                    else detailImageIndex = (detailImageIndex - 1 + imgs.length) % imgs.length;
                    renderDetailGallery(imgs, detailImageIndex);
                }
            }, { passive: true });
        }

        // Reviews
        $('#writeReviewBtn')?.addEventListener('click', () => {
            const user = Auth.getCurrentUser();
            if (!user) { showToast('Please sign in to review', 'warning'); AuthUI.openAuthModalUI('login'); return; }
            if (!hasUserPurchased()) { showToast('Only verified buyers can review', 'info'); return; }
            if (hasUserReviewed(detailProductId)) { showToast('Already reviewed', 'info'); return; }
            $('#reviewForm').classList.remove('hidden');
            reviewDraftRating = 0;
            renderReviewStarInput();
            $('#reviewText').focus();
        });
        $('#reviewCancelBtn')?.addEventListener('click', () => {
            $('#reviewForm').classList.add('hidden');
            reviewDraftRating = 0;
            $('#reviewText').value = '';
            $('#reviewCharCount').textContent = '0';
        });
        $('#reviewText')?.addEventListener('input', function () { $('#reviewCharCount').textContent = this.value.length; });
        $('#reviewSubmitBtn')?.addEventListener('click', () => {
            const user = Auth.getCurrentUser(); if (!user) return;
            if (reviewDraftRating < 1) { showToast('Please select a rating', 'warning'); return; }
            const text = $('#reviewText').value.trim();
            if (text.length < 5) { showToast('Write at least 5 characters', 'warning'); return; }
            saveReview(detailProductId, {
                userId: user.id, userName: user.name, rating: reviewDraftRating,
                text, date: new Date().toISOString(), verified: true
            });
            const p = PRODUCTS.find(x => x.id === detailProductId);
            if (p) {
                $('#detailStars').innerHTML = getStars(p.rating);
                $('#detailReviews').textContent = `(${p.reviewCount} reviews)`;
            }
            $('#reviewForm').classList.add('hidden');
            $('#reviewText').value = '';
            $('#reviewCharCount').textContent = '0';
            reviewDraftRating = 0;
            renderReviews(detailProductId);
            rerenderAll();
            showToast('Review submitted! Thanks', 'success');
        });

        // Order email
        $('#emailViewOrderBtn')?.addEventListener('click', () => {
            closeOrderEmail();
            showDashboard();
            setTimeout(() => {
                $$('.dash-nav-item[data-page]').forEach(i => i.dataset.active = i.dataset.page === 'orders' ? 'true' : 'false');
                renderDashboardPage('orders');
            }, 150);
        });
        $('#emailContinueBtn')?.addEventListener('click', closeOrderEmail);
        $('#orderEmailModal')?.addEventListener('click', function (e) { if (e.target === this) closeOrderEmail(); });

        // Compare
        $('#compareClearBtn')?.addEventListener('click', () => { clearCompare(); showToast('Compare cleared', 'info'); });
        $('#compareNowBtn')?.addEventListener('click', showComparePage);
        $('#backFromCompare')?.addEventListener('click', hideComparePage);
        $('#compareOpen')?.addEventListener('click', showComparePage);

        // Wishlist header
        $('#wishlistOpen')?.addEventListener('click', () => {
            if (wishlist.length === 0) { showToast('Wishlist is empty', 'info'); return; }
            if (!Guards.requireAuth()) return;
            showDashboard();
            setTimeout(() => {
                $$('.dash-nav-item[data-page]').forEach(i => i.dataset.active = i.dataset.page === 'wishlist' ? 'true' : 'false');
                renderDashboardPage('wishlist');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        });

        // Theme toggle
        $('#themeToggle')?.addEventListener('click', function (e) {
            e.preventDefault(); e.stopPropagation();
            const isDark = document.documentElement.classList.contains('dark');
            if (isDark) { document.documentElement.classList.remove('dark'); theme = 'light'; }
            else { document.documentElement.classList.add('dark'); theme = 'dark'; }
            Storage.safeSet(Storage.KEYS.THEME, theme);
            if (typeof window.broadcastSync === 'function') window.broadcastSync('theme');
        });

        // Scroll to top
        const scrollBtn = $('#scrollTopBtn');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 400) {
                scrollBtn.classList.remove('opacity-0', 'pointer-events-none');
                scrollBtn.classList.add('opacity-100');
            } else {
                scrollBtn.classList.add('opacity-0', 'pointer-events-none');
                scrollBtn.classList.remove('opacity-100');
            }
        });
        scrollBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        // Dashboard nav items
        $$('.dash-nav-item[data-page]').forEach(i => i.addEventListener('click', function () {
            $$('.dash-nav-item[data-page]').forEach(x => x.dataset.active = 'false');
            this.dataset.active = 'true';
            renderDashboardPage(this.dataset.page);
        }));
        $('#logoutSidebarBtn')?.addEventListener('click', () => {
            Auth.logoutUser(); hideDashboard();
            if (typeof window.broadcastSync === 'function') window.broadcastSync('logout');
            showToast('Signed out successfully', 'info');
        });
        $('#sidebarShopBtn')?.addEventListener('click', () => {
            hideDashboard();
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        });
        $('#sidebarAdminBtn')?.addEventListener('click', () => {
            if (Guards.requireRole('admin')) openAdmin();
        });

        // Mobile dashboard sidebar
        document.addEventListener('click', function (e) {
            if (e.target.closest('[data-toggle-dash-sidebar]')) {
                const sidebar = $('#dashboardSidebar'); const overlay = $('#sidebarOverlay');
                if (sidebar && overlay) {
                    sidebar.classList.toggle('-translate-x-full');
                    sidebar.classList.toggle('translate-x-0');
                    overlay.style.display = sidebar.classList.contains('translate-x-0') ? 'block' : 'none';
                }
            }
        });
        $('#sidebarOverlay')?.addEventListener('click', function () {
            $('#dashboardSidebar')?.classList.add('-translate-x-full');
            $('#dashboardSidebar')?.classList.remove('translate-x-0');
            this.style.display = 'none';
        });

        // Admin page
        $('#adminClose')?.addEventListener('click', closeAdmin);
        $$('.admin-sidebar-item[data-panel]').forEach(i => i.addEventListener('click', function () {
            renderAdminPanel(this.dataset.panel);
        }));
        $('#productForm')?.addEventListener('submit', saveProduct);
        $('#productFormCancel')?.addEventListener('click', closeProductForm);
        $('#productFormModal')?.addEventListener('click', function (e) { if (e.target === this) closeProductForm(); });

        // Mobile menu
        $('#hamburgerBtn')?.addEventListener('click', function () {
            const m = $('#mobileMenu');
            m.classList.toggle('hidden'); m.classList.toggle('flex');
            this.querySelector('i').className = !m.classList.contains('hidden') ? 'fas fa-times' : 'fas fa-bars';
        });
        $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => {
            $('#mobileMenu').classList.add('hidden');
            $('#mobileMenu').classList.remove('flex');
            $('#hamburgerBtn').querySelector('i').className = 'fas fa-bars';
        }));
        $('#mobileSignIn')?.addEventListener('click', () => { AuthUI.openAuthModalUI('login'); $('#mobileMenu').classList.add('hidden'); });
        $('#mobileSignUp')?.addEventListener('click', () => { AuthUI.openAuthModalUI('signup'); $('#mobileMenu').classList.add('hidden'); });
        $('#navLoginBtn')?.addEventListener('click', () => AuthUI.openAuthModalUI('login'));
        $('#navSignupBtn')?.addEventListener('click', () => AuthUI.openAuthModalUI('signup'));

        // User dropdown
        $('#ddDashboard')?.addEventListener('click', () => { if (Guards.requireAuth()) showDashboard(); });
        $('#ddProfile')?.addEventListener('click', () => {
            if (!Guards.requireAuth()) return;
            showDashboard();
            setTimeout(() => {
                $$('.dash-nav-item[data-page]').forEach(i => i.dataset.active = i.dataset.page === 'profile' ? 'true' : 'false');
                renderDashboardPage('profile');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        });
        $('#ddOrders')?.addEventListener('click', () => {
            if (!Guards.requireAuth()) return;
            showDashboard();
            setTimeout(() => {
                $$('.dash-nav-item[data-page]').forEach(i => i.dataset.active = i.dataset.page === 'orders' ? 'true' : 'false');
                renderDashboardPage('orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        });
        $('#ddWishlist')?.addEventListener('click', () => {
            if (!Guards.requireAuth()) return;
            showDashboard();
            setTimeout(() => {
                $$('.dash-nav-item[data-page]').forEach(i => i.dataset.active = i.dataset.page === 'wishlist' ? 'true' : 'false');
                renderDashboardPage('wishlist');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        });
        $('#ddAdminPanel')?.addEventListener('click', () => { if (Guards.requireRole('admin')) openAdmin(); });
        $('#ddLogout')?.addEventListener('click', () => {
            Auth.logoutUser(); hideDashboard();
            if (typeof window.broadcastSync === 'function') window.broadcastSync('logout');
            showToast('Signed out successfully', 'info');
        });

        // Nav links
        $('#dashboardNav')?.addEventListener('click', function (e) { e.preventDefault(); if (Guards.requireAuth()) showDashboard(); });
        $('#adminNav')?.addEventListener('click', function (e) { e.preventDefault(); if (Guards.requireRole('admin')) openAdmin(); });
        $('#mobileDashboardNav')?.addEventListener('click', function (e) { e.preventDefault(); if (Guards.requireAuth()) showDashboard(); $('#mobileMenu').classList.add('hidden'); });
        $('#mobileAdminNav')?.addEventListener('click', function (e) { e.preventDefault(); if (Guards.requireRole('admin')) openAdmin(); $('#mobileMenu').classList.add('hidden'); });

        // Newsletter
        $('#newsletterForm')?.addEventListener('submit', function (e) { e.preventDefault(); showToast('Subscribed!', 'success'); this.reset(); });

        // Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                if (!$('#cartSidebar').classList.contains('translate-x-full')) { $('#cartSidebar').classList.add('translate-x-full'); $('#cartOverlay').classList.add('hidden'); }
                if ($('#adminPage').classList.contains('active')) closeAdmin();
                if (!$('#productFormModal').classList.contains('hidden')) closeProductForm();
                if (!$('#authModal').classList.contains('hidden')) AuthUI.closeAuthModalUI();
                if (!$('#productDetailModal').classList.contains('hidden')) closeProductDetail();
                if (!$('#orderEmailModal').classList.contains('hidden')) closeOrderEmail();
            }
        });

        // Header shadow on scroll
        window.addEventListener('scroll', function () {
            const h = $('#mainHeader');
            if (window.pageYOffset > 20) h?.classList.add('shadow-lg');
            else h?.classList.remove('shadow-lg');
        });

        // Restore filter state
        restoreFilterState();
    }

    return { init, showDashboard, hideDashboard, openAdmin, closeAdmin };
})();

/* ============================================================
   HELPERS
   ============================================================ */
function showToast(msg, type = 'success') {
    const c = document.getElementById('toastContainer'); if (!c) return;
    const icons = {
        success: 'fa-check-circle text-green-500',
        error: 'fa-exclamation-circle text-red-500',
        warning: 'fa-exclamation-triangle text-amber-500',
        info: 'fa-info-circle text-brand-500'
    };
    const t = document.createElement('div');
    t.className = `bg-white dark:bg-slate-800 p-3.5 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-sm font-medium pointer-events-auto animate-slideInRight`;
    t.innerHTML = `<i class="fas ${icons[type]}"></i><span class="flex-1">${msg}</span>`;
    c.appendChild(t);
    setTimeout(() => {
        t.classList.add('animate-slideOutRight');
        setTimeout(() => t.remove(), 300);
    }, 3200);
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
        if (guest) guest.style.display = 'flex';
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

/* ============================================================
   PWA
   ============================================================ */
(function initPWA() {
    if ('serviceWorker' in navigator) {
        const swCode = `
            const CACHE_NAME = 'furnicraft-v1';
            const CORE = ['./','styles.css','app.js','https://cdn.tailwindcss.com','https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'];
            self.addEventListener('install', e => {
                e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE).catch(() => {})));
                self.skipWaiting();
            });
            self.addEventListener('activate', e => {
                e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
                self.clients.claim();
            });
            self.addEventListener('fetch', e => {
                if (e.request.method !== 'GET') return;
                e.respondWith(
                    caches.match(e.request).then(cached => {
                        const p = fetch(e.request).then(res => {
                            if (res && res.status === 200) {
                                const clone = res.clone();
                                caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                            }
                            return res;
                        }).catch(() => cached);
                        return cached || p;
                    })
                );
            });
        `;
        const blob = new Blob([swCode], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);
        navigator.serviceWorker.register(swUrl).catch(err => console.warn('SW failed:', err));
    }
    let deferredPrompt = null;
    const banner = document.getElementById('pwaInstallBanner');
    if (localStorage.getItem('pwa_dismissed_until') > Date.now()) return;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (banner) banner.classList.remove('hidden');
    });
    document.getElementById('pwaInstallBtn')?.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') showToast('FurniCraft installed!', 'success');
        deferredPrompt = null;
        banner?.classList.add('hidden');
    });
    function dismiss() {
        banner?.classList.add('hidden');
        localStorage.setItem('pwa_dismissed_until', Date.now() + 7 * 24 * 3600 * 1000);
    }
    document.getElementById('pwaDismissBtn')?.addEventListener('click', dismiss);
    document.getElementById('pwaCloseBtn')?.addEventListener('click', dismiss);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isIOS && !isStandalone && banner && !localStorage.getItem('pwa_dismissed_until')) {
        setTimeout(() => banner.classList.remove('hidden'), 3000);
        const ib = document.getElementById('pwaInstallBtn');
        if (ib) ib.onclick = () => showToast('Tap Share then "Add to Home Screen"', 'info');
    }
})();

/* ============================================================
   CROSS-TAB SYNC
   ============================================================ */
(function initCrossTabSync() {
    const SYNC_CHANNEL = 'furnicraft_sync';
    let bc = null;
    if ('BroadcastChannel' in window) bc = new BroadcastChannel(SYNC_CHANNEL);
    window.broadcastSync = function (type) {
        const payload = { type, ts: Date.now() };
        try { bc?.postMessage(payload); } catch (_) { }
        try { localStorage.setItem('furni_sync_ping', JSON.stringify(payload)); } catch (_) { }
    };
    function handleSync(type) {
        if (type === 'cart' || type === 'wishlist' || type === 'logout' || type === 'currency' || type === 'compare') location.reload();
        else if (type === 'theme') {
            try {
                const t = JSON.parse(localStorage.getItem('furni_theme') || '"light"');
                if (t === 'dark') document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
            } catch (_) { }
        }
    }
    if (bc) bc.onmessage = (e) => { if (e.data && e.data.type) handleSync(e.data.type); };
    window.addEventListener('storage', (e) => {
        if (e.key === 'furni_sync_ping' && e.newValue) {
            try { handleSync(JSON.parse(e.newValue).type); } catch (_) { }
        }
        if (e.key === 'furni_wishlist' || e.key === 'furni_cart') location.reload();
        if (e.key === 'furni_theme') {
            try {
                const t = JSON.parse(e.newValue || '"light"');
                if (t === 'dark') document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
            } catch (_) { }
        }
        if (e.key === 'furni_session' && e.newValue === null) location.reload();
    });
})();