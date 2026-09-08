
        (function () {
            // ============================================================
            // 1. PRODUCT DATA
            // ============================================================
            const FEATURED = [
                { id: 1, name: 'Luxury Velvet Sofa', price: 899.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Elegant velvet with premium cushioning.' },
                { id: 2, name: 'Modern Armchair', price: 349.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ergonomic design with stylish fabric.' },
                { id: 3, name: 'Oak Dining Table', price: 599.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Solid oak, extendable for gatherings.' },
                { id: 4, name: 'Minimalist Bed Frame', price: 749.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Clean lines, sturdy construction.' }
            ];

            const CATEGORY_PRODUCTS = {
                living: [
                    { id: 101, name: 'Sectional Sofa', price: 1299.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Spacious L-shaped sectional.' },
                    { id: 102, name: 'Coffee Table', price: 299.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Minimalist wood and glass.' },
                    { id: 103, name: 'TV Stand', price: 449.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Modern media console.' },
                    { id: 104, name: 'Accent Chair', price: 249.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Mid-century modern style.' },
                    { id: 105, name: 'Rug', price: 189.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Wool blend, geometric pattern.' },
                    { id: 106, name: 'Floor Lamp', price: 159.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable arc lamp.' },
                    { id: 107, name: 'Bookshelf', price: 399.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: '5-tier open shelving.' },
                    { id: 108, name: 'Ottoman', price: 199.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Tufted storage ottoman.' },
                    { id: 109, name: 'Wall Art', price: 129.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Abstract canvas set.' },
                    { id: 110, name: 'Pouf', price: 89.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Knitted cotton pouf.' }
                ],
                bedroom: [
                    { id: 201, name: 'King Bed Frame', price: 999.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Upholstered headboard.' },
                    { id: 202, name: 'Nightstand', price: 199.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Solid wood, two drawers.' },
                    { id: 203, name: 'Dresser', price: 549.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: '6-drawer modern dresser.' },
                    { id: 204, name: 'Mirror', price: 129.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Floor-length arched mirror.' },
                    { id: 205, name: 'Bedside Lamp', price: 79.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Dimmable ceramic lamp.' },
                    { id: 206, name: 'Wardrobe', price: 799.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Sliding door wardrobe.' },
                    { id: 207, name: 'Bench', price: 249.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Upholstered bench with storage.' },
                    { id: 208, name: 'Rug', price: 159.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Plush shag rug.' },
                    { id: 209, name: 'Desk', price: 399.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Compact writing desk.' },
                    { id: 210, name: 'Pillow Set', price: 89.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 4 decorative pillows.' }
                ],
                dining: [
                    { id: 301, name: 'Dining Table (6-seat)', price: 899.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Extendable oak table.' },
                    { id: 302, name: 'Dining Chair', price: 149.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Mid-century dining chair.' },
                    { id: 303, name: 'Sideboard', price: 599.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Buffet with glass doors.' },
                    { id: 304, name: 'Bar Stool', price: 129.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable height bar stool.' },
                    { id: 305, name: 'Table Runner', price: 39.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Linen table runner.' },
                    { id: 306, name: 'Dinnerware Set', price: 199.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: '16-piece stoneware set.' },
                    { id: 307, name: 'Wine Rack', price: 79.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Wall-mounted wine rack.' },
                    { id: 308, name: 'Chandelier', price: 349.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Modern glass chandelier.' },
                    { id: 309, name: 'Placemat Set', price: 29.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 6 woven placemats.' },
                    { id: 310, name: 'Serving Cart', price: 249.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Stainless steel serving cart.' }
                ],
                office: [
                    { id: 401, name: 'Ergonomic Chair', price: 499.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable lumbar support.' },
                    { id: 402, name: 'Standing Desk', price: 699.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Electric height-adjustable.' },
                    { id: 403, name: 'Desk Lamp', price: 89.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'LED task lamp.' },
                    { id: 404, name: 'Bookshelf', price: 299.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: '5-shelf industrial bookshelf.' },
                    { id: 405, name: 'Office Drawer', price: 199.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Rolling filing cabinet.' },
                    { id: 406, name: 'Monitor Stand', price: 59.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable monitor riser.' },
                    { id: 407, name: 'Desk Mat', price: 39.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Leather desk mat.' },
                    { id: 408, name: 'Pen Holder', price: 19.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ceramic pen organizer.' },
                    { id: 409, name: 'Wall Organizer', price: 49.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Pegboard wall organizer.' },
                    { id: 410, name: 'Footrest', price: 69.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ergonomic footrest.' }
                ],
                lighting: [
                    { id: 501, name: 'Pendant Light', price: 199.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Brass pendant with glass shade.' },
                    { id: 502, name: 'Floor Lamp', price: 149.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Tripod floor lamp.' },
                    { id: 503, name: 'Table Lamp', price: 89.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ceramic table lamp.' },
                    { id: 504, name: 'Wall Sconce', price: 79.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 2 wall sconces.' },
                    { id: 505, name: 'Chandelier', price: 599.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Crystal chandelier.' },
                    { id: 506, name: 'Desk Lamp', price: 69.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Architect desk lamp.' },
                    { id: 507, name: 'String Lights', price: 39.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Indoor string lights.' },
                    { id: 508, name: 'Lantern', price: 59.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Outdoor lantern.' },
                    { id: 509, name: 'Spotlight', price: 49.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable spotlight.' },
                    { id: 510, name: 'Night Light', price: 29.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Smart night light.' }
                ],
                decor: [
                    { id: 601, name: 'Vase', price: 49.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ceramic vase set.' },
                    { id: 602, name: 'Wall Art', price: 89.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Abstract painting.' },
                    { id: 603, name: 'Candle Set', price: 39.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Scented candle set.' },
                    { id: 604, name: 'Mirror', price: 149.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Round decorative mirror.' },
                    { id: 605, name: 'Throw Blanket', price: 69.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Woven throw blanket.' },
                    { id: 606, name: 'Cushion Cover', price: 29.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 2 cushion covers.' },
                    { id: 607, name: 'Plant Pot', price: 34.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Terracotta plant pot.' },
                    { id: 608, name: 'Sculpture', price: 119.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Modern abstract sculpture.' },
                    { id: 609, name: 'Photo Frame', price: 24.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 3 photo frames.' },
                    { id: 610, name: 'Decorative Tray', price: 44.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Gold decorative tray.' }
                ]
            };

            // ============================================================
            // 2. STATE
            // ============================================================
            let currentUser = JSON.parse(localStorage.getItem('furni_user')) || null;
            let cart = JSON.parse(localStorage.getItem('furni_cart')) || [];
            let wishlist = JSON.parse(localStorage.getItem('furni_wishlist')) || [];
            let theme = localStorage.getItem('furni_theme') || 'light';
            let userAddresses = [];
            let userOrders = [];
            let userProfile = {};
            let currentDashboardPage = 'overview';

            // ============================================================
            // 3. DOM REFS
            // ============================================================
            const $ = (s) => document.querySelector(s);
            const $$ = (s) => document.querySelectorAll(s);

            // Dashboard elements
            const dashboardWrapper = $('#dashboardWrapper');
            const dashboardSidebar = $('#dashboardSidebar');
            const sidebarOverlay = $('#sidebarOverlay');
            const mobileSidebarToggle = $('#mobileSidebarToggle');
            const sidebarNavItems = $$('.dashboard-sidebar .nav-item');
            const logoutSidebarBtn = $('#logoutSidebarBtn');

            // Navbar elements
            const dashboardNavItem = $('#dashboardNavItem');
            const dashboardNav = $('#dashboardNav');
            const mobileDashboardNav = $('#mobileDashboardNav');

            // Dashboard content
            const dashboardGreeting = $('#dashboardGreeting');
            const sidebarUserName = $('#sidebarUserName');
            const sidebarUserEmail = $('#sidebarUserEmail');
            const quickProfileName = $('#quickProfileName');
            const quickProfileEmail = $('#quickProfileEmail');
            const quickProfilePhone = $('#quickProfilePhone');

            // Stats
            const statOrders = $('#statOrders');
            const statSpent = $('#statSpent');
            const statAddresses = $('#statAddresses');
            const statWishlist = $('#statWishlist');

            // Pages
            const pageOverview = $('#pageOverview');
            const pageProfile = $('#pageProfile');
            const pageAddresses = $('#pageAddresses');
            const pageOrders = $('#pageOrders');
            const pageWishlist = $('#pageWishlist');

            // Address
            const addressList = $('#addressList');
            const addAddressBtn = $('#addAddressBtn');

            // Orders
            const orderHistory = $('#orderHistory');

            // Wishlist
            const wishlistItems = $('#wishlistItems');

            // Profile form
            const profileName = $('#profileName');
            const profileEmail = $('#profileEmail');
            const profilePhone = $('#profilePhone');
            const profileForm = $('#profileForm');
            const changePasswordBtn = $('#changePasswordBtn');

            // Badges
            const addressCountBadge = $('#addressCountBadge');
            const orderCountBadge = $('#orderCountBadge');
            const wishlistCountBadge = $('#wishlistCountBadge');

            // Other
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
            const categoryProductGrid = $('#categoryProductGrid');
            const backFromCategory = $('#backFromCategory');
            const homeLink = $('#homeLink');
            const backToTop = $('#backToTop');
            const scrollProgress = $('#scrollProgress');

            // ============================================================
            // 4. HELPERS
            // ============================================================
            function saveCart() { localStorage.setItem('furni_cart', JSON.stringify(cart)); }

            function saveUser() { localStorage.setItem('furni_user', JSON.stringify(currentUser)); }

            function saveTheme() { localStorage.setItem('furni_theme', theme); }

            function saveWishlist() { localStorage.setItem('furni_wishlist', JSON.stringify(wishlist)); }

            function showToast(msg, icon = 'fa-check-circle') {
                toastMsg.textContent = msg;
                toast.querySelector('i').className = 'fas ' + icon;
                toast.classList.add('show');
                clearTimeout(toast._timer);
                toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
            }

            function getUserDataKey() {
                if (!currentUser) return null;
                return `furni_userdata_${currentUser.email}`;
            }

            function loadUserData() {
                if (!currentUser) return null;
                const key = getUserDataKey();
                const data = JSON.parse(localStorage.getItem(key)) || {
                    addresses: [],
                    orders: [],
                    phone: '',
                    profile: { name: currentUser.name, email: currentUser.email }
                };
                return data;
            }

            function saveUserData(data) {
                if (!currentUser) return;
                const key = getUserDataKey();
                localStorage.setItem(key, JSON.stringify(data));
            }

            function findProductById(id) {
                let product = FEATURED.find(p => p.id === id);
                if (product) return product;
                for (let cat in CATEGORY_PRODUCTS) {
                    const found = CATEGORY_PRODUCTS[cat].find(p => p.id === id);
                    if (found) return found;
                }
                return null;
            }

            // ============================================================
            // 5. PRODUCT RENDERING
            // ============================================================
            function renderProductGrid(products, container) {
                container.innerHTML = products.map(p => `
                    <div class="product-card">
                        <img src="${p.image}" alt="${p.name}" loading="lazy">
                        <div class="product-body">
                            <h3>${p.name}</h3>
                            <div class="desc">${p.desc}</div>
                            <div class="price">$${p.price.toFixed(2)}</div>
                            <div class="product-actions">
                                <button class="btn btn-small btn-success add-cart" data-id="${p.id}">
                                    <i class="fas fa-plus"></i> Add
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');

                container.querySelectorAll('.add-cart').forEach(btn => {
                    btn.addEventListener('click', function () {
                        const id = parseInt(this.dataset.id);
                        addToCart(id);
                    });
                });
            }

            // ============================================================
            // 6. CART FUNCTIONS
            // ============================================================
            function addToCart(productId) {
                if (!currentUser) {
                    showToast('Please sign in first', 'fa-exclamation-circle');
                    openAuthModal('signin');
                    return;
                }
                const product = findProductById(productId);
                if (!product) return;
                const existing = cart.find(item => item.id === productId);
                if (existing) {
                    existing.qty += 1;
                } else {
                    cart.push({ id: productId, name: product.name, price: product.price, image: product.image, qty: 1 });
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
                    cartItemsEl.innerHTML = `<div class="cart-empty"><i class="fas fa-box-open"></i><p>Your cart is empty</p></div>`;
                    cartFooter.style.display = 'none';
                } else {
                    cartItemsEl.innerHTML = cart.map(item => `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}">
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

            // ============================================================
            // 7. DASHBOARD FUNCTIONS
            // ============================================================
            function loadDashboardData() {
                if (!currentUser) return;

                const userData = loadUserData();
                if (!userData) return;

                userAddresses = userData.addresses || [];
                userOrders = userData.orders || [];
                userProfile = userData.profile || { name: currentUser.name, email: currentUser.email };

                // Update UI
                const firstName = currentUser.name.split(' ')[0];
                dashboardGreeting.textContent = firstName;
                sidebarUserName.textContent = currentUser.name;
                sidebarUserEmail.textContent = currentUser.email;

                quickProfileName.textContent = currentUser.name;
                quickProfileEmail.textContent = currentUser.email;
                quickProfilePhone.textContent = userData.phone || 'Not set';

                // Update stats
                const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
                statOrders.textContent = userOrders.length;
                statSpent.textContent = '$' + totalSpent.toFixed(2);
                statAddresses.textContent = userAddresses.length;
                statWishlist.textContent = wishlist.length;

                // Update badges
                addressCountBadge.textContent = userAddresses.length;
                orderCountBadge.textContent = userOrders.length;
                wishlistCountBadge.textContent = wishlist.length;

                // Update forms
                profileName.value = currentUser.name;
                profileEmail.value = currentUser.email;
                profilePhone.value = userData.phone || '';

                // Render addresses, orders, wishlist
                renderAddresses();
                renderOrders();
                renderWishlistItems();
                renderRecentOrders();
            }

            function renderAddresses() {
                if (userAddresses.length === 0) {
                    addressList.innerHTML = '<div class="empty-state">No addresses saved yet</div>';
                    return;
                }
                addressList.innerHTML = userAddresses.map((addr, index) => `
                    <div class="address-item">
                        <div class="address-text">
                            <strong>${addr.label || 'Address ' + (index + 1)}</strong>
                            ${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}<br>
                            ${addr.country}
                        </div>
                        <div class="address-actions">
                            <button class="edit-address" data-index="${index}" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="delete-address" data-index="${index}" title="Delete"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `).join('');

                addressList.querySelectorAll('.edit-address').forEach(btn => {
                    btn.addEventListener('click', function () {
                        const index = parseInt(this.dataset.index);
                        const addr = userAddresses[index];
                        showAddAddressModal(addr, index);
                    });
                });

                addressList.querySelectorAll('.delete-address').forEach(btn => {
                    btn.addEventListener('click', function () {
                        const index = parseInt(this.dataset.index);
                        if (confirm('Delete this address?')) {
                            userAddresses.splice(index, 1);
                            const userData = loadUserData();
                            userData.addresses = userAddresses;
                            saveUserData(userData);
                            renderAddresses();
                            updateDashboardStats();
                            showToast('Address deleted', 'fa-trash-alt');
                        }
                    });
                });
            }

            function renderOrders() {
                if (userOrders.length === 0) {
                    orderHistory.innerHTML = '<div class="empty-state">No orders yet. Start shopping!</div>';
                    return;
                }
                orderHistory.innerHTML = userOrders.map(order => `
                    <div class="order-item">
                        <div class="order-info">
                            <span class="order-id">Order #${order.id}</span>
                            <span class="order-date">${new Date(order.date).toLocaleDateString()} · ${order.items} items</span>
                            <span class="order-status ${order.status}">${order.status}</span>
                        </div>
                        <div class="order-total">$${order.total.toFixed(2)}</div>
                    </div>
                `).join('');
            }

            function renderRecentOrders() {
                const container = $('#recentOrders');
                const recent = userOrders.slice(0, 3);
                if (recent.length === 0) {
                    container.innerHTML = '<div class="empty-state">No orders yet</div>';
                    return;
                }
                container.innerHTML = recent.map(order => `
                    <div class="order-item">
                        <div class="order-info">
                            <span class="order-id">Order #${order.id}</span>
                            <span class="order-date">${new Date(order.date).toLocaleDateString()} · ${order.items} items</span>
                            <span class="order-status ${order.status}">${order.status}</span>
                        </div>
                        <div class="order-total">$${order.total.toFixed(2)}</div>
                    </div>
                `).join('');
            }

            function renderWishlistItems() {
                if (wishlist.length === 0) {
                    wishlistItems.innerHTML = '<div class="empty-state">Your wishlist is empty</div>';
                    return;
                }
                const products = wishlist.map(id => findProductById(id)).filter(p => p);
                if (products.length === 0) {
                    wishlistItems.innerHTML = '<div class="empty-state">No products in wishlist</div>';
                    return;
                }
                wishlistItems.innerHTML = products.map(p => `
                    <div class="order-item">
                        <div class="order-info">
                            <span class="order-id">${p.name}</span>
                            <span class="order-date">$${p.price.toFixed(2)}</span>
                        </div>
                        <div>
                            <button class="btn btn-small btn-success add-cart" data-id="${p.id}"><i class="fas fa-shopping-bag"></i></button>
                            <button class="btn btn-small btn-outline remove-wishlist" data-id="${p.id}"><i class="fas fa-heart" style="color:var(--danger);"></i></button>
                        </div>
                    </div>
                `).join('');

                wishlistItems.querySelectorAll('.add-cart').forEach(btn => {
                    btn.addEventListener('click', function () {
                        const id = parseInt(this.dataset.id);
                        addToCart(id);
                    });
                });

                wishlistItems.querySelectorAll('.remove-wishlist').forEach(btn => {
                    btn.addEventListener('click', function () {
                        const id = parseInt(this.dataset.id);
                        const index = wishlist.indexOf(id);
                        if (index > -1) {
                            wishlist.splice(index, 1);
                            saveWishlist();
                            renderWishlistItems();
                            updateDashboardStats();
                            showToast('Removed from wishlist', 'fa-heart');
                        }
                    });
                });
            }

            function updateDashboardStats() {
                const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
                statOrders.textContent = userOrders.length;
                statSpent.textContent = '$' + totalSpent.toFixed(2);
                statAddresses.textContent = userAddresses.length;
                statWishlist.textContent = wishlist.length;
                addressCountBadge.textContent = userAddresses.length;
                orderCountBadge.textContent = userOrders.length;
                wishlistCountBadge.textContent = wishlist.length;
            }

            function showAddAddressModal(existingAddress = null, editIndex = -1) {
                const isEdit = editIndex >= 0;
                const addr = existingAddress || { label: '', street: '', city: '', state: '', zip: '', country: 'USA' };

                const formHtml = `
                    <div class="address-form" id="addressFormContainer">
                        <h4>${isEdit ? 'Edit' : 'Add'} Address</h4>
                        <div class="form-group">
                            <label>Label (e.g., Home, Work)</label>
                            <input type="text" id="addrLabel" value="${addr.label || ''}" placeholder="Home">
                        </div>
                        <div class="form-group">
                            <label>Street Address</label>
                            <input type="text" id="addrStreet" value="${addr.street || ''}" placeholder="123 Main St">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>City</label>
                                <input type="text" id="addrCity" value="${addr.city || ''}" placeholder="City">
                            </div>
                            <div class="form-group">
                                <label>State</label>
                                <input type="text" id="addrState" value="${addr.state || ''}" placeholder="State">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>ZIP Code</label>
                                <input type="text" id="addrZip" value="${addr.zip || ''}" placeholder="ZIP">
                            </div>
                            <div class="form-group">
                                <label>Country</label>
                                <input type="text" id="addrCountry" value="${addr.country || 'USA'}" placeholder="Country">
                            </div>
                        </div>
                        <div class="form-actions">
                            <button class="btn btn-small btn-success" id="saveAddressBtn"><i class="fas fa-save"></i> Save</button>
                            <button class="btn btn-small btn-outline" id="cancelAddressBtn">Cancel</button>
                        </div>
                    </div>
                `;

                const existingForm = addressList.querySelector('#addressFormContainer');
                if (existingForm) existingForm.remove();

                const emptyState = addressList.querySelector('.empty-state');
                if (emptyState) emptyState.remove();

                addressList.insertAdjacentHTML('afterbegin', formHtml);

                document.getElementById('saveAddressBtn').addEventListener('click', function () {
                    const newAddr = {
                        label: document.getElementById('addrLabel').value.trim() || 'Address',
                        street: document.getElementById('addrStreet').value.trim(),
                        city: document.getElementById('addrCity').value.trim(),
                        state: document.getElementById('addrState').value.trim(),
                        zip: document.getElementById('addrZip').value.trim(),
                        country: document.getElementById('addrCountry').value.trim() || 'USA'
                    };

                    if (!newAddr.street || !newAddr.city) {
                        showToast('Street and City are required', 'fa-exclamation-circle');
                        return;
                    }

                    const userData = loadUserData();
                    if (isEdit) {
                        userData.addresses[editIndex] = newAddr;
                    } else {
                        userData.addresses.push(newAddr);
                    }
                    saveUserData(userData);
                    userAddresses = userData.addresses;
                    renderAddresses();
                    updateDashboardStats();
                    showToast(isEdit ? 'Address updated' : 'Address added', 'fa-check-circle');
                });

                document.getElementById('cancelAddressBtn').addEventListener('click', function () {
                    const form = addressList.querySelector('#addressFormContainer');
                    if (form) form.remove();
                    if (userAddresses.length === 0) {
                        addressList.innerHTML = '<div class="empty-state">No addresses saved yet</div>';
                    }
                });
            }

            // ============================================================
            // 8. DASHBOARD NAVIGATION
            // ============================================================
            function switchDashboardPage(page) {
                currentDashboardPage = page;

                // Hide all pages
                pageOverview.style.display = 'none';
                pageProfile.style.display = 'none';
                pageAddresses.style.display = 'none';
                pageOrders.style.display = 'none';
                pageWishlist.style.display = 'none';

                // Show selected page
                const pageMap = {
                    'overview': pageOverview,
                    'profile': pageProfile,
                    'addresses': pageAddresses,
                    'orders': pageOrders,
                    'wishlist': pageWishlist
                };
                if (pageMap[page]) {
                    pageMap[page].style.display = 'block';
                }

                // Update sidebar active state
                sidebarNavItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.dataset.page === page) {
                        item.classList.add('active');
                    }
                });

                // Close sidebar on mobile
                closeSidebar();
            }

            function toggleSidebar() {
                dashboardSidebar.classList.toggle('open');
                sidebarOverlay.classList.toggle('active');
            }

            function closeSidebar() {
                dashboardSidebar.classList.remove('open');
                sidebarOverlay.classList.remove('active');
            }

            // Expose for inline onclick
            window.switchDashboardPage = switchDashboardPage;

            // ============================================================
            // 9. SHOW/HIDE DASHBOARD
            // ============================================================
            function showDashboard() {
                if (!currentUser) {
                    showToast('Please sign in to view dashboard', 'fa-exclamation-circle');
                    openAuthModal('signin');
                    return;
                }

                // Hide main sections, show dashboard
                document.getElementById('mainSections').style.display = 'none';
                document.querySelector('.newsletter-section').style.display = 'none';
                document.querySelector('footer').style.display = 'none';
                categoryPage.classList.remove('active');
                dashboardWrapper.classList.add('active');

                loadDashboardData();
                switchDashboardPage('overview');

                history.pushState(null, null, '#dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            function hideDashboard() {
                dashboardWrapper.classList.remove('active');
                document.getElementById('mainSections').style.display = '';
                document.querySelector('.newsletter-section').style.display = '';
                document.querySelector('footer').style.display = '';
                closeSidebar();
                history.pushState(null, null, '#');
            }

            // ============================================================
            // 10. UPDATE NAVBAR - FIXED
            // ============================================================
            function updateNavbar() {
                if (currentUser) {
                    // Show dashboard link in desktop navbar
                    dashboardNavItem.style.display = 'block';
                    // Show dashboard link in mobile menu
                    mobileDashboardNav.style.display = 'block';
                } else {
                    // Hide dashboard link in desktop navbar
                    dashboardNavItem.style.display = 'none';
                    // Hide dashboard link in mobile menu
                    mobileDashboardNav.style.display = 'none';
                }
            }

            // ============================================================
            // 11. CATEGORY PAGE FUNCTIONS
            // ============================================================
            function showCategoryPage(categoryKey) {
                const products = CATEGORY_PRODUCTS[categoryKey];
                if (!products) return;

                document.getElementById('mainSections').style.display = 'none';
                document.querySelector('.newsletter-section').style.display = 'none';
                document.querySelector('footer').style.display = 'none';
                dashboardWrapper.classList.remove('active');
                categoryPage.classList.add('active');

                const displayName = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
                categoryPageTitle.innerHTML = `${displayName} <span>Collection</span>`;

                renderProductGrid(products, categoryProductGrid);
                categoryPage.scrollIntoView({ behavior: 'smooth' });
            }

            function hideCategoryPage() {
                categoryPage.classList.remove('active');
                document.getElementById('mainSections').style.display = '';
                document.querySelector('.newsletter-section').style.display = '';
                document.querySelector('footer').style.display = '';
                document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
            }

            // ============================================================
            // 12. AUTH FUNCTIONS
            // ============================================================
            function openAuthModal(tab = 'signin') {
                authModal.classList.add('active');
                const tabs = authModal.querySelectorAll('.auth-tabs button');
                const forms = authModal.querySelectorAll('.auth-form');
                tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
                forms.forEach(f => f.classList.toggle('active', f.id === (tab === 'signin' ? 'formSignin' : 'formSignup')));
            }

            function closeAuthModal() { authModal.classList.remove('active'); }

            function updateUserUI() {
                if (currentUser) {
                    const name = currentUser.name.split(' ')[0];
                    userNameDisplay.textContent = name;
                    userAvatar.innerHTML = `<i class="fas fa-user-circle"></i><span>${name}</span>`;
                } else {
                    userNameDisplay.textContent = 'Sign in';
                    userAvatar.innerHTML = `<i class="fas fa-user-circle"></i><span>Sign in</span>`;
                    if (dashboardWrapper.classList.contains('active')) {
                        hideDashboard();
                    }
                }

                // Update navbar dashboard links
                updateNavbar();

                // Update mobile sign in/out
                const mobileSign = document.querySelector('#mobileMenu .btn-outline');
                if (mobileSign) mobileSign.textContent = currentUser ? 'Sign out' : 'Sign In';
            }

            // ============================================================
            // 13. NAVIGATION
            // ============================================================
            function handleNavClick(e) {
                const target = e.currentTarget;
                const href = target.getAttribute('href');
                if (href === '#dashboard') {
                    e.preventDefault();
                    showDashboard();
                    return;
                }
                if (href && href.startsWith('#') && href !== '#dashboard') {
                    e.preventDefault();
                    if (categoryPage.classList.contains('active')) hideCategoryPage();
                    if (dashboardWrapper.classList.contains('active')) hideDashboard();
                    const section = document.querySelector(href);
                    if (section) {
                        const headerHeight = document.querySelector('header').offsetHeight;
                        const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                }
            }

            // ============================================================
            // 14. SCROLL PROGRESS & BACK TO TOP
            // ============================================================
            window.addEventListener('scroll', function () {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                scrollProgress.style.width = scrollPercent + '%';

                if (scrollTop > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });

            backToTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // ============================================================
            // 15. INIT
            // ============================================================
            function init() {
                // Theme
                if (theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.querySelector('.theme-toggle i').className = 'fas fa-sun';
                }

                // Render products
                renderProductGrid(FEATURED, productGrid);
                updateCartUI();
                updateUserUI();

                // Check dashboard hash
                if (window.location.hash === '#dashboard' && currentUser) {
                    setTimeout(showDashboard, 100);
                }

                // Navigation
                document.querySelectorAll('.nav-links a, .mobile-menu a[href^="#"]').forEach(link => {
                    link.addEventListener('click', handleNavClick);
                });

                // Home link
                homeLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (categoryPage.classList.contains('active')) hideCategoryPage();
                    if (dashboardWrapper.classList.contains('active')) hideDashboard();
                    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
                });

                // Categories
                categoryGrid.querySelectorAll('.category-card').forEach(card => {
                    card.addEventListener('click', function () {
                        if (dashboardWrapper.classList.contains('active')) hideDashboard();
                        const cat = this.dataset.category;
                        showCategoryPage(cat);
                    });
                });

                // Back from category
                backFromCategory.addEventListener('click', hideCategoryPage);

                // Dashboard nav - desktop
                dashboardNav.addEventListener('click', function (e) {
                    e.preventDefault();
                    showDashboard();
                });

                // Dashboard nav - mobile
                mobileDashboardNav.addEventListener('click', function (e) {
                    e.preventDefault();
                    showDashboard();
                    mobileMenu.classList.remove('active');
                    document.querySelector('#hamburgerBtn i').className = 'fas fa-bars';
                });

                // Sidebar navigation
                sidebarNavItems.forEach(item => {
                    item.addEventListener('click', function () {
                        const page = this.dataset.page;
                        if (page === 'overview' || page === 'profile' || page === 'addresses' ||
                            page === 'orders' || page === 'wishlist') {
                            switchDashboardPage(page);
                        }
                    });
                });

                // Logout from sidebar
                logoutSidebarBtn.addEventListener('click', function () {
                    if (currentUser) {
                        currentUser = null;
                        localStorage.removeItem('furni_user');
                        updateUserUI();
                        hideDashboard();
                        showToast('Signed out', 'fa-sign-out-alt');
                    }
                });

                // Mobile sidebar toggle
                mobileSidebarToggle.addEventListener('click', toggleSidebar);
                sidebarOverlay.addEventListener('click', closeSidebar);

                // Profile form
                profileForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    if (!currentUser) return;
                    const name = profileName.value.trim();
                    const email = profileEmail.value.trim();
                    if (!name || !email) {
                        showToast('Name and email are required', 'fa-exclamation-circle');
                        return;
                    }

                    const userData = loadUserData();
                    userData.profile = { name, email };
                    userData.phone = profilePhone.value.trim();
                    saveUserData(userData);

                    currentUser.name = name;
                    currentUser.email = email;
                    saveUser();

                    updateUserUI();
                    loadDashboardData();
                    showToast('Profile updated successfully!', 'fa-check-circle');
                });

                // Change password
                changePasswordBtn.addEventListener('click', function () {
                    const newPass = prompt('Enter new password (min 6 characters):');
                    if (newPass && newPass.length >= 6) {
                        const users = JSON.parse(localStorage.getItem('furni_users')) || [];
                        const userIndex = users.findIndex(u => u.email === currentUser.email);
                        if (userIndex >= 0) {
                            users[userIndex].password = newPass;
                            localStorage.setItem('furni_users', JSON.stringify(users));
                            showToast('Password updated successfully!', 'fa-check-circle');
                        }
                    } else if (newPass !== null) {
                        showToast('Password must be at least 6 characters', 'fa-exclamation-circle');
                    }
                });

                // Add address
                addAddressBtn.addEventListener('click', function () {
                    if (!currentUser) {
                        showToast('Please sign in first', 'fa-exclamation-circle');
                        openAuthModal('signin');
                        return;
                    }
                    showAddAddressModal();
                });

                // Cart
                $('#cartOpen').addEventListener('click', () => {
                    cartSidebar.classList.add('active');
                    cartOverlay.classList.add('active');
                });
                $('#cartClose').addEventListener('click', () => {
                    cartSidebar.classList.remove('active');
                    cartOverlay.classList.remove('active');
                });
                cartOverlay.addEventListener('click', () => {
                    cartSidebar.classList.remove('active');
                    cartOverlay.classList.remove('active');
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

                // User avatar
                $('#userAvatar').addEventListener('click', function (e) {
                    e.stopPropagation();
                    if (currentUser) {
                        showDashboard();
                    } else {
                        openAuthModal('signin');
                    }
                });

                // Auth modal
                $('#authClose').addEventListener('click', closeAuthModal);
                authModal.addEventListener('click', function (e) { if (e.target === this) closeAuthModal(); });
                authModal.querySelectorAll('.auth-tabs button').forEach(btn => {
                    btn.addEventListener('click', function () { openAuthModal(this.dataset.tab); });
                });
                $('#switchToSignup').addEventListener('click', () => openAuthModal('signup'));
                $('#switchToSignin').addEventListener('click', () => openAuthModal('signin'));

                // Mobile sign in/out
                document.querySelector('#mobileMenu .btn-outline')?.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (currentUser) {
                        currentUser = null;
                        localStorage.removeItem('furni_user');
                        updateUserUI();
                        if (dashboardWrapper.classList.contains('active')) hideDashboard();
                        showToast('Signed out', 'fa-sign-out-alt');
                        mobileMenu.classList.remove('active');
                    } else {
                        openAuthModal('signin');
                        mobileMenu.classList.remove('active');
                    }
                });

                // Sign in
                $('#signinForm').addEventListener('submit', function (e) {
                    e.preventDefault();
                    const email = $('#signinEmail').value.trim();
                    const password = $('#signinPassword').value.trim();
                    if (!email || !password) { showToast('Please fill in all fields', 'fa-exclamation-circle'); return; }
                    const users = JSON.parse(localStorage.getItem('furni_users')) || [];
                    const found = users.find(u => u.email === email && u.password === password);
                    if (found) {
                        currentUser = { name: found.name, email: found.email };
                        saveUser();
                        updateUserUI();
                        closeAuthModal();
                        showToast(`Welcome back, ${found.name.split(' ')[0]}!`);
                        $('#signinForm').reset();
                        if (window.location.hash === '#dashboard') {
                            showDashboard();
                        }
                    } else {
                        showToast('Invalid email or password', 'fa-exclamation-circle');
                    }
                });

                // Sign up
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

                    const key = `furni_userdata_${email}`;
                    if (!localStorage.getItem(key)) {
                        localStorage.setItem(key, JSON.stringify({
                            addresses: [],
                            orders: [],
                            phone: '',
                            profile: { name, email }
                        }));
                    }
                });

                // Checkout
                $('#checkoutBtn').addEventListener('click', function () {
                    if (!currentUser) {
                        showToast('Please sign in to checkout', 'fa-exclamation-circle');
                        cartSidebar.classList.remove('active');
                        cartOverlay.classList.remove('active');
                        setTimeout(() => openAuthModal('signin'), 300);
                        return;
                    }
                    if (cart.length === 0) { showToast('Your cart is empty', 'fa-exclamation-circle'); return; }

                    const order = {
                        id: 'ORD-' + Date.now().toString().slice(-6),
                        date: new Date().toISOString(),
                        items: cart.reduce((sum, item) => sum + item.qty, 0),
                        total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
                        status: 'processing'
                    };

                    const userData = loadUserData();
                    if (userData) {
                        userData.orders.unshift(order);
                        saveUserData(userData);
                        userOrders = userData.orders;
                        if (dashboardWrapper.classList.contains('active')) {
                            renderOrders();
                            renderRecentOrders();
                            updateDashboardStats();
                        }
                    }

                    showToast('Order placed! Thank you.', 'fa-check-circle');
                    cart = [];
                    saveCart();
                    updateCartUI();
                    cartSidebar.classList.remove('active');
                    cartOverlay.classList.remove('active');
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
                    });
                });

                // Contact
                $('#contactForm').addEventListener('submit', function (e) {
                    e.preventDefault();
                    showToast('Message sent! We\'ll reply soon.', 'fa-paper-plane');
                    this.reset();
                });

                // Newsletter
                $('#newsletterForm').addEventListener('submit', function (e) {
                    e.preventDefault();
                    const email = this.querySelector('input').value.trim();
                    if (email) {
                        showToast('Subscribed successfully!', 'fa-envelope');
                        this.reset();
                    }
                });

                // Escape
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        if (cartSidebar.classList.contains('active')) {
                            cartSidebar.classList.remove('active');
                            cartOverlay.classList.remove('active');
                        }
                        if (authModal.classList.contains('active')) closeAuthModal();
                        if (categoryPage.classList.contains('active')) hideCategoryPage();
                        if (dashboardWrapper.classList.contains('active')) closeSidebar();
                    }
                });

                // Hash change
                window.addEventListener('hashchange', function () {
                    if (window.location.hash === '#dashboard' && currentUser) {
                        showDashboard();
                    } else if (window.location.hash === '#dashboard' && !currentUser) {
                        openAuthModal('signin');
                    }
                });
            }

            document.addEventListener('DOMContentLoaded', init);
        })();
    