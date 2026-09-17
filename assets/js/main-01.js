// Initialize all components when DOM loads
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // NOTE: AOS.init() is now called from the page loader, not here.

        // Initialize Portfolio only if elements exist (OPTIONAL)
        if (document.querySelector('.portfolio-grid')) {
            initPortfolioIsotope();
        }

    } catch (error) {
        console.error('Error initializing components:', error);
    }
});

/**
 * Enhanced portfolio initialization function
 */
function initPortfolioIsotope() {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (!portfolioGrid) {
        return;
    }

    if (filterButtons.length === 0) {
        console.warn('⚠️ No filter buttons found');
        return;
    }

    // Wait for images to load
    waitForImages(portfolioGrid).then(() => {

        // Create CustomIsotope instance
        const customIsotope = new CustomIsotope(portfolioGrid, {
            itemSelector: '.portfolio-item',
            gutter: 24, // Match your CSS gap
            transitionDuration: 500,
            hiddenStyle: {
                opacity: 0,
                transform: 'scale(0.9) translateY(20px)'
            },
            visibleStyle: {
                opacity: 1,
                transform: 'scale(1) translateY(0px)'
            }
        });

        // Store instance globally
        window.portfolioIsotope = customIsotope;
        window.customIsotope = customIsotope; // Additional alias

        // Setup filter buttons
        setupFilterButtons(customIsotope, filterButtons);

        // Refresh AOS after portfolio layout (only if portfolio exists)
        setTimeout(() => {
            refreshAOS();
        }, 1000);

    }).catch(error => {
        console.error('❌ Error loading images:', error);
        // Initialize anyway after timeout
        setTimeout(() => {
            const customIsotope = new CustomIsotope(portfolioGrid);
            window.portfolioIsotope = customIsotope;
            setupFilterButtons(customIsotope, filterButtons);
        }, 1000);
    });
}

// AOS control functions
function refreshAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        setTimeout(refreshAOS, 100);
    }
});

// Refresh AOS on window resize
window.addEventListener('resize', function() {
    setTimeout(refreshAOS, 100);
});

// Expose utility functions globally
window.AOSUtils = {
    refresh: refreshAOS
};

// ==========================================================================
// RESPONSIVE HEADER
// ==========================================================================

function initResponsiveHeader() {
    const header = document.querySelector('.header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navbar = document.getElementById('navbar');
    const body = document.body;
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');

    if (!header || !mobileMenuToggle || !navbar) return;

    // Mobile menu functions
    function openMobileMenu() {
        navbar.classList.add('mobile-menu-open');
        mobileMenuToggle.classList.add('active');
        body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        navbar.classList.remove('mobile-menu-open');
        mobileMenuToggle.classList.remove('active');
        body.style.overflow = '';
        closeAllDropdowns();
    }

    function toggleMobileMenu() {
        if (navbar.classList.contains('mobile-menu-open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Mobile menu event listeners
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });

    document.addEventListener('click', function(e) {
        const isClickInsideMenu = navbar.contains(e.target);
        const isClickOnToggle = mobileMenuToggle.contains(e.target);

        if (!isClickInsideMenu && !isClickOnToggle && navbar.classList.contains('mobile-menu-open')) {
            closeMobileMenu();
        }
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                closeMobileMenu();
            }
        });
    });

    function closeAllDropdowns() {
        dropdownMenus.forEach(menu => {
            menu.classList.remove('dropdown-open');
        });
        dropdownToggles.forEach(toggle => {
            toggle.classList.remove('active');
        });
    }

    function toggleDropdown(dropdownId, toggleElement) {
        const dropdownMenu = document.getElementById(dropdownId);

        if (!dropdownMenu) return;

        const isOpen = dropdownMenu.classList.contains('dropdown-open');
        closeAllDropdowns();

        if (!isOpen) {
            dropdownMenu.classList.add('dropdown-open');
            toggleElement.classList.add('active');
        }
    }

    // Dropdown event listeners
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const dropdownId = this.getAttribute('data-dropdown');
            toggleDropdown(dropdownId, this);
        });
    });

    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
            const isClickInsideDropdown = Array.from(dropdownMenus).some(menu =>
                menu.contains(e.target)
            );
            const isClickOnToggle = Array.from(dropdownToggles).some(toggle =>
                toggle.contains(e.target)
            );

            if (!isClickInsideDropdown && !isClickOnToggle) {
                closeAllDropdowns();
            }
        }
    });

    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                closeAllDropdowns();
                closeMobileMenu();
            }
        });
    });

    function handleHeaderScroll() {
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
            header.classList.remove('header-transparent');
        } else {
            header.classList.remove('header-scrolled');
            header.classList.add('header-transparent');
        }
    }

    if (window.scrollY > 100) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.add('header-transparent');
    }

    window.addEventListener('scroll', handleHeaderScroll);

    function handleWindowResize() {
        if (window.innerWidth > 992) {
            closeMobileMenu();
            closeAllDropdowns();
        }
    }

    window.addEventListener('resize', handleWindowResize);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (navbar.classList.contains('mobile-menu-open')) {
                closeMobileMenu();
            }
            closeAllDropdowns();
        }
    });
}

