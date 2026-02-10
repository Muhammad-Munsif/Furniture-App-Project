
document.addEventListener('DOMContentLoaded', function () {
    // Cart data
    let cart = [];
    let cartItems = 0;
    let cartTotal = 0;

    // DOM Elements
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
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    // Theme toggle functionality
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

    // Desktop theme toggle button click event
    themeToggle.addEventListener('click', function () {
        toggleTheme();
    });

    // Mobile theme toggle button click event
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

    // Mobile menu functionality
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

    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const product = this.getAttribute('data-product');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');

            // Add item to cart
            addToCart(product, price, image);

            // Show notification
            showNotification(`${product} added to cart!`);

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
                showNotification(`${product} removed from cart!`);
            });
        });
    }

    // Show notification
    function showNotification(message) {
        const notification = document.getElementById('cartNotification');
        notification.querySelector('span').textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // In a real application, you would send this data to a server
        console.log('Contact form submitted:', data);

        // Show success message
        alert('Thank you for your message! We will get back to you soon.');

        // Reset form
        this.reset();
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Header shadow on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'var(--shadow)';
        }
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

    // Close cart with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
            toggleCart();
        }
    });
});
