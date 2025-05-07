// Main JavaScript File

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the splash screen transition
    initSplashScreen();
    
    // Initialize all other functions when content is ready
    document.body.classList.add('js-loaded');
});

/**
 * Initialize and handle the splash screen animation and transition
 */
function initSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const progressBar = document.getElementById('loader-progress');
    const mainContent = document.querySelector('.main-content');
    
    // Force full visibility at start
    splashScreen.style.opacity = '1';
    splashScreen.style.visibility = 'visible';
    
    // Track loading progress
    let loadingProgress = 0;
    const totalResources = getResourceCount();
    let loadedResources = 0;
    
    // Start with minimum progress for better UX
    updateProgress(5);
    
    // Enforce minimum display time
    const minDisplayTime = 4500; // Minimum display time for splash screen
    const startTime = Date.now();
    
    // Function to update the progress bar
    function updateProgress(value) {
        loadingProgress = value;
        progressBar.style.width = `${loadingProgress}%`;
        
        // Add pulse effect when progress changes
        progressBar.classList.add('progress-pulse');
        setTimeout(() => {
            progressBar.classList.remove('progress-pulse');
        }, 300);
    }
    
    // Listen for all resources to load
    window.addEventListener('load', () => {
        // Don't complete immediately, continue the slower progress simulation
        const elapsedTime = Date.now() - startTime;
        
        // If we haven't shown the splash screen for minimum time,
        // delay the completion
        if (elapsedTime < minDisplayTime) {
            setTimeout(() => {
                completeLoading();
            }, minDisplayTime - elapsedTime);
        } else {
            completeLoading();
        }
    });
    
    // Function to complete the loading process
    function completeLoading() {
        // Final progress when everything is loaded
        updateProgress(100);
        
        // Wait a moment to show the 100% progress
        setTimeout(() => {
            // Add the class that triggers the transition out animation
            splashScreen.classList.add('fade-out');
            
            // After the animation completes, hide the splash screen
            setTimeout(() => {
                splashScreen.style.display = 'none';
                
                // Show and trigger animations for the main content
                mainContent.style.display = 'block';
                document.body.classList.add('content-loaded');
                
                // Initialize all components
                initAllComponents();
            }, 1200); // Extended fade-out transition time
        }, 1000); // Extended time to show 100% progress
    }
    
    // Simulate progress for better UX (in case some resources are cached)
    // Slower simulation for better visual effect
    const progressInterval = setInterval(() => {
        if (loadingProgress < 70) {
            // Slow down the progress increment
            updateProgress(loadingProgress + 0.5);
        } else {
            clearInterval(progressInterval);
        }
    }, 50); // Slower interval (50ms instead of 30ms)
    
    // Count resource loads
    document.addEventListener('resourceLoaded', () => {
        loadedResources++;
        const actualProgress = Math.min(Math.floor((loadedResources / totalResources) * 100), 95); // Cap at 95%
        if (actualProgress > loadingProgress) {
            updateProgress(actualProgress);
        }
    });
    
    // Track image loads
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) {
            loadedResources++;
        } else {
            img.addEventListener('load', () => {
                loadedResources++;
                const actualProgress = Math.min(Math.floor((loadedResources / totalResources) * 100), 95);
                if (actualProgress > loadingProgress) {
                    updateProgress(actualProgress);
                }
            });
        }
    });
}

/**
 * Get the approximate count of resources to be loaded
 * @returns {number} Total count of resources
 */
function getResourceCount() {
    // Count all the typical resources that might be loaded
    const styleSheets = document.styleSheets.length;
    const scripts = document.scripts.length;
    const images = document.images.length;
    
    // Add a buffer for any dynamically loaded resources
    return styleSheets + scripts + images + 5;
}

/**
 * Initialize the navbar functionality
 */