// Initialize responsive header
initResponsiveHeader();

// ==========================================================================
// SCROLL TO TOP FUNCTIONALITY
// ==========================================================================

const scrollToTop = document.getElementById('scrollToTop');
if (scrollToTop) {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTop.classList.add('show');
        } else {
            scrollToTop.classList.remove('show');
        }
    });

    scrollToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Page Loader Controller - WorldTravel
 */

class TravelPageLoader {
    constructor() {
        this.loader = document.getElementById('page-loader');
        this.minLoadTime = 400; // Fast display time in milliseconds
        this.maxLoadTime = 2000; // Safety timeout to prevent indefinite loading
        this.isLoaded = false;
        this.startTime = Date.now();

        if (this.loader) {
            this.init();
        } else {
            console.warn('Travel Loader: #page-loader not found.');
        }
    }

    // Initializes loader logic
    init() {
        document.body.classList.add('loading');
        this.waitForPageLoad();
        this.setSafetyTimeout();
    }

    // Waits for DOM and window to finish loading
    waitForPageLoad() {
        // Use window.onload as a reliable single event for when everything is ready
        window.addEventListener('load', () => {
            this.isLoaded = true;
            this.hideAfterMinimum();
        }, { once: true });
    }

    // Ensures the loader stays for the minimum time
    hideAfterMinimum() {
        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(this.minLoadTime - elapsed, 0);

        setTimeout(() => this.hideLoader(), remaining);
    }

    // Fallback in case load events never trigger
    setSafetyTimeout() {
        setTimeout(() => {
            if (!this.isLoaded) {
                console.warn('Travel Loader: Max timeout reached. Forcing hide.');
                this.hideLoader();
            }
        }, this.maxLoadTime);
    }

    // Hides the loader and removes it from DOM
    hideLoader() {
        if (!this.loader) return;

        this.loader.classList.add('loaded');
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');

        // Initialize AOS here, wrapped in a setTimeout, AFTER the loader is hidden
        if (typeof AOS !== 'undefined') {
            setTimeout(() => {
                AOS.init({
                    duration: 800,
                    delay: 100,
                    once: true,
                    mirror: false,
                    offset: 120,
                    easing: 'ease-out-cubic',
                    disable: false
                });
            }, 100); // This small delay is crucial for rendering
        }

        // Wait a moment before removing for smoother transition
        setTimeout(() => {
            if (this.loader && this.loader.parentNode) {
                this.loader.parentNode.removeChild(this.loader);
            }
        }, 500); // Allow time for CSS fade-out transition
    }
}

// Initialize the loader
new TravelPageLoader();
