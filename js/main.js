(function() {
    'use strict';

    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const heroSection = document.querySelector('.hero-section');
    const mainContent = document.querySelector('.main-content');
    
    // Cache for loaded sections
    const sectionCache = new Map();
    let dynamicSectionContainer = null;

    // Initialize the application
    function init() {
        createDynamicSectionContainer();
        setupNavigation();
        setupSmoothScrolling();
        setupAccessibility();
        setupCacheBusting();
        
        console.log('Portfolio initialized successfully');
    }
    
    // Setup cache busting for development
    function setupCacheBusting() {
        // Add keyboard shortcut to clear cache (Ctrl+Shift+R or Cmd+Shift+R)
        document.addEventListener('keydown', function(event) {
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'R') {
                event.preventDefault();
                clearSectionCache();
                console.log('Section cache cleared! Refresh sections to see changes.');
            }
        });
        
        // Clear cache if URL has ?nocache parameter
        if (window.location.search.includes('nocache')) {
            clearSectionCache();
        }
    }
    
    // Clear section cache
    function clearSectionCache() {
        sectionCache.clear();
        console.log('Section cache cleared');
    }
    
    // Create container for dynamically loaded sections
    function createDynamicSectionContainer() {
        dynamicSectionContainer = document.createElement('div');
        dynamicSectionContainer.id = 'dynamic-sections';
        dynamicSectionContainer.style.display = 'none';
        mainContent.appendChild(dynamicSectionContainer);
    }

    // Navigation Functions
    function setupNavigation() {
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });
        
        // Set initial active state
        setActiveNav('about');
    }

    function handleNavClick(event) {
        event.preventDefault();
        
        const targetId = event.target.getAttribute('href').substring(1);
        
        // Update active nav link
        setActiveNav(targetId);
        
        // Show/hide sections
        showSection(targetId);
        
        // Smooth scroll to top of main content
        scrollToTop();
    }

    function setActiveNav(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }

    async function showSection(targetId) {
        // Show/hide hero section
        if (targetId === 'about') {
            heroSection.style.display = 'block';
            dynamicSectionContainer.style.display = 'none';
        } else {
            heroSection.style.display = 'none';
            
            // Load and show the dynamic section
            await loadDynamicSection(targetId);
            dynamicSectionContainer.style.display = 'block';
        }
    }
    
    // Load section content from external file
    async function loadDynamicSection(sectionId) {
        // Check cache first
        if (sectionCache.has(sectionId)) {
            dynamicSectionContainer.innerHTML = sectionCache.get(sectionId);
            return;
        }
        
        try {
            // Show loading state
            dynamicSectionContainer.innerHTML = '<div class="loading">Loading...</div>';
            
            // Fetch from external file
            const response = await fetch(`sections/${sectionId}.html`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const content = await response.text();
            
            // Cache the content
            sectionCache.set(sectionId, content);
            
            // Display the content
            dynamicSectionContainer.innerHTML = content;
            
            // Re-run accessibility setup for new content
            setupAccessibilityForNewContent();
            
            // Setup toggle functionality for misc section
            if (sectionId === 'misc') {
                setTimeout(() => {
                    setupToggleFunctionality();
                }, 100);
            }
            
        } catch (error) {
            console.error(`Failed to load section ${sectionId}:`, error);
            
            // Show error with helpful message
            dynamicSectionContainer.innerHTML = `
                <div class="error-message">
                    <h2>Section Not Available</h2>
                    <p>Unable to load the ${sectionId} section. This portfolio needs to be served from a web server to work properly.</p>
                    <div class="error-details">
                        <h3>To view this portfolio:</h3>
                        <ol>
                            <li>Open Terminal/Command Prompt</li>
                            <li>Navigate to the portfolio directory</li>
                            <li>Run: <code>python3 -m http.server 8000</code></li>
                            <li>Open: <a href="http://localhost:8000" target="_blank">http://localhost:8000</a></li>
                        </ol>
                    </div>
                </div>
            `;
        }
    }
    
    // Setup accessibility for dynamically loaded content
    function setupAccessibilityForNewContent() {
        const newSections = dynamicSectionContainer.querySelectorAll('section');
        newSections.forEach(section => {
            const heading = section.querySelector('h1, h2');
            if (heading && !section.getAttribute('aria-labelledby')) {
                if (!heading.id) {
                    heading.id = generateId();
                }
                section.setAttribute('aria-labelledby', heading.id);
            }
        });
        
        // Setup toggle functionality for curation items
        setupToggleFunctionality();
    }
    
    // Setup toggle functionality for curation sections
    function setupToggleFunctionality() {
        const toggleHeaders = document.querySelectorAll('.toggle-header');
        
        toggleHeaders.forEach(header => {
            // Remove existing listeners to avoid duplicates
            const newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);
            
            newHeader.addEventListener('click', function() {
                const targetId = this.getAttribute('data-toggle');
                const targetContent = document.getElementById(targetId);
                
                if (targetContent) {
                    // Toggle active states
                    this.classList.toggle('active');
                    targetContent.classList.toggle('active');
                }
            });
            
            // Add keyboard support
            newHeader.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.click();
                }
            });
            
            // Make focusable
            newHeader.setAttribute('tabindex', '0');
            newHeader.setAttribute('role', 'button');
            newHeader.setAttribute('aria-expanded', 'false');
            
            // Update aria-expanded when toggled
            newHeader.addEventListener('click', function() {
                const isExpanded = this.classList.contains('active');
                this.setAttribute('aria-expanded', isExpanded.toString());
            });
        });
    }

    // Smooth Scrolling
    function setupSmoothScrolling() {
        // Enable smooth scrolling for the page
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Accessibility Functions
    function setupAccessibility() {
        // Add keyboard navigation
        navLinks.forEach(link => {
            link.addEventListener('keydown', handleKeydown);
        });
        
        // Add ARIA attributes
        addAriaAttributes();
        
        // Setup focus management
        setupFocusManagement();
    }

    function handleKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.target.click();
        }
    }

    function addAriaAttributes() {
        // Add ARIA labels to navigation
        const nav = document.querySelector('.top-nav');
        if (nav) {
            nav.setAttribute('aria-label', 'Main navigation');
        }
        
        // Add ARIA attributes to sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const heading = section.querySelector('h1, h2');
            if (heading && !section.getAttribute('aria-labelledby')) {
                if (!heading.id) {
                    heading.id = generateId();
                }
                section.setAttribute('aria-labelledby', heading.id);
            }
        });
        
        // Add ARIA labels to social links
        document.querySelectorAll('.social-link').forEach((link, index) => {
            if (!link.getAttribute('aria-label')) {
                const labels = ['Email', 'LinkedIn', 'Instagram', 'CV'];
                link.setAttribute('aria-label', labels[index] || 'Social link');
            }
        });
    }

    function setupFocusManagement() {
        // Ensure proper focus order
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', handleFocus);
            element.addEventListener('blur', handleBlur);
        });
    }

    function handleFocus(event) {
        event.target.style.outline = '2px solid #007acc';
        event.target.style.outlineOffset = '2px';
    }

    function handleBlur(event) {
        event.target.style.outline = '';
        event.target.style.outlineOffset = '';
    }

    // Utility Functions
    function generateId() {
        return 'section-' + Math.random().toString(36).substr(2, 9);
    }


    // Performance monitoring
    function logPerformanceMetrics() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        }
    }

    // Error handling
    window.addEventListener('error', function(event) {
        console.error('Portfolio error:', event.error);
    });

    // Handle URL hash changes
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash && ['about', 'research', 'projects', 'misc'].includes(hash)) {
            setActiveNav(hash);
            showSection(hash);
        }
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Handle initial hash on page load
    window.addEventListener('load', function() {
        handleHashChange();
        logPerformanceMetrics();
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Global function for blockchain section navigation
    window.showBlockchainSection = function() {
        setActiveNav('blockchain');
        showSection('blockchain');
        scrollToTop();
    };

    // Expose functions for debugging (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.portfolioDebug = {
            showSection,
            setActiveNav,
            loadDynamicSection,
            clearSectionCache,
            sectionCache,
            logPerformanceMetrics
        };
    }

})();