function initNavbar() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        header.classList.toggle('menu-open');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking nav links on mobile
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Smooth scroll to section
            const target = link.getAttribute('href');
            if (target.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(target);
                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const offsetTop = targetSection.offsetTop - headerHeight;
                    
                    // Smooth scroll
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close menu on mobile
                    if (window.innerWidth <= 768) {
                        navToggle.classList.remove('active');
                        navMenu.classList.remove('active');
                        header.classList.remove('menu-open');
                        document.body.classList.remove('menu-open');
                    }
                }
            }
        });
    });
    
    // Scroll event to handle header style changes and active section highlighting
    window.addEventListener('scroll', () => {
        // Add scrolled class to header when scrolled
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Highlight active section in navbar (scroll spy)
        highlightActiveSection(sections, navLinks);
    });
    
    // Initial check for active section
    highlightActiveSection(sections, navLinks);
}

/**
 * Highlight the active section in the navbar
 * @param {NodeList} sections - All sections with IDs
 * @param {NodeList} navLinks - All navigation links
 */
function highlightActiveSection(sections, navLinks) {
    const scrollPosition = window.scrollY + 200; // Offset for better UX
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to corresponding link
            document.querySelector(`.nav-link[data-section="${sectionId}"]`).classList.add('active');
        }
    });
}

/**
 * Initialize all interactive elements throughout the site
 */
function initInteractiveElements() {
    // Initialize navbar with all its functionality
    initNavbar();
    
    // Add hover effects for neon elements
    const neonElements = document.querySelectorAll('.neon-element');
    
    neonElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.classList.add('neon-hover');
            
            // Add audio feedback for hover (if enabled)
            if (element.hasAttribute('data-sound')) {
                playInteractionSound('hover');
            }
        });
        
        element.addEventListener('mouseleave', () => {
            element.classList.remove('neon-hover');
        });
        
        element.addEventListener('click', () => {
            // Add click animation
            element.classList.add('neon-click');
            
            // Add audio feedback for click (if enabled)
            if (element.hasAttribute('data-sound')) {
                playInteractionSound('click');
            }
            
            setTimeout(() => {
                element.classList.remove('neon-click');
            }, 300);
        });
    });
    
    // Initialize custom cursor if applicable
    initCustomCursor();
    
    // Initialize hero-specific animations
    initHeroAnimations();
    
    // Initialize team section interactions
    initTeamSection();
    
    // Initialize testimonials carousel
    initTestimonialsCarousel();
}

/**
 * Initialize custom cursor effects for modern feel
 */
