(function() {
    'use strict';

    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const heroSection = document.querySelector('.hero-section');
    const mainContent = document.querySelector('.main-content');
    
    // Cache for loaded sections
    const sectionCache = new Map();
    const sectionVersion = 'terminal-2026-13';
    let dynamicSectionContainer = null;

    // Initialize the application
    function init() {
        createDynamicSectionContainer();
        setupNavigation();
        setupSmoothScrolling();
        setupAccessibility();
        setupCacheBusting();
        setupToggleFunctionality();
        setupAcknowledgePanel();
        setupAboutToggle();
        handleHashChange();

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
        
        const link = event.target.closest('a');
        const targetId = link.getAttribute('href').substring(1);
        
        // Update active nav link
        setActiveNav(targetId);
        
        // Show/hide sections
        showSection(targetId);
        history.replaceState(null, '', `#${targetId}`);
        
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
            document.body.classList.remove('section-open');
            heroSection.style.display = 'block';
            dynamicSectionContainer.style.display = 'none';
        } else {
            document.body.classList.add('section-open');
            heroSection.style.display = 'none';
            
            // Load and show the dynamic section
            await loadDynamicSection(targetId);
            dynamicSectionContainer.style.display = 'block';
            initTerminalSection();
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
            const response = await fetch(`sections/${sectionId}.html?v=${sectionVersion}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const content = await response.text();
            
            // Cache the content
            sectionCache.set(sectionId, content);
            
            // Display the content
            dynamicSectionContainer.innerHTML = content;
            dynamicSectionContainer.dataset.section = sectionId;
            
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

    // ========================================================
    // Terminal section: boot log, typewriter, clock, mini-shell
    // ========================================================
    let termTimers = [];
    let termClock = null;
    const prefersReducedMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function clearTermTimers() {
        termTimers.forEach(clearTimeout);
        termTimers = [];
        if (termClock) {
            clearInterval(termClock);
            termClock = null;
        }
    }

    function laterTerm(fn, delay) {
        termTimers.push(setTimeout(fn, delay));
    }

    function initTerminalSection() {
        clearTermTimers();
        const term = dynamicSectionContainer.querySelector('.term');
        if (!term) {
            return;
        }
        startTermClock(term);
        runBootSequence(term);
        setupShell(term);
        setupToggleFunctionality();
        // Safety net: never leave the body hidden if the type chain is interrupted
        laterTerm(() => term.classList.add('is-ready'), 6000);
    }

    function startTermClock(term) {
        const el = term.querySelector('[data-clock]');
        if (!el) {
            return;
        }
        const tick = () => {
            const now = new Date();
            const pad = (n) => String(n).padStart(2, '0');
            el.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        };
        tick();
        termClock = setInterval(tick, 1000);
    }

    function runBootSequence(term) {
        const bootOut = term.querySelector('[data-boot-out]');
        const typedEl = term.querySelector('[data-typed]');
        const cursor = term.querySelector('.cmd-cursor');
        const cmd = term.getAttribute('data-cmd') || '';
        const bootLines = (term.getAttribute('data-boot') || '')
            .split('|').map(s => s.trim()).filter(Boolean);

        const reveal = () => {
            term.classList.add('is-ready');
            if (cursor) {
                cursor.classList.add('done');
            }
        };

        if (prefersReducedMotion) {
            if (bootOut) {
                bootOut.innerHTML = bootLines
                    .map(l => `<p class="boot-line" style="opacity:1">[ <span class="ok">ok</span> ] ${l}</p>`)
                    .join('');
            }
            if (typedEl) {
                typedEl.textContent = cmd;
            }
            reveal();
            return;
        }

        // Print boot lines with a quick stagger
        let delay = 0;
        const step = 130;
        bootLines.forEach((line, i) => {
            laterTerm(() => {
                if (!bootOut) {
                    return;
                }
                const p = document.createElement('p');
                p.className = 'boot-line';
                p.innerHTML = `[ <span class="ok">ok</span> ] ${line}`;
                bootOut.appendChild(p);
            }, delay);
            delay += step;
        });

        // Type the command, char by char
        laterTerm(() => typeCommand(typedEl, cmd, reveal), delay + 180);
    }

    function typeCommand(typedEl, cmd, done) {
        if (!typedEl) {
            done();
            return;
        }
        let i = 0;
        const tick = () => {
            typedEl.textContent = cmd.slice(0, i);
            i += 1;
            if (i <= cmd.length) {
                laterTerm(tick, 42 + Math.random() * 45);
            } else {
                laterTerm(done, 260);
            }
        };
        tick();
    }

    // --- interactive mini-shell ---------------------------------
    const SHELL_ROUTES = {
        about: 'about', index: 'about', home: 'about', '~': 'about', '..': 'about',
        research: 'research', dossier: 'research',
        projects: 'projects', workspace: 'projects', builds: 'projects',
        misc: 'misc', lab: 'misc', notes: 'misc', lab_notes: 'misc',
        blockchain: 'blockchain', archive: 'blockchain'
    };

    function setupShell(term) {
        const form = term.querySelector('[data-shell]');
        const input = term.querySelector('[data-shell-input]');
        const log = term.querySelector('[data-shell-log]');
        if (!form || !input || !log) {
            return;
        }

        const print = (html, cls) => {
            const p = document.createElement('p');
            if (cls) {
                p.className = cls;
            }
            p.innerHTML = html;
            log.appendChild(p);
        };

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const raw = input.value.trim();
            input.value = '';
            if (!raw) {
                return;
            }
            const promptPath = term.getAttribute('data-prompt') || '~';
            print(`<span class="echo">visitor@heeji:${promptPath}$ <b>${escapeHtml(raw)}</b></span>`);
            runShellCommand(raw, { print, log, term });
            log.scrollTop = log.scrollHeight;
        });
    }

    function runShellCommand(raw, ctx) {
        const { print, log } = ctx;
        const parts = raw.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const arg = (parts[1] || '').toLowerCase().replace(/^\.?\/?/, '').replace(/\/$/, '');

        switch (cmd) {
            case 'help': {
                print('available commands:', 'ok');
                const row = (c, d) => print(`<span class="accent">${c}</span><span class="hint">${d}</span>`, 'help-row');
                row('ls', 'list all sections');
                row('cd &lt;dir&gt;', 'open a section: research, projects, misc, about');
                row('whoami', 'who is this');
                row('contact', 'email + social links');
                row('pwd · date · clear', '');
                break;
            }
            case 'ls':
            case 'dir':
                print('about/&nbsp;&nbsp;&nbsp;research/&nbsp;&nbsp;&nbsp;projects/&nbsp;&nbsp;&nbsp;misc/&nbsp;&nbsp;&nbsp;<span class="accent">blockchain/</span>');
                break;
            case 'cd':
            case 'open':
            case 'goto': {
                const target = SHELL_ROUTES[arg];
                if (target) {
                    print(`cd ~/${arg} ... <span class="ok">opening</span>`);
                    laterTerm(() => navigateTo(target), 320);
                } else if (!arg || arg === '~') {
                    print('cd ~ ... <span class="ok">home</span>');
                    laterTerm(() => navigateTo('about'), 320);
                } else {
                    print(`cd: no such directory: ${escapeHtml(arg)}`, 'err');
                }
                break;
            }
            case 'whoami':
                print('heeji jolie kim — HCI researcher @ KAIST Make Lab.', 'ok');
                print('building granular, controllable, composable human-AI interactions.');
                break;
            case 'pwd':
                print((ctx.term.getAttribute('data-prompt') || '~').replace('~', '/home/heeji'));
                break;
            case 'date':
                print(new Date().toString());
                break;
            case 'contact':
            case 'email':
                print('email &nbsp;&nbsp;<a href="mailto:jolieheejikim@kaist.ac.kr">jolieheejikim@kaist.ac.kr</a>');
                print('github &nbsp;<a href="https://github.com/joliekim" target="_blank" rel="noreferrer">github.com/joliekim</a>');
                print('linkedin <a href="https://linkedin.com/in/jolieheejikim" target="_blank" rel="noreferrer">in/jolieheejikim</a>');
                break;
            case 'echo':
                print(escapeHtml(raw.slice(5)) || '&nbsp;');
                break;
            case 'clear':
            case 'cls':
                log.innerHTML = '';
                break;
            case 'sudo':
                print('visitor is not in the sudoers file. this incident will be reported. ;)', 'err');
                break;
            case 'rm':
                print('rm: permission denied — nice try.', 'err');
                break;
            case 'coffee':
            case 'matcha':
                print('☕ brewing... system dependency satisfied.', 'ok');
                break;
            case 'cat':
                print(arg ? `cat: ${escapeHtml(arg)}: try opening the section instead — 'cd ${arg || 'research'}'` : 'cat: missing file operand', 'err');
                break;
            default:
                print(`command not found: ${escapeHtml(cmd)} — type <span class="accent">help</span>`, 'err');
        }
    }

    function navigateTo(targetId) {
        setActiveNav(targetId);
        showSection(targetId);
        history.replaceState(null, '', `#${targetId}`);
        scrollToTop();
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    // Expand/collapse the bio "about me" details on the home window
    function setupAboutToggle() {
        const btn = document.getElementById('about-toggle');
        const extra = document.getElementById('bio-extra');
        if (!btn || !extra) {
            return;
        }
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            const open = extra.classList.toggle('open');
            btn.setAttribute('aria-expanded', String(open));
            btn.textContent = open ? 'ABOUT_ME −' : 'ABOUT_ME +';
        });
    }

    function setupAcknowledgePanel() {
        const acknowledgeButton = document.getElementById('acknowledge-button');
        const acknowledgePanel = document.querySelector('.ack-panel');

        if (!acknowledgeButton || !acknowledgePanel) {
            return;
        }

        acknowledgeButton.addEventListener('click', function() {
            acknowledgePanel.classList.add('is-hidden');
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
        if (hash && ['about', 'research', 'projects', 'misc', 'blockchain'].includes(hash)) {
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
        history.replaceState(null, '', '#blockchain');
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
