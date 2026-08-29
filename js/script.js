<script>
        (function () {
            // ===== PRODUCT DATA =====
            const FEATURED = [
                { id: 1, name: 'Luxury Velvet Sofa', price: 899.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Elegant velvet with premium cushioning.' },
                { id: 2, name: 'Modern Armchair', price: 349.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ergonomic design with stylish fabric.' },
                { id: 3, name: 'Oak Dining Table', price: 599.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Solid oak, extendable for gatherings.' },
                { id: 4, name: 'Minimalist Bed Frame', price: 749.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Clean lines, sturdy construction.' }
            ];

            const CATEGORIES = [{
                key: 'living',
                label: 'Living Room',
                icon: 'fa-couch',
                image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                products: [
                    { id: 101, name: 'Sectional Sofa', price: 1299.99, desc: 'Spacious L-shaped sectional.' },
                    { id: 102, name: 'Coffee Table', price: 299.99, desc: 'Minimalist wood and glass.' },
                    { id: 103, name: 'TV Stand', price: 449.99, desc: 'Modern media console.' },
                    { id: 104, name: 'Accent Chair', price: 249.99, desc: 'Mid-century modern style.' },
                    { id: 105, name: 'Rug', price: 189.99, desc: 'Wool blend, geometric pattern.' },
                    { id: 106, name: 'Floor Lamp', price: 159.99, desc: 'Adjustable arc lamp.' },
                    { id: 107, name: 'Bookshelf', price: 399.99, desc: '5-tier open shelving.' },
                    { id: 108, name: 'Ottoman', price: 199.99, desc: 'Tufted storage ottoman.' },
                    { id: 109, name: 'Wall Art', price: 129.99, desc: 'Abstract canvas set.' },
                    { id: 110, name: 'Pouf', price: 89.99, desc: 'Knitted cotton pouf.' }
                ]
            }, {
                key: 'bedroom',
                label: 'Bedroom',
                icon: 'fa-bed',
                image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                products: [
                    { id: 201, name: 'King Bed Frame', price: 999.99, desc: 'Upholstered headboard.' },
                    { id: 202, name: 'Nightstand', price: 199.99, desc: 'Solid wood, two drawers.' },
                    { id: 203, name: 'Dresser', price: 549.99, desc: '6-drawer modern dresser.' },
                    { id: 204, name: 'Mirror', price: 129.99, desc: 'Floor-length arched mirror.' },
                    { id: 205, name: 'Bedside Lamp', price: 79.99, desc: 'Dimmable ceramic lamp.' },
                    { id: 206, name: 'Wardrobe', price: 799.99, desc: 'Sliding door wardrobe.' },
                    { id: 207, name: 'Bench', price: 249.99, desc: 'Upholstered bench with storage.' },
                    { id: 208, name: 'Rug', price: 159.99, desc: 'Plush shag rug.' },
                    { id: 209, name: 'Desk', price: 399.99, desc: 'Compact writing desk.' },
                    { id: 210, name: 'Pillow Set', price: 89.99, desc: 'Set of 4 decorative pillows.' }
                ]
            }, {
                key: 'dining',
                label: 'Dining',
                icon: 'fa-utensils',
                image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                products: [
                    { id: 301, name: 'Dining Table (6-seat)', price: 899.99, desc: 'Extendable oak table.' },
                    { id: 302, name: 'Dining Chair', price: 149.99, desc: 'Mid-century dining chair.' },
                    { id: 303, name: 'Sideboard', price: 599.99, desc: 'Buffet with glass doors.' },
                    { id: 304, name: 'Bar Stool', price: 129.99, desc: 'Adjustable height bar stool.' },
                    { id: 305, name: 'Table Runner', price: 39.99, desc: 'Linen table runner.' },
                    { id: 306, name: 'Dinnerware Set', price: 199.99, desc: '16-piece stoneware set.' },
                    { id: 307, name: 'Wine Rack', price: 79.99, desc: 'Wall-mounted wine rack.' },
                    { id: 308, name: 'Chandelier', price: 349.99, desc: 'Modern glass chandelier.' },
                    { id: 309, name: 'Placemat Set', price: 29.99, desc: 'Set of 6 woven placemats.' },
                    { id: 310, name: 'Serving Cart', price: 249.99, desc: 'Stainless steel serving cart.' }
                ]
            }, {
                key: 'office',
                label: 'Home Office',
                icon: 'fa-chair',
                image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                products: [
                    { id: 401, name: 'Ergonomic Chair', price: 499.99, desc: 'Adjustable lumbar support.' },
                    { id: 402, name: 'Standing Desk', price: 699.99, desc: 'Electric height-adjustable.' },
                    { id: 403, name: 'Desk Lamp', price: 89.99, desc: 'LED task lamp.' },
                    { id: 404, name: 'Bookshelf', price: 299.99, desc: '5-shelf industrial bookshelf.' },
                    { id: 405, name: 'Office Drawer', price: 199.99, desc: 'Rolling filing cabinet.' },
                    { id: 406, name: 'Monitor Stand', price: 59.99, desc: 'Adjustable monitor riser.' },
                    { id: 407, name: 'Desk Mat', price: 39.99, desc: 'Leather desk mat.' },
                    { id: 408, name: 'Pen Holder', price: 19.99, desc: 'Ceramic pen organizer.' },
                    { id: 409, name: 'Wall Organizer', price: 49.99, desc: 'Pegboard wall organizer.' },
                    { id: 410, name: 'Footrest', price: 69.99, desc: 'Ergonomic footrest.' }
                ]
            }, {
                key: 'lighting',
                label: 'Lighting',
                icon: 'fa-lamp',
                image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                products: [
                    { id: 501, name: 'Pendant Light', price: 199.99, desc: 'Brass pendant with glass shade.' },
                    { id: 502, name: 'Floor Lamp', price: 149.99, desc: 'Tripod floor lamp.' },
                    { id: 503, name: 'Table Lamp', price: 89.99, desc: 'Ceramic table lamp.' },
                    { id: 504, name: 'Wall Sconce', price: 79.99, desc: 'Set of 2 wall sconces.' },
                    { id: 505, name: 'Chandelier', price: 599.99, desc: 'Crystal chandelier.' },
                    { id: 506, name: 'Desk Lamp', price: 69.99, desc: 'Architect desk lamp.' },
                    { id: 507, name: 'String Lights', price: 39.99, desc: 'Indoor string lights.' },
                    { id: 508, name: 'Lantern', price: 59.99, desc: 'Outdoor lantern.' },
                    { id: 509, name: 'Spotlight', price: 49.99, desc: 'Adjustable spotlight.' },
                    { id: 510, name: 'Night Light', price: 29.99, desc: 'Smart night light.' }
                ]
            }, {
                key: 'decor',
                label: 'Decor',
                icon: 'fa-rug',
                image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                products: [
                    { id: 601, name: 'Vase', price: 49.99, desc: 'Ceramic vase set.' },
                    { id: 602, name: 'Wall Art', price: 89.99, desc: 'Abstract painting.' },
                    { id: 603, name: 'Candle Set', price: 39.99, desc: 'Scented candle set.' },
                    { id: 604, name: 'Mirror', price: 149.99, desc: 'Round decorative mirror.' },
                    { id: 605, name: 'Throw Blanket', price: 69.99, desc: 'Woven throw blanket.' },
                    { id: 606, name: 'Cushion Cover', price: 29.99, desc: 'Set of 2 cushion covers.' },
                    { id: 607, name: 'Plant Pot', price: 34.99, desc: 'Terracotta plant pot.' },
                    { id: 608, name: 'Sculpture', price: 119.99, desc: 'Modern abstract sculpture.' },
                    { id: 609, name: 'Photo Frame', price: 24.99, desc: 'Set of 3 photo frames.' },
                    { id: 610, name: 'Decorative Tray', price: 44.99, desc: 'Gold decorative tray.' }
                ]
            }];

            // Build maps
            const productMap = {};
            const categoryImageMap = {};
            CATEGORIES.forEach(cat => {
                categoryImageMap[cat.key] = cat.image;
                cat.products.forEach(p => {
                    p.categoryKey = cat.key;
                    productMap[p.id] = p;
                });
            });

            // ===== STATE =====
            let currentUser = JSON.parse(localStorage.getItem('furni_user')) || null;
            let cart = JSON.parse(localStorage.getItem('furni_cart')) || [];
            let theme = localStorage.getItem('furni_theme') || 'light';

            // ===== DOM REFS =====
            const $ = (s) => document.querySelector(s);
            const $$ = (s) => document.querySelectorAll(s);

            const productGrid = $('#productGrid');
            const cartItemsEl = $('#cartItems');
            const cartFooter = $('#cartFooter');
            const cartTotal = $('#cartTotal');
            const cartCount = $('#cartCount');
            const cartSidebar = $('#cartSidebar');
            const cartOverlay = $('#cartOverlay');
            const toast = $('#toast');
            const toastMsg = $('#toastMsg');
            const userAvatar = $('#userAvatar');
            const userNameDisplay = $('#userNameDisplay');
            const authModal = $('#authModal');
            const mobileMenu = $('#mobileMenu');
            const categoryGrid = $('#categoryGrid');
            const categoryPage = $('#categoryPage');
            const categoryPageTitle = $('#categoryPageTitle');
            const categoryProductList = $('#categoryProductList');
            const backFromCategory = $('#backFromCategory');
            const homeLink = $('#homeLink');

            // ===== HELPERS =====
            function saveCart() { localStorage.setItem('furni_cart', JSON.stringify(cart)); }

            function saveUser() { localStorage.setItem('furni_user', JSON.stringify(currentUser)); }

            function saveTheme() { localStorage.setItem('furni_theme', theme); }

            function showToast(msg, icon = 'fa-check-circle') {
                toastMsg.textContent = msg;
                toast.querySelector('i').className = 'fas ' + icon;
                toast.classList.add('show');
                clearTimeout(toast._timer);
                toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
            }

            // ===== RENDER FUNCTIONS =====
            function renderProductGrid(products, container, addToCartHandler) {
                container.innerHTML = products.map(p => `
                    <div class="product-card">
                        <div class="image-wrap">
                            <img src="${p.image}" alt="${p.name}" loading="lazy">
                            <button class="quick-add" data-id="${p.id}">+ Add to cart</button>
                        </div>
                        <div class="product-body">
                            <div class="product-name">${p.name}</div>
                            <div class="product-desc">${p.desc}</div>
                            <div class="product-price">$${p.price.toFixed(2)}</div>
                            <div class="product-actions">
                                <span></span>
                                <button class="btn btn-gold btn-small add-cart" data-id="${p.id}">
                                    <i class="fas fa-plus"></i> Add
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');

                container.querySelectorAll('.add-cart, .quick-add').forEach(btn => {
                    btn.addEventListener('click', function (e) {
                        e.stopPropagation();
                        const id = parseInt(this.dataset.id);
                        addToCartHandler(id);
                    });
                });
            }

            function renderCategories() {
                categoryGrid.innerHTML = CATEGORIES.map(cat => `
                    <div class="category-card" data-key="${cat.key}">
                        <div class="cat-image">
                            <img src="${cat.image}" alt="${cat.label}" loading="lazy">
                        </div>
                        <div class="cat-info">
                            <i class="fas ${cat.icon} cat-icon"></i>
                            <h4>${cat.label}</h4>
                            <span class="count">${cat.products.length} pieces</span>
                        </div>
                    </div>
                `).join('');

                categoryGrid.querySelectorAll('.category-card').forEach(card => {
                    card.addEventListener('click', function () {
                        const key = this.dataset.key;
                        showCategoryPage(key);
                    });
                });
            }

            function showCategoryPage(categoryKey) {
                const category = CATEGORIES.find(c => c.key === categoryKey);
                if (!category) return;

                document.querySelectorAll('section').forEach(s => s.style.display = 'none');
                categoryPage.classList.add('active');

                categoryPageTitle.innerHTML = `${category.label} <span>Collection</span>`;

                categoryProductList.innerHTML = category.products.map(p => `
                    <div class="category-product-item">
                        <div class="item-info">
                            <h4>${p.name}</h4>
                            <div class="desc">${p.desc}</div>
                        </div>
                        <div class="item-right">
                            <span class="price">$${p.price.toFixed(2)}</span>
                            <button class="btn btn-gold btn-sm add-from-category" data-id="${p.id}">
                                <i class="fas fa-plus"></i> Add
                            </button>
                        </div>
                    </div>
                `).join('');

                categoryProductList.querySelectorAll('.add-from-category').forEach(btn => {
                    btn.addEventListener('click', function (e) {
                        e.stopPropagation();
                        const id = parseInt(this.dataset.id);
                        addToCart(id);
                    });
                });

                categoryPage.scrollIntoView({ behavior: 'smooth' });
            }

            function hideCategoryPage() {
                categoryPage.classList.remove('active');
                document.querySelectorAll('section').forEach(s => s.style.display = '');
                document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
            }

            // ===== CART FUNCTIONS =====
            function addToCart(productId) {
                if (!currentUser) {
                    showToast('Please sign in first', 'fa-exclamation-circle');
                    openAuthModal('signin');
                    return;
                }

                let product = FEATURED.find(p => p.id === productId);
                let categoryKey = null;

                if (!product) {
                    product = productMap[productId];
                    if (product) categoryKey = product.categoryKey;
                }

                if (!product) {
                    showToast('Product not found', 'fa-exclamation-circle');
                    return;
                }

                // Get the image for this product
                let imageUrl = product.image;
                if (!imageUrl && categoryKey) {
                    imageUrl = categoryImageMap[categoryKey] || 'https://via.placeholder.com/400x300?text=No+Image';
                }
                if (!imageUrl) imageUrl = 'https://via.placeholder.com/400x300?text=No+Image';

                const existing = cart.find(item => item.id === productId);
                if (existing) {
                    existing.qty += 1;
                } else {
                    cart.push({
                        id: productId,
                        name: product.name,
                        price: product.price,
                        image: imageUrl,
                        qty: 1
                    });
                }
                saveCart();
                updateCartUI();
                showToast(`${product.name} added to cart`);
            }

            function removeFromCart(productId) {
                cart = cart.filter(item => item.id !== productId);
                saveCart();
                updateCartUI();
                showToast('Item removed', 'fa-trash-alt');
            }

            function updateQuantity(productId, delta) {
                const item = cart.find(i => i.id === productId);
                if (!item) return;
                const newQty = item.qty + delta;
                if (newQty <= 0) {
                    removeFromCart(productId);
                    return;
                }
                item.qty = newQty;
                saveCart();
                updateCartUI();
            }

            function updateCartUI() {
                const count = cart.reduce((sum, i) => sum + i.qty, 0);
                cartCount.textContent = count;
                if (cart.length === 0) {
                    cartItemsEl.innerHTML =
                        `<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Your cart is empty</p></div>`;
                    cartFooter.style.display = 'none';
                } else {
                    cartItemsEl.innerHTML = cart.map(item => `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/64x64?text=No+Image'">
                            <div class="cart-item-info">
                                <h4>${item.name}</h4>
                                <div class="price">$${item.price.toFixed(2)}</div>
                                <div class="cart-item-actions">
                                    <button class="qty-dec" data-id="${item.id}">−</button>
                                    <span>${item.qty}</span>
                                    <button class="qty-inc" data-id="${item.id}">+</button>
                                </div>
                            </div>
                            <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-times"></i></button>
                        </div>
                    `).join('');

                    cartItemsEl.querySelectorAll('.qty-dec').forEach(btn => {
                        btn.addEventListener('click', function () {
                            const id = parseInt(this.dataset.id);
                            updateQuantity(id, -1);
                        });
                    });
                    cartItemsEl.querySelectorAll('.qty-inc').forEach(btn => {
                        btn.addEventListener('click', function () {
                            const id = parseInt(this.dataset.id);
                            updateQuantity(id, 1);
                        });
                    });
                    cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
                        btn.addEventListener('click', function () {
                            const id = parseInt(this.dataset.id);
                            removeFromCart(id);
                        });
                    });

                    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
                    cartTotal.textContent = '$' + total.toFixed(2);
                    cartFooter.style.display = 'block';
                }
            }

            // ===== AUTH FUNCTIONS =====
            function openAuthModal(tab = 'signin') {
                authModal.classList.add('active');
                const tabs = authModal.querySelectorAll('.auth-tabs button');
                const forms = authModal.querySelectorAll('.auth-form');
                tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
                forms.forEach(f => f.classList.toggle('active', f.id === (tab === 'signin' ? 'formSignin' :
                    'formSignup')));
            }

            function closeAuthModal() { authModal.classList.remove('active'); }

            function updateUserUI() {
                if (currentUser) {
                    userNameDisplay.textContent = currentUser.name.split(' ')[0];
                    userAvatar.innerHTML =
                        `<i class="fas fa-user-circle"></i><span>${currentUser.name.split(' ')[0]}</span>`;
                    const mobileSign = document.querySelector('#mobileMenu .btn-outline');
                    if (mobileSign) mobileSign.textContent = 'Sign out';
                } else {
                    userNameDisplay.textContent = 'Sign in';
                    userAvatar.innerHTML = `<i class="fas fa-user-circle"></i><span>Sign in</span>`;
                    const mobileSign = document.querySelector('#mobileMenu .btn-outline');
                    if (mobileSign) mobileSign.textContent = 'Sign In';
                }
            }

            // ===== INIT =====
            function init() {
                if (theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.querySelector('.theme-toggle i').className = 'fas fa-sun';
                }

                renderProductGrid(FEATURED, productGrid, addToCart);
                renderCategories();
                updateCartUI();
                updateUserUI();

                // Navigation
                backFromCategory.addEventListener('click', hideCategoryPage);

                homeLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (categoryPage.classList.contains('active')) hideCategoryPage();
                    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
                });

                // Cart - Open
                $('#cartOpen').addEventListener('click', function (e) {
                    e.preventDefault();
                    cartSidebar.classList.add('active');
                    cartOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });

                // Cart - Close button
                $('#cartClose').addEventListener('click', function (e) {
                    e.preventDefault();
                    cartSidebar.classList.remove('active');
                    cartOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                });

                // Cart - Close on overlay click
                cartOverlay.addEventListener('click', function () {
                    cartSidebar.classList.remove('active');
                    cartOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                });

                // Theme
                $('#themeToggle').addEventListener('click', function () {
                    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                    if (isDark) {
                        document.documentElement.removeAttribute('data-theme');
                        this.querySelector('i').className = 'fas fa-moon';
                        theme = 'light';
                    } else {
                        document.documentElement.setAttribute('data-theme', 'dark');
                        this.querySelector('i').className = 'fas fa-sun';
                        theme = 'dark';
                    }
                    saveTheme();
                });

                // User
                $('#userAvatar').addEventListener('click', function (e) {
                    e.stopPropagation();
                    if (currentUser) {
                        currentUser = null;
                        localStorage.removeItem('furni_user');
                        updateUserUI();
                        showToast('Signed out', 'fa-sign-out-alt');
                    } else {
                        openAuthModal('signin');
                    }
                });
                $('#authClose').addEventListener('click', closeAuthModal);
                authModal.addEventListener('click', function (e) { if (e.target === this) closeAuthModal(); });
                authModal.querySelectorAll('.auth-tabs button').forEach(btn => {
                    btn.addEventListener('click', function () { openAuthModal(this.dataset.tab); });
                });
                $('#switchToSignup').addEventListener('click', () => openAuthModal('signup'));
                $('#switchToSignin').addEventListener('click', () => openAuthModal('signin'));

                document.querySelector('#mobileMenu .btn-outline')?.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (currentUser) {
                        currentUser = null;
                        localStorage.removeItem('furni_user');
                        updateUserUI();
                        showToast('Signed out', 'fa-sign-out-alt');
                        mobileMenu.classList.remove('active');
                    } else {
                        openAuthModal('signin');
                        mobileMenu.classList.remove('active');
                    }
                });

                // Signin
                $('#signinForm').addEventListener('submit', function (e) {
                    e.preventDefault();
                    const email = $('#signinEmail').value.trim();
                    const password = $('#signinPassword').value.trim();
                    if (!email || !password) {
                        showToast('Please fill in all fields', 'fa-exclamation-circle');
                        return;
                    }
                    const users = JSON.parse(localStorage.getItem('furni_users')) || [];
                    const found = users.find(u => u.email === email && u.password === password);
                    if (found) {
                        currentUser = { name: found.name, email: found.email };
                        saveUser();
                        updateUserUI();
                        closeAuthModal();
                        showToast(`Welcome back, ${found.name.split(' ')[0]}!`);
                        $('#signinForm').reset();
                    } else {
                        showToast('Invalid email or password', 'fa-exclamation-circle');
                    }
                });

                // Signup
                $('#signupForm').addEventListener('submit', function (e) {
                    e.preventDefault();
                    const name = $('#signupName').value.trim();
                    const email = $('#signupEmail').value.trim();
                    const password = $('#signupPassword').value.trim();
                    if (!name || !email || !password || password.length < 6) {
                        showToast('Please fill all fields (password min 6)', 'fa-exclamation-circle');
                        return;
                    }
                    const users = JSON.parse(localStorage.getItem('furni_users')) || [];
                    if (users.find(u => u.email === email)) {
                        showToast('Email already registered', 'fa-exclamation-circle');
                        return;
                    }
                    users.push({ name, email, password });
                    localStorage.setItem('furni_users', JSON.stringify(users));
                    currentUser = { name, email };
                    saveUser();
                    updateUserUI();
                    closeAuthModal();
                    showToast(`Welcome, ${name.split(' ')[0]}!`);
                    $('#signupForm').reset();
                });

                // Checkout
                $('#checkoutBtn').addEventListener('click', function () {
                    if (!currentUser) {
                        showToast('Please sign in to checkout', 'fa-exclamation-circle');
                        cartSidebar.classList.remove('active');
                        cartOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                        setTimeout(() => openAuthModal('signin'), 300);
                        return;
                    }
                    if (cart.length === 0) { showToast('Your cart is empty', 'fa-exclamation-circle'); return; }
                    showToast('Order placed! Thank you.', 'fa-check-circle');
                    cart = [];
                    saveCart();
                    updateCartUI();
                    cartSidebar.classList.remove('active');
                    cartOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                });

                // Hamburger
                $('#hamburgerBtn').addEventListener('click', function () {
                    mobileMenu.classList.toggle('active');
                    this.querySelector('i').className = mobileMenu.classList.contains('active') ? 'fas fa-times' :
                        'fas fa-bars';
                });
                mobileMenu.querySelectorAll('a').forEach(a => {
                    a.addEventListener('click', () => {
                        mobileMenu.classList.remove('active');
                        document.querySelector('#hamburgerBtn i').className = 'fas fa-bars';
                        if (categoryPage.classList.contains('active')) hideCategoryPage();
                    });
                });

                // Contact
                $('#contactForm').addEventListener('submit', function (e) {
                    e.preventDefault();
                    showToast('Message sent! We\'ll reply soon.', 'fa-paper-plane');
                    this.reset();
                });

                // Escape
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        if (cartSidebar.classList.contains('active')) {
                            cartSidebar.classList.remove('active');
                            cartOverlay.classList.remove('active');
                            document.body.style.overflow = '';
                        }
                        if (authModal.classList.contains('active')) closeAuthModal();
                        if (categoryPage.classList.contains('active')) hideCategoryPage();
                    }
                });
            }

            document.addEventListener('DOMContentLoaded', init);
        })();
    </script>