function initCustomCursor() {
    // Only initialize on desktop
    if (window.innerWidth <= 768) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    
    const cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    
    cursor.appendChild(cursorDot);
    cursor.appendChild(cursorRing);
    document.body.appendChild(cursor);
    
    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        gsapCursorMove(e.clientX, e.clientY);
    });
    
    // Hide cursor when leaving the window
    document.addEventListener('mouseout', () => {
        cursor.classList.add('hidden');
    });
    
    document.addEventListener('mouseover', () => {
        cursor.classList.remove('hidden');
    });
    
    // Add hover effect for clickable elements
    document.querySelectorAll('a, button, .clickable').forEach(item => {
        item.addEventListener('mouseover', () => {
            cursor.classList.add('cursor-hover');
        });
        
        item.addEventListener('mouseout', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
    
    // Use regular JS for fallback if gsap isn't available
    function gsapCursorMove(x, y) {
        if (typeof gsap === 'undefined') {
            cursor.style.transform = `translate(${x}px, ${y}px)`;
            return;
        }
        
        // Use GSAP for smoother animation if available
        gsap.to(cursorDot, {
            x: x,
            y: y,
            duration: 0.1,
            ease: "power2.out"
        });
        
        gsap.to(cursorRing, {
            x: x,
            y: y,
            duration: 0.5,
            ease: "power4.out"
        });
    }
}

/**
 * Play interaction sound effects
 * @param {string} type - Type of interaction sound ('hover', 'click')
 */
function playInteractionSound(type) {
    // Only if audio is enabled (check localStorage or default)
    const audioEnabled = localStorage.getItem('audioEnabled') !== 'false';
    if (!audioEnabled) return;
    
    // Create audio based on interaction type
    const audio = new Audio();
    
    switch(type) {
        case 'hover':
            audio.src = 'assets/audio/hover.mp3';
            audio.volume = 0.2;
            break;
        case 'click':
            audio.src = 'assets/audio/click.mp3';
            audio.volume = 0.3;
            break;
        default:
            return;
    }
    
    audio.play().catch(() => {
        // Ignore errors (browsers may block autoplay)
    });
}

/**
 * Initialize scroll-based animations and effects
 */
function initScrollEffects() {
    // Elements to animate when scrolled into view
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const videoPlayBtn = document.getElementById('video-play-btn');
    const videoModal = document.getElementById('video-modal');
    const videoFrame = document.getElementById('video-frame');
    const closeModal = document.getElementById('close-modal');
    const scrollIndicator = document.getElementById('scroll-indicator');
    
    // Set up Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Add a delay based on the data-delay attribute
            const delay = entry.target.getAttribute('data-delay') || 0;
            
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                    
                    // If this is a pricing section card, animate counters
                    if (entry.target.classList.contains('pricing-card') && 
                        entry.target.closest('.pricing-section')) {
                        // Only trigger counter animation if the first card is visible
                        if (document.querySelector('.pricing-card.in-view') === entry.target) {
                            setTimeout(() => {
                                animatePriceCounters();
                            }, 500);
                        }
                    }
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    
    // Observe all animated elements
    animatedElements.forEach(item => {
        observer.observe(item);
    });
    
    // Hide scroll indicator when user scrolls down
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100 && scrollIndicator) {
            scrollIndicator.style.opacity = "0";
        }
    });
    
    // Video modal functionality
    if (videoPlayBtn && videoModal && closeModal) {
        videoPlayBtn.addEventListener('click', () => {
            videoFrame.src = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"; // Replace with your actual video URL
            videoModal.style.display = "flex";
            videoModal.classList.add('active');
            document.body.style.overflow = "hidden"; // Prevent scrolling
        });
        
        closeModal.addEventListener('click', closeVideoModal);
        
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
        
        function closeVideoModal() {
            videoModal.classList.remove('active');
            setTimeout(() => {
                videoModal.style.display = "none";
                videoFrame.src = ""; // Stop the video
                document.body.style.overflow = ""; // Re-enable scrolling
            }, 300);
        }
    }
    
    // Add mouseover effects for pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseover', function() {
            pricingCards.forEach(c => {
                if (c !== card) {
                    c.style.opacity = '0.7';
                    c.style.transform = c.classList.contains('featured') ? 
                        'scale(1.05) translateY(0)' : 'translateY(0)';
                }
            });
        });
        
        card.addEventListener('mouseout', function() {
            pricingCards.forEach(c => {
                c.style.opacity = '1';
                c.style.transform = c.classList.contains('featured') ? 
                    'scale(1.05)' : 'translateY(0)';
            });
        });
    });
}

/**
 * Handle responsive behavior
 */
function handleResponsiveness() {
    // Monitor window resize
    window.addEventListener('resize', debounce(() => {
        // Update any necessary responsive elements
        updateResponsiveElements();
    }, 250));
    
    // Initialize on load
    updateResponsiveElements();
}

/**
 * Update elements based on screen size
 */
function updateResponsiveElements() {
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('is-mobile', isMobile);
    
    // Disable certain animations on mobile for performance
    if (isMobile) {
        document.querySelectorAll('.disable-on-mobile').forEach(element => {
            element.style.animationName = 'none';
            element.style.transition = 'none';
        });
    }
}

