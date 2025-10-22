// Portfolio JavaScript - Vanilla JS for navigation and interactions

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
        
        console.log('Portfolio initialized successfully');
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
    
    // Content data for sections (fallback for local file access)
    const sectionContent = {
        research: `<section class="content-section" id="research">
            <h2>Research</h2>
            <div class="research-content">
                <p>
                    My research focuses on the intersection of physical and digital interaction, particularly in creative workflows with AI tools. I explore how we can design more intuitive, controllable, and composable interaction patterns for human-AI collaboration.
                </p>
                
                <h3>Current Research Areas</h3>
                <div class="research-areas">
                    <div class="research-area">
                        <h4>Atomic Interaction Patterns</h4>
                        <p>Developing small, composable interaction units that can be quickly combined to create complex creative workflows with AI systems.</p>
                    </div>
                    
                    <div class="research-area">
                        <h4>Physical-Digital Interfaces</h4>
                        <p>Exploring tangible interfaces that bridge the gap between physical manipulation and digital creation in creative tools.</p>
                    </div>
                    
                    <div class="research-area">
                        <h4>Controllable AI Systems</h4>
                        <p>Designing interaction paradigms that give users fine-grained control over AI behavior in creative contexts.</p>
                    </div>
                </div>
                
                <h3>Publications</h3>
                <div class="publications-list">
                    <div class="publication-item">
                        <div class="publication-year">2024</div>
                        <div class="publication-content">
                            <div class="publication-image">
                                <img src="/images/pub1.jpg" alt="Publication 1 thumbnail" />
                            </div>
                            <h4>Investigating Work Companion Robot Interactions to Enhance Work-from-Home Productivity and Experience</h4>
                            <p class="authors">
                                <span class="author-highlight">Heeji Kim</span>, Bokyung Lee
                            </p>
                            <p class="venue">
                                Archives of Design Research (AoDR Vol. 37, No. 4)
                            </p>
                            <p class="abstract">
                                This study provides insights into how a tabletop robot companion influences the productivity of 
                                knowledge workers in WFH settings. By evaluating Roby in real-world contexts, we identify key factors 
                                that we hope can inform the design of future intelligent robot companions to optimize remote work 
                                experiences across various professional domains.
                            </p>
                            <div class="publication-links">
                                <a href="https://aodr.org/xml/41676/41676.pdf" target="_blank" rel="noreferrer">PDF</a>
                                <span class="link-separator">·</span>
                                <a href="https://doi.org/10.15187/adr.2024.08.37.4.43" target="_blank" rel="noreferrer">DOI</a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <h3>Ongoing Projects</h3>
                <div class="project-list">
                    <div class="project-item">
                        <h4>Make Lab Research</h4>
                        <p>Currently working on tangible interfaces for AI-assisted creative tools at KAIST Make Lab under Prof. Andrea Bianchi.</p>
                    </div>
                </div>
            </div>
        </section>`,
        
        projects: `<section class="content-section" id="projects">
            <h2>Projects</h2>
            <div class="projects-content">
                <p>
                    Selected projects from my work at KAIST Make Lab and previous experiences across AdTech, Blockchain, and F&B sectors.
                </p>
                
                <div class="project-grid">
                    <div class="project-card">
                        <div class="project-header">
                            <h3>AI Creative Tool Interface</h3>
                            <span class="project-status">Ongoing • 2024</span>
                        </div>
                        <p class="project-description">
                            Developing atomic interaction patterns for human-AI collaboration in creative workflows. Focus on making AI tools more controllable and composable.
                        </p>
                        <div class="project-tags">
                            <span class="tag">HCI</span>
                            <span class="tag">AI</span>
                            <span class="tag">Interaction Design</span>
                        </div>
                    </div>
                    
                    <div class="project-card">
                        <div class="project-header">
                            <h3>NOT BASIC</h3>
                            <span class="project-status">Co-founder • 2022-2023</span>
                        </div>
                        <p class="project-description">
                            Co-founded a F&B startup focused on innovative food experiences. Led product design and user experience strategy.
                        </p>
                        <div class="project-tags">
                            <span class="tag">Entrepreneurship</span>
                            <span class="tag">Product Design</span>
                            <span class="tag">F&B</span>
                        </div>
                    </div>
                    
                    <div class="project-card">
                        <div class="project-header">
                            <h3>Kakao Corp Blockchain</h3>
                            <span class="project-status">Intern • 2022</span>
                        </div>
                        <p class="project-description">
                            Worked on blockchain infrastructure and user experience design for Kakao's blockchain initiatives.
                        </p>
                        <div class="project-tags">
                            <span class="tag">Blockchain</span>
                            <span class="tag">UX Design</span>
                            <span class="tag">Infrastructure</span>
                        </div>
                    </div>
                    
                    <div class="project-card">
                        <div class="project-header">
                            <h3>Moloco AdTech</h3>
                            <span class="project-status">Intern • 2021</span>
                        </div>
                        <p class="project-description">
                            Contributed to advertising technology solutions, focusing on user experience and data visualization.
                        </p>
                        <div class="project-tags">
                            <span class="tag">AdTech</span>
                            <span class="tag">Data Visualization</span>
                            <span class="tag">UX</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>`,
        
        misc: `<section class="content-section" id="misc">
            <h2>Misc</h2>
            <div class="misc-content">
                <p>
                    Beyond research and work, here are some other aspects of my life and interests that shape my perspective on design and technology.
                </p>
                
                <h3>Background</h3>
                <div class="background-info">
                    <p>
                        Born in Korea, I've been shaped by experiences across 🇰🇷🇨🇳🇨🇦🇬🇧, giving me a multicultural perspective on design and human-computer interaction. Currently based in Daejeon, South Korea, working at KAIST.
                    </p>
                </div>
                
                <h3>Interests</h3>
                <div class="interests-grid">
                    <div class="interest-item">
                        <h4>Cross-cultural Design</h4>
                        <p>How cultural contexts influence interaction design and technology adoption.</p>
                    </div>
                    
                    <div class="interest-item">
                        <h4>Creative Technology</h4>
                        <p>Exploring the intersection of art, design, and emerging technologies.</p>
                    </div>
                    
                    <div class="interest-item">
                        <h4>Entrepreneurship</h4>
                        <p>Building meaningful products and experiences that solve real problems.</p>
                    </div>
                    
                    <div class="interest-item">
                        <h4>Food Culture</h4>
                        <p>Understanding how food brings people together and creates shared experiences.</p>
                    </div>
                </div>
                
                <h3>Travel & Conferences</h3>
                <div class="travel-timeline">
                    <div class="travel-item">
                        <span class="travel-date">Oct-Nov 2025</span>
                        <span class="travel-description">🇸🇪 Visiting KTH Interaction Design Team, Stockholm</span>
                    </div>
                    
                    <div class="travel-item">
                        <span class="travel-date">Sep 2025</span>
                        <span class="travel-description">🇰🇷 UIST2025, Busan</span>
                    </div>
                    
                    <div class="travel-item">
                        <span class="travel-date">Sep 2025</span>
                        <span class="travel-description">🇯🇵 CHI2025, Yokohama</span>
                    </div>
                    
                    <div class="travel-item">
                        <span class="travel-date">Oct 2024</span>
                        <span class="travel-description">🇺🇸 UIST2024, Pittsburgh</span>
                    </div>
                </div>
                
                <h3>Fun Facts</h3>
                <ul class="fun-facts">
                    <li>You can call me Jolie! It's easier to pronounce than Heeji 😊</li>
                    <li>I've lived in four different countries, each shaping my design perspective</li>
                    <li>I co-founded a food startup because I believe food is the ultimate user experience</li>
                    <li>I'm passionate about making AI tools feel more human and controllable</li>
                </ul>
            </div>
        </section>`
    };

    // Load section content from external file or fallback to inline content
    async function loadDynamicSection(sectionId) {
        // Check cache first
        if (sectionCache.has(sectionId)) {
            dynamicSectionContainer.innerHTML = sectionCache.get(sectionId);
            return;
        }
        
        try {
            // Show loading state
            dynamicSectionContainer.innerHTML = '<div class="loading">Loading...</div>';
            
            // Try to fetch from external file first
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
            
        } catch (error) {
            console.warn(`Failed to load external file for ${sectionId}, using fallback content:`, error);
            
            // Fallback to inline content
            if (sectionContent[sectionId]) {
                const content = sectionContent[sectionId];
                
                // Cache the content
                sectionCache.set(sectionId, content);
                
                // Display the content
                dynamicSectionContainer.innerHTML = content;
                
                // Re-run accessibility setup for new content
                setupAccessibilityForNewContent();
            } else {
                dynamicSectionContainer.innerHTML = `
                    <div class="error-message">
                        <h2>Oops!</h2>
                        <p>Unable to load the ${sectionId} section. Content not found.</p>
                    </div>
                `;
            }
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

    // Expose functions for debugging (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.portfolioDebug = {
            showSection,
            setActiveNav,
            loadDynamicSection,
            sectionCache,
            logPerformanceMetrics
        };
    }

})();