/**
 * StayFanatic — Main JavaScript
 * Mobile-optimized with performance best practices
 */

(function() {
    'use strict';

    // ===================================
    // Mobile Menu Toggle
    // ===================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on a link
        const menuLinks = navMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ===================================
    // Scroll Effects for Navigation
    // ===================================
    const nav = document.getElementById('nav');
    let lastScrollTop = 0;
    let scrollThreshold = 100;

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (nav) {
            // Add scrolled class when user scrolls down
            if (scrollTop > scrollThreshold) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        lastScrollTop = scrollTop;
    }

    // Throttle scroll events for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                handleScroll();
                scrollTimeout = null;
            }, 10);
        }
    }, { passive: true });

    // ===================================
    // Email Form Handling
    // ===================================
    function handleEmailForm(formId, successId) {
        const form = document.getElementById(formId);
        const successMessage = document.getElementById(successId);

        if (form && successMessage) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                const emailInput = this.querySelector('input[type="email"]');
                const email = emailInput.value.trim();

                // Basic email validation
                if (isValidEmail(email)) {
                    // Here you would typically send to your backend/email service
                    console.log('Email submitted:', email);

                    // Show success message
                    form.style.display = 'none';
                    successMessage.style.display = 'flex';

                    // Store in localStorage (optional)
                    try {
                        localStorage.setItem('stayfanatic_email', email);
                    } catch (e) {
                        console.log('LocalStorage not available');
                    }

                    // Track conversion (if analytics is set up)
                    if (window.gtag) {
                        window.gtag('event', 'signup', {
                            'event_category': 'engagement',
                            'event_label': 'email_signup'
                        });
                    }
                } else {
                    // Show error (you can enhance this with better UI)
                    alert('Please enter a valid email address.');
                }
            });
        }
    }

    // Email validation helper
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Initialize forms
    handleEmailForm('emailForm', 'formSuccess');
    handleEmailForm('emailFormBottom', 'formSuccessBottom');

    // ===================================
    // Smooth Scroll for Anchor Links
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================
    // Lazy Loading Images (Native)
    // ===================================
    // Modern browsers support native lazy loading
    // This is a fallback for older browsers
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.src;
        });
    } else {
        // Fallback for older browsers
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // ===================================
    // Intersection Observer for Animations
    // ===================================
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements (add .fade-in class to elements you want to animate)
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    // ===================================
    // Performance: Preload Critical Images
    // ===================================
    function preloadImage(url) {
        const img = new Image();
        img.src = url;
    }

    // Preload hero image on homepage
    if (document.getElementById('hero')) {
        const heroImg = document.querySelector('.hero-image img');
        if (heroImg && heroImg.src) {
            preloadImage(heroImg.src);
        }
    }

    // ===================================
    // Detect if User Prefers Reduced Motion
    // ===================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        // Disable animations for users who prefer reduced motion
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-medium', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');
    }

    // ===================================
    // Service Worker Registration (Optional)
    // Uncomment if you want PWA capabilities
    // ===================================
    /*
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').then(
                function(registration) {
                    console.log('ServiceWorker registration successful');
                },
                function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                }
            );
        });
    }
    */

    // ===================================
    // Console Easter Egg
    // ===================================
    console.log(
        '%cStayFanatic ⚡',
        'font-size: 20px; font-weight: bold; color: #1a1a1a;'
    );
    console.log(
        '%cSleep inside the fandom. One city. One legendary stay.',
        'font-size: 14px; color: #666;'
    );
    console.log(
        '%cInterested in joining our team? Email us at hello@stayfanatic.com',
        'font-size: 12px; color: #999;'
    );

    // ===================================
    // Initialize on DOM Ready
    // ===================================
    document.addEventListener('DOMContentLoaded', function() {
        // Any initialization code that needs to run when DOM is ready
        console.log('StayFanatic initialized');

        // Check if user is returning visitor
        try {
            const savedEmail = localStorage.getItem('stayfanatic_email');
            if (savedEmail) {
                console.log('Welcome back!');
            }
        } catch (e) {
            console.log('LocalStorage not available');
        }
    });

    // ===================================
    // Analytics Helper Functions
    // ===================================
    window.trackEvent = function(category, action, label) {
        if (window.gtag) {
            window.gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
        console.log('Event tracked:', category, action, label);
    };

    // Track outbound links
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.hostname !== window.location.hostname) {
            trackEvent('outbound', 'click', link.href);
        }
    });

    // ===================================
    // Viewport Height Fix for Mobile
    // ===================================
    function setVh() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    // ===================================
    // Performance Monitoring
    // ===================================
    window.addEventListener('load', function() {
        // Log page load time
        if (window.performance && window.performance.timing) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
        }
    });

})();