/**
 * Debounce function to limit rapid firing of events
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
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

// Add dynamic styles
document.head.insertAdjacentHTML('beforeend', `
<style>
    .splash-screen.fade-out {
        opacity: 0;
        transform: scale(1.1);
        visibility: hidden;
        transition: opacity 1s cubic-bezier(0.19, 1, 0.22, 1), transform 1s cubic-bezier(0.19, 1, 0.22, 1), visibility 0s 1s;
        pointer-events: none;
    }
    
    .content-loaded .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1), transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
    }
    
    .content-loaded .animate-on-scroll.in-view {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Advanced animation variations */
    .content-loaded .animate-fade-left {
        transform: translateX(-30px);
    }
    
    .content-loaded .animate-fade-right {
        transform: translateX(30px);
    }
    
    .content-loaded .animate-fade-up {
        transform: translateY(30px);
    }
    
    .content-loaded .animate-fade-down {
        transform: translateY(-30px);
    }
    
    .content-loaded .animate-zoom-in {
        transform: scale(0.9);
    }
    
    .content-loaded .animate-zoom-out {
        transform: scale(1.1);
    }
    
    .content-loaded .animate-on-scroll.animate-fade-left.in-view,
    .content-loaded .animate-on-scroll.animate-fade-right.in-view,
    .content-loaded .animate-on-scroll.animate-fade-up.in-view,
    .content-loaded .animate-on-scroll.animate-fade-down.in-view,
    .content-loaded .animate-on-scroll.animate-zoom-in.in-view,
    .content-loaded .animate-on-scroll.animate-zoom-out.in-view {
        opacity: 1;
        transform: translate(0) scale(1);
    }
    
    .neon-element {
        transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
    }
    
    .neon-element.neon-hover {
        filter: brightness(1.2);
        text-shadow: 0 0 10px var(--primary-glow), 0 0 20px var(--primary-glow);
        transform: scale(1.05);
    }
    
    .neon-element.neon-click {
        transform: scale(0.95);
        filter: brightness(1.4);
    }
    
    .progress-bar.progress-pulse {
        animation: progressPulse 0.3s ease;
    }
    
    @keyframes progressPulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
    
    /* Custom cursor styles */
    .custom-cursor {
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 9999;
    }
    
    .cursor-dot {
        position: absolute;
        top: -4px;
        left: -4px;
        width: 8px;
        height: 8px;
        background-color: var(--primary);
        border-radius: 50%;
        box-shadow: 0 0 10px var(--primary-glow);
    }
    
    .cursor-ring {
        position: absolute;
        top: -20px;
        left: -20px;
        width: 40px;
        height: 40px;
        border: 1px solid var(--primary);
        border-radius: 50%;
        opacity: 0.5;
        transition: all 0.1s ease;
    }
    
    .custom-cursor.hidden {
        opacity: 0;
    }
    
    .custom-cursor.cursor-hover .cursor-ring {
        transform: scale(1.5);
        opacity: 0.3;
        background-color: rgba(0, 246, 255, 0.1);
    }
