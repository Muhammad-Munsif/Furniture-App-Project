<script>
    document.addEventListener('DOMContentLoaded', function () {
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
    const cartCount = document.querySelectorAll('.cart-count');
    let cartItems = 0;

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

    // Cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartNotification = document.getElementById('cartNotification');
            
            addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Get product details
            const product = this.getAttribute('data-product');
            const price = this.getAttribute('data-price');

            // Update cart count
            cartItems++;
            cartCount.forEach(count => {
                count.textContent = cartItems;
            });

            // Show notification
            cartNotification.classList.add('show');

            // Button animation
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.style.backgroundColor = '#4CAF50';

            // Reset button after animation
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 1500);

            // Hide notification after 3 seconds
            setTimeout(() => {
                cartNotification.classList.remove('show');
            }, 3000);

            // In a real application, you would add the product to a cart array or send to backend
            console.log(`Added to cart: ${product} - $${price}`);
        });
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
    window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
        header.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
                } else {
        header.style.boxShadow = 'var(--shadow)';
                }
            });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
                const isClickInsideMenu = mobileMenu.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);

    if (!isClickInsideMenu && !isClickOnHamburger && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
                }
            });
        });
</script>