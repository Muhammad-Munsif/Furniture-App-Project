document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    
    // Theme toggle button click event
    themeToggle.addEventListener('click', function() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navIcons = document.querySelector('.nav-icons');
    
    hamburger.addEventListener('click', function() {
        const isOpen = navLinks.style.display === 'flex';
        
        if (isOpen) {
            navLinks.style.display = 'none';
            navIcons.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navIcons.style.display = 'flex';
            
            // Adjust for mobile
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.backgroundColor = 'var(--nav-bg)';
            navLinks.style.padding = '1rem 0';
            navLinks.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            
            navIcons.style.flexDirection = 'row';
            navIcons.style.justifyContent = 'center';
            navIcons.style.padding = '1rem 0';
            navIcons.style.backgroundColor = 'var(--nav-bg)';
            navIcons.style.width = '100%';
            navIcons.style.gap = '2rem';
            
            // Adjust individual items
            const navItems = navLinks.querySelectorAll('li');
            navItems.forEach(item => {
                item.style.margin = '0.5rem 0';
                item.style.textAlign = 'center';
            });
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                navLinks.style.display = 'none';
                navIcons.style.display = 'none';
                
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
    
    // Add to cart animation
    const addToCartButtons = document.querySelectorAll('.btn-small');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Animation effect
            this.textContent = 'Added!';
            this.style.backgroundColor = '#4CAF50';
            
            // Reset after animation
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.backgroundColor = '';
            }, 1500);
            
            // Here you would normally add to cart functionality
            console.log('Product added to cart');
        });
    });
    
    // Responsive adjustments
    function handleResize() {
        if (window.innerWidth > 768) {
            navLinks.style.display = 'flex';
            navIcons.style.display = 'flex';
            
            // Reset styles for desktop
            navLinks.style.flexDirection = '';
            navLinks.style.position = '';
            navLinks.style.top = '';
            navLinks.style.left = '';
            navLinks.style.width = '';
            navLinks.style.backgroundColor = '';
            navLinks.style.padding = '';
            navLinks.style.boxShadow = '';
            
            navIcons.style.flexDirection = '';
            navIcons.style.justifyContent = '';
            navIcons.style.padding = '';
            navIcons.style.backgroundColor = '';
            navIcons.style.width = '';
            navIcons.style.gap = '';
            
            const navItems = navLinks.querySelectorAll('li');
            navItems.forEach(item => {
                item.style.margin = '';
                item.style.textAlign = '';
            });
        } else {
            navLinks.style.display = 'none';
            navIcons.style.display = 'none';
        }
    }
    
    window.addEventListener('resize', handleResize);
});