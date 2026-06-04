/* ============================================
   GIGAMERGE STUDIO - MAIN APPLICATION
   ============================================ */

class GigaMergeApp {
    constructor() {
        this.theme = localStorage.getItem('gm_theme') || 'dark';
        this.initialize();
    }

    initialize() {
        this.setupTheme();
        this.setupParticles();
        this.setupScrollAnimations();
        this.setupMobileMenu();
        this.setupNavigation();
        this.setupSmoothScroll();
        this.registerServiceWorker();
        this.setupResponsiveness();
    }

    // ============ THEME SYSTEM ============

    setupTheme() {
        this.applyTheme(this.theme);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
            this.updateThemeIcon();
        }
    }

    toggleTheme() {
        const themes = ['dark', 'light', 'neon-theme'];
        const currentIndex = themes.indexOf(this.theme === 'dark' ? 'dark' : this.theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.theme = themes[nextIndex];
        
        localStorage.setItem('gm_theme', this.theme);
        this.applyTheme(this.theme);
        this.updateThemeIcon();
    }

    applyTheme(theme) {
        document.body.className = '';
        if (theme !== 'dark') {
            document.body.classList.add(theme);
        }
    }

    updateThemeIcon() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        const icons = {
            'dark': '☀️',
            'light': '🌙',
            'neon-theme': '⚡'
        };
        themeToggle.textContent = icons[this.theme] || '🌙';
    }

    // ============ PARTICLE SYSTEM ============

    setupParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = window.innerWidth > 768 ? 6 : 3;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 6}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // ============ SCROLL ANIMATIONS ============

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Trigger staggered animations for children
                    const children = entry.target.querySelectorAll('.fade-in, .founder-card, .creator-card, .project-card, .social-card, .pricing-card, .leaderboard-row');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('section, .founders-section, .creators-section, .projects-section, .leaderboard-section, .social-hub, .about-section').forEach(el => {
            observer.observe(el);
        });
    }

    // ============ MOBILE MENU ============

    setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navbarMenu = document.getElementById('navbarMenu');

        if (hamburger) {
            hamburger.addEventListener('click', () => {
                navbarMenu.classList.toggle('active');
            });
        }

        // Close menu when clicking nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navbarMenu) navbarMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navbarMenu && !e.target.closest('.navbar-container')) {
                navbarMenu.classList.remove('active');
            }
        });
    }

    // ============ NAVIGATION ============

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let currentSection = 'home';
            
            document.querySelectorAll('section').forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ============ SMOOTH SCROLL ============

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ============ RESPONSIVE DESIGN ============

    setupResponsiveness() {
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    handleResize() {
        // Adjust particles on resize
        const particlesContainer = document.getElementById('particles');
        if (particlesContainer) {
            const particleCount = window.innerWidth > 768 ? 6 : 3;
            const currentParticles = particlesContainer.querySelectorAll('.particle').length;
            
            if (currentParticles !== particleCount) {
                particlesContainer.innerHTML = '';
                this.setupParticles();
            }
        }
    }

    // ============ SERVICE WORKER (PWA) ============

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').then(registration => {
                console.log('Service Worker registered:', registration);
            }).catch(error => {
                console.log('Service Worker registration failed:', error);
            });
        }
    }
}

// ============ UTILITY FUNCTIONS ============

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Local Storage Helper
class StorageHelper {
    static set(key, value) {
        try {
            localStorage.setItem(`gm_${key}`, JSON.stringify(value));
        } catch (e) {
            console.error('Storage error:', e);
        }
    }

    static get(key) {
        try {
            const item = localStorage.getItem(`gm_${key}`);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(`gm_${key}`);
        } catch (e) {
            console.error('Storage error:', e);
        }
    }

    static clear() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('gm_')) {
                    localStorage.removeItem(key);
                }
            });
        } catch (e) {
            console.error('Storage error:', e);
        }
    }
}

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', () => {
    // Initialize main app
    window.gigaMergeApp = new GigaMergeApp();

    // Add loading animation
    document.body.style.opacity = '1';
    document.body.style.animation = 'fadeInUp 0.6s ease';

    // Log startup
    console.log('%c🚀 GigaMerge Studio Initialized', 'color: #00d9ff; font-size: 16px; font-weight: bold;');
    console.log('%cWhere Creativity Meets Technology', 'color: #7c3aed; font-size: 12px; font-style: italic;');
});

// ============ PERFORMANCE MONITORING ============

window.addEventListener('load', () => {
    // Measure performance
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`Page Load Time: ${pageLoadTime}ms`);
});

// ============ ERROR HANDLING ============

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// ============ KEYBOARD SHORTCUTS ============

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K: Open chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const chatbot = document.getElementById('chatbot');
        if (chatbot) chatbot.classList.toggle('active');
    }

    // Ctrl/Cmd + L: Login
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        const authBtn = document.getElementById('authBtn');
        if (authBtn) authBtn.click();
    }

    // Ctrl/Cmd + T: Toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.click();
    }
});

// ============ ACCESSIBILITY ============

// Skip to main content
const skipLink = document.createElement('a');
skipLink.href = '#home';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary);
    color: var(--bg-dark);
    padding: 8px 16px;
    z-index: 100;
`;

skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
});

skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});

document.body.insertBefore(skipLink, document.body.firstChild);

// Focus visible styles
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ============ ANALYTICS (PLACEHOLDER) ============

class Analytics {
    static trackEvent(eventName, eventData = {}) {
        console.log(`📊 Event: ${eventName}`, eventData);
        // Send to analytics service
    }

    static trackPageView(pageName) {
        console.log(`📄 Page View: ${pageName}`);
    }

    static trackUserAction(action) {
        console.log(`👤 User Action: ${action}`);
    }
}

// Track page views
window.addEventListener('load', () => {
    Analytics.trackPageView(window.location.pathname);
});

// ============ DARK MODE PREFERENCE ============

// Check system preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if (!localStorage.getItem('gm_theme')) {
        document.body.classList.remove('light-theme', 'neon-theme');
    }
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('gm_theme')) {
        if (e.matches) {
            document.body.classList.remove('light-theme', 'neon-theme');
        }
    }
});

// ============ EXPORT FOR TESTING ============

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GigaMergeApp, StorageHelper, Analytics };
}
