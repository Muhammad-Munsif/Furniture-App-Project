<script>
        document.addEventListener('DOMContentLoaded', function () {
            // ==================== AUTHENTICATION SYSTEM ====================
            
            // User data
            let currentUser = null;
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // DOM Elements
            const authModal = document.getElementById('authModal');
            const authClose = document.getElementById('authClose');
            const signInTab = document.getElementById('signInTab');
            const signUpTab = document.getElementById('signUpTab');
            const signInForm = document.getElementById('signInForm');
            const signUpForm = document.getElementById('signUpForm');
            const switchToSignUp = document.getElementById('switchToSignUp');
            const switchToSignIn = document.getElementById('switchToSignIn');
            
            // Desktop auth elements
            const signInBtnDesktop = document.getElementById('signInBtnDesktop');
            const signUpBtnDesktop = document.getElementById('signUpBtnDesktop');
            const myAccountBtnDesktop = document.getElementById('myAccountBtnDesktop');
            const logoutBtnDesktop = document.getElementById('logoutBtnDesktop');
            const userNameDesktop = document.getElementById('userNameDesktop');
            const userAvatarDesktop = document.getElementById('userAvatarDesktop');
            
            // Mobile auth elements
            const mobileSignInBtn = document.getElementById('mobileSignInBtn');
            const mobileSignUpBtn = document.getElementById('mobileSignUpBtn');
            const userIconMobile = document.getElementById('userIconMobile');
            const mobileUserInfo = document.getElementById('mobileUserInfo');
            
            // Check if user is already logged in
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                currentUser = JSON.parse(savedUser);
                updateUIForLoggedInUser(currentUser);
            }
            
            // ========== AUTH MODAL FUNCTIONS ==========
            
            // Open auth modal
            function openAuthModal(tab = 'signin') {
                authModal.classList.add('active');
                document.body.classList.add('no-scroll');
                
                if (tab === 'signup') {
                    signInTab.classList.remove('active');
                    signUpTab.classList.add('active');
                    signInForm.classList.remove('active');
                    signUpForm.classList.add('active');
                } else {
                    signUpTab.classList.remove('active');
                    signInTab.classList.add('active');
                    signUpForm.classList.remove('active');
                    signInForm.classList.add('active');
                }
            }
            
            // Close auth modal
            function closeAuthModal() {
                authModal.classList.remove('active');
                document.body.classList.remove('no-scroll');
                clearAuthErrors();
            }
            
            // Clear form errors
            function clearAuthErrors() {
                document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
                document.querySelectorAll('.form-group input').forEach(el => el.classList.remove('error'));
            }
            
            // Switch between sign in and sign up
            function switchToSignInTab() {
                signUpTab.classList.remove('active');
                signInTab.classList.add('active');
                signUpForm.classList.remove('active');
                signInForm.classList.add('active');
                clearAuthErrors();
            }
            
            function switchToSignUpTab() {
                signInTab.classList.remove('active');
                signUpTab.classList.add('active');
                signInForm.classList.remove('active');
                signUpForm.classList.add('active');
                clearAuthErrors();
            }
            
            // ========== EVENT LISTENERS FOR AUTH ==========
            
            // Desktop sign in/sign up buttons
            signInBtnDesktop.addEventListener('click', function(e) {
                e.preventDefault();
                openAuthModal('signin');
            });
            
            signUpBtnDesktop.addEventListener('click', function(e) {
                e.preventDefault();
                openAuthModal('signup');
            });
            
            // Mobile sign in/sign up buttons
            mobileSignInBtn.addEventListener('click', function() {
                openAuthModal('signin');
                mobileMenu.classList.remove('active');
                hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
            });
            
            mobileSignUpBtn.addEventListener('click', function() {
                openAuthModal('signup');
                mobileMenu.classList.remove('active');
                hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
            });
            
            userIconMobile.addEventListener('click', function(e) {
                e.preventDefault();
                if (currentUser) {
                    // Show user menu in mobile (we can expand this later)
                    showNotification(`Logged in as ${currentUser.name}`, 'info');
                } else {
                    openAuthModal('signin');
                }
                mobileMenu.classList.remove('active');
                hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
            });
            
            // Close modal
            authClose.addEventListener('click', closeAuthModal);
            
            // Close modal when clicking outside
            authModal.addEventListener('click', function(e) {
                if (e.target === authModal) {
                    closeAuthModal();
                }
            });
            
            // Tab switching
            signInTab.addEventListener('click', switchToSignInTab);
            signUpTab.addEventListener('click', switchToSignUpTab);
            switchToSignUp.addEventListener('click', switchToSignUpTab);
            switchToSignIn.addEventListener('click', switchToSignInTab);
            
            // ========== FORM VALIDATION AND SUBMISSION ==========
            
            // Sign In Form Submission
            document.getElementById('signInFormElement').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('signInEmail').value.trim();
                const password = document.getElementById('signInPassword').value;
                const rememberMe = document.getElementById('rememberMe').checked;
                
                // Clear previous errors
                clearAuthErrors();
                
                // Validate inputs
                let isValid = true;
                
                if (!email) {
                    document.getElementById('signInEmailError').textContent = 'Email is required';
                    document.getElementById('signInEmail').classList.add('error');
                    isValid = false;
                } else if (!isValidEmail(email)) {
                    document.getElementById('signInEmailError').textContent = 'Please enter a valid email';
                    document.getElementById('signInEmail').classList.add('error');
                    isValid = false;
                }
                
                if (!password) {
                    document.getElementById('signInPasswordError').textContent = 'Password is required';
                    document.getElementById('signInPassword').classList.add('error');
                    isValid = false;
                }
                
                if (isValid) {
                    // Check if user exists
                    const user = users.find(u => u.email === email && u.password === password);
                    
                    if (user) {
                        // Successful login
                        currentUser = {
                            name: user.name,
                            email: user.email
                        };
                        
                        // Save to localStorage
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        if (rememberMe) {
                            localStorage.setItem('rememberMe', 'true');
                        }
                        
                        // Update UI
                        updateUIForLoggedInUser(currentUser);
                        
                        // Close modal
                        closeAuthModal();
                        
                        // Show success message
                        showNotification(`Welcome back, ${user.name}!`, 'success');
                        
                        // Clear form
                        this.reset();
                    } else {
                        // Failed login
                        document.getElementById('signInEmailError').textContent = 'Invalid email or password';
                        document.getElementById('signInEmail').classList.add('error');
                        document.getElementById('signInPassword').classList.add('error');
                    }
                }
            });
            
            // Sign Up Form Submission
            document.getElementById('signUpFormElement').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('signUpName').value.trim();
                const email = document.getElementById('signUpEmail').value.trim();
                const password = document.getElementById('signUpPassword').value;
                const confirmPassword = document.getElementById('signUpConfirmPassword').value;
                const termsAgree = document.getElementById('termsAgree').checked;
                
                // Clear previous errors
                clearAuthErrors();
                
                // Validate inputs
                let isValid = true;
                
                if (!name) {
                    document.getElementById('signUpNameError').textContent = 'Full name is required';
                    document.getElementById('signUpName').classList.add('error');
                    isValid = false;
                } else if (name.length < 2) {
                    document.getElementById('signUpNameError').textContent = 'Name must be at least 2 characters';
                    document.getElementById('signUpName').classList.add('error');
                    isValid = false;
                }
                
                if (!email) {
                    document.getElementById('signUpEmailError').textContent = 'Email is required';
                    document.getElementById('signUpEmail').classList.add('error');
                    isValid = false;
                } else if (!isValidEmail(email)) {
                    document.getElementById('signUpEmailError').textContent = 'Please enter a valid email';
                    document.getElementById('signUpEmail').classList.add('error');
                    isValid = false;
                } else if (users.some(u => u.email === email)) {
                    document.getElementById('signUpEmailError').textContent = 'Email already registered';
                    document.getElementById('signUpEmail').classList.add('error');
                    isValid = false;
                }
                
                if (!password) {
                    document.getElementById('signUpPasswordError').textContent = 'Password is required';
                    document.getElementById('signUpPassword').classList.add('error');
                    isValid = false;
                } else if (password.length < 6) {
                    document.getElementById('signUpPasswordError').textContent = 'Password must be at least 6 characters';
                    document.getElementById('signUpPassword').classList.add('error');
                    isValid = false;
                }
                
                if (password !== confirmPassword) {
                    document.getElementById('signUpConfirmError').textContent = 'Passwords do not match';
                    document.getElementById('signUpConfirmPassword').classList.add('error');
                    isValid = false;
                }
                
                if (!termsAgree) {
                    showNotification('Please agree to the Terms of Service', 'warning');
                    isValid = false;
                }
                
                if (isValid) {
                    // Create new user
                    const newUser = {
                        name,
                        email,
                        password
                    };
                    
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));
                    
                    // Auto login after registration
                    currentUser = {
                        name: newUser.name,
                        email: newUser.email
                    };
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    // Update UI
                    updateUIForLoggedInUser(currentUser);
                    
                    // Close modal
                    closeAuthModal();
                    
                    // Show success message
                    showNotification(`Welcome to FurniCraft, ${name}!`, 'success');
                    
                    // Clear form
                    this.reset();
                }
            });
            
            // Logout function
            function logout() {
                currentUser = null;
                localStorage.removeItem('currentUser');
                
                // Update UI for logged out state
                updateUIForLoggedOutUser();
                
                showNotification('You have been logged out', 'info');
            }
            
            // Desktop logout
            logoutBtnDesktop.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
            
            // Update UI for logged in user
            function updateUIForLoggedInUser(user) {
                // Desktop
                userNameDesktop.textContent = user.name.split(' ')[0];
                signInBtnDesktop.style.display = 'none';
                signUpBtnDesktop.style.display = 'none';
                myAccountBtnDesktop.style.display = 'block';
                logoutBtnDesktop.style.display = 'block';
                
                // Mobile
                mobileUserInfo.innerHTML = `
                    <div style="margin-bottom: 1rem;">
                        <span style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Welcome, ${user.name}!</span>
                        <button class="btn btn-outline" id="mobileLogoutBtn" style="margin-right: 0.5rem;">Logout</button>
                        <button class="btn btn-outline" id="mobileAccountBtn">Account</button>
                    </div>
                `;
                
                // Add event listener for mobile logout
                document.getElementById('mobileLogoutBtn').addEventListener('click', logout);
                document.getElementById('mobileAccountBtn').addEventListener('click', function() {
                    showNotification('Account page coming soon!', 'info');
                });
            }
            
            // Update UI for logged out user
            function updateUIForLoggedOutUser() {
                // Desktop
                userNameDesktop.textContent = 'Sign In';
                signInBtnDesktop.style.display = 'block';
                signUpBtnDesktop.style.display = 'block';
                myAccountBtnDesktop.style.display = 'none';
                logoutBtnDesktop.style.display = 'none';
                
                // Mobile
                mobileUserInfo.innerHTML = `
                    <div style="margin-bottom: 1rem;">
                        <button class="btn btn-outline" id="mobileSignInBtn" style="margin-right: 0.5rem;">Sign In</button>
                        <button class="btn btn-outline" id="mobileSignUpBtn">Sign Up</button>
                    </div>
                `;
                
                // Re-attach event listeners
                document.getElementById('mobileSignInBtn').addEventListener('click', function() {
                    openAuthModal('signin');
                    mobileMenu.classList.remove('active');
                    hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
                });
                
                document.getElementById('mobileSignUpBtn').addEventListener('click', function() {
                    openAuthModal('signup');
                    mobileMenu.classList.remove('active');
                    hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
                });
            }
            
            // Email validation helper
            function isValidEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }
            
            // ==================== CART FUNCTIONALITY ====================
            
            // Cart data
            let cart = [];
            let cartItems = 0;
            let cartTotal = 0;
            
            // DOM Elements for Cart
            const cartIconDesktop = document.getElementById('cart-icon-desktop');
            const cartIconMobile = document.getElementById('cart-icon-mobile');
            const cartSidebar = document.getElementById('cartSidebar');
            const cartOverlay = document.getElementById('cartOverlay');
            const closeCartBtn = document.getElementById('closeCart');
            const cartItemsContainer = document.getElementById('cartItems');
            const cartFooter = document.getElementById('cartFooter');
            const cartTotalElement = document.getElementById('cartTotal');
            const cartCountElements = document.querySelectorAll('.cart-count');
            const cartNotification = document.getElementById('cartNotification');
            const authRequiredMessage = document.getElementById('authRequiredMessage');
            const addToCartButtons = document.querySelectorAll('.add-to-cart');
            const checkoutBtn = document.getElementById('checkoutBtn');
            
            // Cart toggle functionality
            function toggleCart() {
                cartSidebar.classList.toggle('active');
                cartOverlay.classList.toggle('active');
                document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
            }
            
            // Open cart
            cartIconDesktop.addEventListener('click', function (e) {
                e.preventDefault();
                toggleCart();
            });
            
            cartIconMobile.addEventListener('click', function (e) {
                e.preventDefault();
                toggleCart();
                // Close mobile menu if open
                mobileMenu.classList.remove('active');
                hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
            });
            
            // Close cart
            closeCartBtn.addEventListener('click', toggleCart);
            cartOverlay.addEventListener('click', toggleCart);
            
            // Checkout button - require authentication
            checkoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (!currentUser) {
                    // Close cart
                    toggleCart();
                    // Show auth required message
                    showAuthRequiredMessage();
                    // Open auth modal
                    setTimeout(() => {
                        openAuthModal('signin');
                    }, 500);
                } else {
                    showNotification('Proceeding to checkout...', 'success');
                }
            });
            
            // Add to cart functionality with auth check
            addToCartButtons.forEach(button => {
                button.addEventListener('click', function (e) {
                    e.preventDefault();
                    
                    // Check if user is logged in
                    if (!currentUser) {
                        showAuthRequiredMessage();
                        openAuthModal('signin');
                        return;
                    }
                    
                    const product = this.getAttribute('data-product');
                    const price = parseFloat(this.getAttribute('data-price'));
                    const image = this.getAttribute('data-image');
                    
                    // Add item to cart
                    addToCart(product, price, image);
                    
                    // Show notification
                    showNotification(`${product} added to cart!`, 'success');
                    
                    // Button animation
                    const originalText = this.textContent;
                    this.textContent = 'Added!';
                    this.style.backgroundColor = '#4CAF50';
                    
                    // Reset button after animation
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.backgroundColor = '';
                    }, 1500);
                });
            });
            
            // Add item to cart
            function addToCart(product, price, image) {
                // Check if item already exists in cart
                const existingItem = cart.find(item => item.product === product);
                
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({
                        product,
                        price,
                        image,
                        quantity: 1
                    });
                }
                
                // Update cart display
                updateCart();
            }
            
            // Remove item from cart
            function removeFromCart(product) {
                cart = cart.filter(item => item.product !== product);
                updateCart();
            }
            
            // Update cart display
            function updateCart() {
                // Update cart count
                cartItems = cart.reduce((total, item) => total + item.quantity, 0);
                cartCountElements.forEach(count => {
                    count.textContent = cartItems;
                });
                
                // Update cart total
                cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
                cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
                
                // Update cart items display
                renderCartItems();
                
                // Show/hide cart footer
                if (cart.length > 0) {
                    cartFooter.style.display = 'block';
                } else {
                    cartFooter.style.display = 'none';
                }
            }
            
            // Render cart items
            function renderCartItems() {
                if (cart.length === 0) {
                    cartItemsContainer.innerHTML = `
                        <div class="cart-empty">
                            <i class="fas fa-shopping-cart"></i>
                            <p>Your cart is empty</p>
                        </div>
                    `;
                    return;
                }
                
                cartItemsContainer.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.product}">
                        <div class="cart-item-info">
                            <h4>${item.product}</h4>
                            <p class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</p>
                            <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <button class="cart-item-remove" data-product="${item.product}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('');
                
                // Add event listeners to remove buttons
                document.querySelectorAll('.cart-item-remove').forEach(button => {
                    button.addEventListener('click', function () {
                        const product = this.getAttribute('data-product');
                        removeFromCart(product);
                        showNotification(`${product} removed from cart!`, 'info');
                    });
                });
            }
            
            // Show notification
            function showNotification(message, type = 'success') {
                const notification = document.getElementById('cartNotification');
                notification.querySelector('span').textContent = message;
                
                // Change icon based on type
                const icon = notification.querySelector('i');
                if (type === 'success') {
                    icon.className = 'fas fa-check-circle';
                    notification.style.backgroundColor = 'var(--primary-color)';
                } else if (type === 'error') {
                    icon.className = 'fas fa-exclamation-circle';
                    notification.style.backgroundColor = '#f44336';
                } else if (type === 'warning') {
                    icon.className = 'fas fa-exclamation-triangle';
                    notification.style.backgroundColor = '#ff9800';
                } else {
                    icon.className = 'fas fa-info-circle';
                    notification.style.backgroundColor = '#2196F3';
                }
                
                notification.classList.add('show');
                
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }
            
            // Show auth required message
            function showAuthRequiredMessage() {
                const message = document.getElementById('authRequiredMessage');
                message.classList.add('show');
                
                setTimeout(() => {
                    message.classList.remove('show');
                }, 3000);
            }
            
            // ==================== THEME TOGGLE ====================
            
            const themeToggle = document.getElementById('theme-toggle');
            const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
            const themeIcon = themeToggle.querySelector('i');
            const mobileThemeIcon = mobileThemeToggle.querySelector('i');
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Check for saved theme preference or use system preference
            const currentTheme = localStorage.getItem('theme');
            if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
                document.body.setAttribute('data-theme', 'dark');
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                mobileThemeIcon.classList.replace('fa-moon', 'fa-sun');
            }
            
            // Desktop theme toggle
            themeToggle.addEventListener('click', toggleTheme);
            
            // Mobile theme toggle
            mobileThemeToggle.addEventListener('click', function () {
                toggleTheme();
                // Close mobile menu after theme toggle
                mobileMenu.classList.remove('active');
                hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
            });
            
            function toggleTheme() {
                const isDark = document.body.getAttribute('data-theme') === 'dark';
                if (isDark) {
                    document.body.removeAttribute('data-theme');
                    themeIcon.classList.replace('fa-sun', 'fa-moon');
                    mobileThemeIcon.classList.replace('fa-sun', 'fa-moon');
                    localStorage.setItem('theme', 'light');
                } else {
                    document.body.setAttribute('data-theme', 'dark');
                    themeIcon.classList.replace('fa-moon', 'fa-sun');
                    mobileThemeIcon.classList.replace('fa-moon', 'fa-sun');
                    localStorage.setItem('theme', 'dark');
                }
            }
            
            // ==================== MOBILE MENU ====================
            
            const hamburger = document.querySelector('.hamburger');
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuLinks = document.querySelectorAll('.mobile-nav-links a');
            
            hamburger.addEventListener('click', function () {
                mobileMenu.classList.toggle('active');
                // Toggle hamburger icon
                const icon = this.querySelector('i');
                if (mobileMenu.classList.contains('active')) {
                    icon.classList.replace('fa-bars', 'fa-times');
                } else {
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            });
            
            // Close mobile menu when clicking a link
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', function () {
                    mobileMenu.classList.remove('active');
                    hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
                });
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', function (event) {
                const isClickInsideMenu = mobileMenu.contains(event.target);
                const isClickOnHamburger = hamburger.contains(event.target);
                
                if (!isClickInsideMenu && !isClickOnHamburger && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
                }
            });
            
            // ==================== CONTACT FORM ====================
            
            const contactForm = document.getElementById('contactForm');
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                console.log('Contact form submitted:', data);
                
                // Show success message
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                
                // Reset form
                this.reset();
            });
            
            // ==================== SMOOTH SCROLLING ====================
            
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    // Don't prevent default for auth buttons and cart
                    if (this.id.includes('signIn') || this.id.includes('signUp') || 
                        this.id.includes('cart') || this.classList.contains('cart-icon')) {
                        return;
                    }
                    
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        // Close mobile menu if open
                        mobileMenu.classList.remove('active');
                        if (hamburger.querySelector('i')) {
                            hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
                        }
                        
                        // Close cart if open
                        if (cartSidebar.classList.contains('active')) {
                            toggleCart();
                        }
                        
                        // Calculate position
                        const headerHeight = document.querySelector('header').offsetHeight;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // ==================== HEADER SHADOW ====================
            
            const header = document.querySelector('header');
            window.addEventListener('scroll', function () {
                if (window.scrollY > 50) {
                    header.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    header.style.boxShadow = 'var(--shadow)';
                }
            });
            
            // ==================== CLOSE CART WITH ESCAPE ====================
            
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    if (cartSidebar.classList.contains('active')) {
                        toggleCart();
                    }
                    if (authModal.classList.contains('active')) {
                        closeAuthModal();
                    }
                }
            });
            
            // ==================== SEARCH FUNCTIONALITY ====================
            
            const searchIconDesktop = document.getElementById('search-icon-desktop');
            const searchIconMobile = document.getElementById('search-icon-mobile');
            
            searchIconDesktop.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('Search feature coming soon!', 'info');
            });
            
            searchIconMobile.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('Search feature coming soon!', 'info');
                mobileMenu.classList.remove('active');
                hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
            });
        });
    </script>