</style>
`);

/**
 * Animate price counters from 0 to their target values
 */
function animatePriceCounters() {
    const priceElements = document.querySelectorAll('.price-value');
    
    priceElements.forEach(element => {
        const targetValue = parseInt(element.getAttribute('data-value'));
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const startValue = 0;
        
        function updateValue(currentTime) {
            const elapsedTime = currentTime - startTime;
            
            if (elapsedTime < duration) {
                const progress = elapsedTime / duration;
                // Easing function for a smoother animation
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.floor(startValue + (targetValue - startValue) * easedProgress);
                
                element.textContent = currentValue;
                requestAnimationFrame(updateValue);
            } else {
                element.textContent = targetValue;
            }
        }
        
        requestAnimationFrame(updateValue);
    });
}

// Handle pricing plan selection
document.addEventListener('click', function(e) {
    if (e.target.closest('.pricing-cta .btn')) {
        const btn = e.target.closest('.pricing-cta .btn');
        const card = btn.closest('.pricing-card');
        const planName = card.querySelector('.plan-name').textContent;
        
        // You can add custom logic here - for example, storing the selected plan
        console.log(`Selected plan: ${planName}`);
        
        // Smooth scroll to contact section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const offsetTop = contactSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Optionally add a URL parameter or session storage to remember the plan
            sessionStorage.setItem('selectedPlan', planName);
        }
    }
});

/**
 * Initialize hero section specific animations including typing effect
 */
function initHeroAnimations() {
    // Replace typing effect with static text and neon effect
    const typingText = document.querySelector('.typing-text');
    const cursor = document.querySelector('.cursor');
    
    if (typingText && cursor) {
        // Set a static text instead of typing animation
        typingText.textContent = 'Truck Dispatching Partner';
        
        // Hide the cursor since we're not typing anymore
        if (cursor) {
            cursor.style.display = 'none';
        }
        
        // Add neon effect class
        typingText.classList.add('neon-text');
    }
    
    // Create parallax scroll effect
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Only apply effects if we're at the top of the page
        if (scrollY < window.innerHeight) {
            // Parallax for hero background elements
            const particles = document.querySelectorAll('.particle');
            particles.forEach(particle => {
                const speed = Math.random() * 0.2;
                particle.style.transform = `translateY(${scrollY * speed}px)`;
            });
            
            // Hero title parallax
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) {
                heroTitle.style.transform = `translateY(${scrollY * 0.1}px)`;
            }
            
            // Hero image parallax (opposite direction)
            const heroImage = document.querySelector('.hero-image');
            if (heroImage) {
                heroImage.style.transform = `translateY(${scrollY * -0.1}px)`;
            }
        }
    });
    
    // Add scroll indicator click functionality
    const scrollIndicator = document.querySelector('#scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            // Scroll to about section
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = aboutSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

/**
 * Initialize team section interactions
 */
function initTeamSection() {
    const teamCards = document.querySelectorAll('.team-card');
    const teamCardWrappers = document.querySelectorAll('.team-card-wrapper');
    
    // Initialize card flip on click
    teamCards.forEach(card => {
        card.addEventListener('click', function() {
            this.querySelector('.team-card-inner').style.transform = 
                this.querySelector('.team-card-inner').style.transform === 'rotateY(180deg)' 
                    ? 'rotateY(0deg)' 
                    : 'rotateY(180deg)';
        });
    });
    
    // Handle staggered animations on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const teamObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered animation
                if (entry.target.classList.contains('team-section')) {
                    // Animate grid lines
                    const gridLines = entry.target.querySelectorAll('.grid-line');
                    gridLines.forEach((line, index) => {
                        setTimeout(() => {
                            line.style.opacity = '1';
                            if (line.classList.contains('horizontal')) {
                                line.style.transform = 'scaleX(1)';
                            } else {
                                line.style.transform = 'scaleY(1)';
                            }
                        }, 100 * index);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe team section
    const teamSection = document.querySelector('.team-section');
    if (teamSection) {
        teamObserver.observe(teamSection);
        
        // Initially hide grid lines
        const gridLines = teamSection.querySelectorAll('.grid-line');
        gridLines.forEach(line => {
            line.style.opacity = '0';
            if (line.classList.contains('horizontal')) {
                line.style.transform = 'scaleX(0)';
            } else {
                line.style.transform = 'scaleY(0)';
            }
            line.style.transition = 'transform 1s ease, opacity 1s ease';
        });
    }
}

/**
 * Initialize testimonials carousel
 */
function initTestimonialsCarousel() {
    const carousel = document.querySelector('.testimonials-carousel');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    
    if (!carousel || !cards.length || !prevArrow || !nextArrow || !dots.length) return;
    
    let currentIndex = 0;
    let isAnimating = false;
    let autoplayInterval;
    const animationDuration = 500;
    
    // Set up the carousel with initial positions
    function setupCarousel() {
        // Initially hide all cards except the first one
        cards.forEach((card, index) => {
            if (index !== 0) {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'translateX(50px)';
            } else {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }
        });
        
        // Update dots
        updateDots(0);
        
        // Start autoplay
        startAutoplay();
    }
    
    // Go to a specific slide
    function goToSlide(index) {
        if (isAnimating) return;
        if (index < 0) index = cards.length - 1;
        if (index >= cards.length) index = 0;
        
        if (index === currentIndex) return;
        
        isAnimating = true;
        
        // Hide current card with animation
        cards[currentIndex].style.opacity = '0';
        cards[currentIndex].style.transform = 'translateX(-50px)';
        
        setTimeout(() => {
            cards[currentIndex].style.display = 'none';
            
            // Show new card with animation
            cards[index].style.display = 'block';
            
            setTimeout(() => {
                cards[index].style.opacity = '1';
                cards[index].style.transform = 'translateX(0)';
                
                currentIndex = index;
                updateDots(index);
                
                setTimeout(() => {
                    isAnimating = false;
                }, animationDuration);
            }, 50); // Small delay for the display change to take effect
        }, animationDuration);
    }
    
    // Update the active dot
    function updateDots(index) {
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Start autoplay
    function startAutoplay() {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000); // Change slide every 5 seconds
    }
    
    // Pause autoplay on interaction
    function pauseAutoplay() {
        clearInterval(autoplayInterval);
        
        // Restart after a delay
        setTimeout(() => {
            startAutoplay();
        }, 10000); // Wait 10 seconds before restarting autoplay
    }
    
    // Event listeners
    prevArrow.addEventListener('click', () => {
        pauseAutoplay();
        goToSlide(currentIndex - 1);
    });
    
    nextArrow.addEventListener('click', () => {
        pauseAutoplay();
        goToSlide(currentIndex + 1);
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            pauseAutoplay();
            goToSlide(index);
        });
    });
    
    // Pause autoplay when hovering over carousel
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        startAutoplay();
    });
    
    // Initialize the carousel
    setupCarousel();
}

/**
 * Initialize the contact form with validation and submission animation
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const closeSuccessBtn = document.querySelector('.close-success-btn');
    
    if (!contactForm) return;
    
    // Input field validation
    const inputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
    inputs.forEach(input => {
        // Check validity on blur
        input.addEventListener('blur', function() {
            validateInput(input);
        });
        
        // Clear validation message on focus
        input.addEventListener('focus', function() {
            const validationMessage = input.closest('.input-wrapper').querySelector('.validation-message');
            if (validationMessage) {
                validationMessage.textContent = '';
                validationMessage.classList.remove('error');
            }
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all required fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Create ripple effect on submit button
            createRippleEffect();
            
            // Show success message after a delay (simulating form processing)
            setTimeout(() => {
                // Reset form and remove has-value class
                contactForm.reset();
                const allInputWrappers = contactForm.querySelectorAll('.input-wrapper');
                allInputWrappers.forEach(wrapper => {
                    wrapper.classList.remove('has-value');
                });
                
                showSuccessMessage();
            }, 1500);
        }
    });
    
    // Close success message
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', function() {
            hideSuccessMessage();
        });
    }
    
    // Validation function
    function validateInput(input) {
        const validationMessage = input.closest('.input-wrapper').querySelector('.validation-message');
        
        if (!input.validity.valid) {
            if (input.validity.valueMissing) {
                validationMessage.textContent = 'This field is required';
            } else if (input.validity.typeMismatch && input.type === 'email') {
                validationMessage.textContent = 'Please enter a valid email address';
            } else {
                validationMessage.textContent = 'Please enter a valid value';
            }
            
            validationMessage.classList.add('error');
            return false;
        }
        
        // Valid input
        validationMessage.textContent = '';
        validationMessage.classList.remove('error');
        return true;
    }
    
    // Create ripple effect on submit button
    function createRippleEffect() {
        const button = contactForm.querySelector('.submit-btn');
        const ripple = button.querySelector('.ripple-effect');
        
        if (ripple) {
            ripple.innerHTML = '';
            const circle = document.createElement('span');
            circle.style.width = '0';
            circle.style.height = '0';
            circle.style.position = 'absolute';
            circle.style.borderRadius = '50%';
            circle.style.transform = 'translate(-50%, -50%)';
            circle.style.top = '50%';
            circle.style.left = '50%';
            circle.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            
            ripple.appendChild(circle);
            
            // Animate the ripple
            let size = Math.max(button.offsetWidth, button.offsetHeight) * 2;
            circle.style.width = size + 'px';
            circle.style.height = size + 'px';
            circle.style.opacity = '0';
            circle.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        }
    }
    
    // Show success message
    function showSuccessMessage() {
        if (successMessage) {
            successMessage.classList.add('show');
            setTimeout(() => {
                successMessage.querySelector('.success-content').style.opacity = '1';
                successMessage.querySelector('.success-content').style.transform = 'translateY(0)';
            }, 100);
        }
    }
    
    // Hide success message
    function hideSuccessMessage() {
        if (successMessage) {
            successMessage.querySelector('.success-content').style.opacity = '0';
            successMessage.querySelector('.success-content').style.transform = 'translateY(-30px)';
            
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 500);
        }
    }
    
    // Add input animation for floating labels
    const allInputs = contactForm.querySelectorAll('input, textarea, select');
    allInputs.forEach(input => {
        // Add placeholder attribute for detecting if input has value
        input.setAttribute('placeholder', ' ');
        
        // Check if input has value on load and set appropriate class
        if (input.value) {
            input.closest('.input-wrapper').classList.add('has-value');
        }
        
        // Update on input
        input.addEventListener('input', function() {
            const wrapper = input.closest('.input-wrapper');
            if (input.value) {
                wrapper.classList.add('has-value');
            } else {
                wrapper.classList.remove('has-value');
            }
        });
    });
}

// Function to initialize all components after splash screen
function initAllComponents() {
    initNavbar();
    
    // Initialize all animations with proper timing
    setTimeout(() => {
        initHeroAnimations(); // Delay hero animation start slightly for smoother transition
    }, 500);
    
    initScrollEffects();
    initInteractiveElements();
    initTeamSection();
    initTestimonialsCarousel();
    initContactForm();
    animatePriceCounters();
    handleResponsiveness();
    
    // Add event listener for window resize
    window.addEventListener('resize', debounce(updateResponsiveElements, 250));
}

// Footer Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in copyright
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Initialize Scroll to Top Button
    initScrollToTop();
    
    // Initialize Footer Animations
    initFooterAnimations();
    
    // Initialize Newsletter Form
    initNewsletterForm();
});

// Scroll to Top Button
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    scrollToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Footer Animations using Intersection Observer
function initFooterAnimations() {
    const footerElements = document.querySelectorAll('.animate-footer');
    
    if (!footerElements.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    const footerObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.delay || 0;
                
                setTimeout(() => {
                    element.classList.add('in-view');
                }, delay);
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    footerElements.forEach(element => {
        footerObserver.observe(element);
    });
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterConfirmation = document.getElementById('newsletter-confirmation');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('newsletter-email');
        const email = emailInput.value.trim();
        
        // Basic email validation
        if (!validateEmail(email)) {
            emailInput.classList.add('error');
            return;
        }
        
        // Clear any existing errors
        emailInput.classList.remove('error');
        
        // Simulate form submission
        newsletterForm.style.opacity = '0.5';
        newsletterForm.style.pointerEvents = 'none';
        
        // Simulate API call with a timeout
        setTimeout(() => {
            // Show confirmation message
            newsletterForm.style.display = 'none';
            newsletterConfirmation.classList.add('show');
            
            // Clear the input
            emailInput.value = '';
            
            // Reset after 5 seconds for testing purposes
            setTimeout(() => {
                newsletterForm.style.opacity = '1';
                newsletterForm.style.pointerEvents = 'auto';
                newsletterForm.style.display = 'block';
                newsletterConfirmation.classList.remove('show');
            }, 5000);
        }, 1000);
    });
}

// Validate email format
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 