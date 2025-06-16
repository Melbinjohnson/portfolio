// Portfolio JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initMobileMenu();
    initSmoothScrolling();
    initContactForm();
    initSkillAnimations();
    initHeaderScrollEffect();
    initScrollAnimations();
    initProjectDetails();
    
    console.log('Melbin Johnson Portfolio JavaScript initialized');
});

// Navigation functionality
function initNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                
                const activeLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
}

// Mobile menu toggle functionality
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.toggle('show');
            navToggle.classList.toggle('active');
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('show');
                navToggle.classList.remove('active');
            });
        });
        
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('show');
                navToggle.classList.remove('active');
            }
        });
    }
}

// Smooth scrolling functionality
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = 70;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            
            if (validateContactForm(formData)) {
                handleFormSubmission(formData);
            }
        });
    }
}

// Form validation
function validateContactForm(data) {
    // Clear previous messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const errors = [];
    
    if (!data.name || data.name.length < 2) {
        errors.push('Please enter a valid name (at least 2 characters)');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject || data.subject.length < 3) {
        errors.push('Please enter a subject (at least 3 characters)');
    }
    
    if (!data.message || data.message.length < 10) {
        errors.push('Please enter a message (at least 10 characters)');
    }
    
    if (errors.length > 0) {
        showFormMessage(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Handle form submission
function handleFormSubmission(data) {
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        showFormMessage('Thank you for your message! Melbin will get back to you soon.', 'success');
        document.getElementById('contact-form').reset();
    }, 1500);
}

// Show form message
function showFormMessage(message, type) {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message--${type}`;
    messageDiv.innerHTML = message;
    
    messageDiv.style.cssText = `
        padding: 12px 16px;
        margin-top: 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        ${type === 'error' 
            ? 'background-color: rgba(255, 84, 89, 0.1); color: #FF5459; border: 1px solid rgba(255, 84, 89, 0.3);'
            : 'background-color: rgba(31, 184, 205, 0.1); color: #1FB8CD; border: 1px solid rgba(31, 184, 205, 0.3);'
        }
    `;
    
    const contactForm = document.getElementById('contact-form');
    contactForm.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv && messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Project details functionality
function initProjectDetails() {
    const projectButtons = document.querySelectorAll('.project__footer .btn');
    
    projectButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const projectCard = this.closest('.project__card');
            const projectTitle = projectCard.querySelector('.project__title').textContent;
            const projectDescription = projectCard.querySelector('.project__description').textContent;
            const techTags = Array.from(projectCard.querySelectorAll('.tech-tag')).map(tag => tag.textContent);
            const features = Array.from(projectCard.querySelectorAll('.project__features li')).map(li => li.textContent);
            const category = projectCard.querySelector('.project__category').textContent;
            
            showProjectModal(projectTitle, projectDescription, techTags, features, category, index);
        });
    });
}

// Show project modal with enhanced content
function showProjectModal(title, description, technologies, features, category, projectIndex) {
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
        padding: 20px;
        box-sizing: border-box;
    `;
    
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.style.cssText = `
        background: #0C1116;
        border: 2px solid #1FB8CD;
        border-radius: 12px;
        padding: 32px;
        max-width: 700px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        transform: scale(0.8);
        transition: transform 0.3s ease;
        position: relative;
    `;
    
    const techList = technologies.map(tech => `<span style="background: rgba(119, 124, 124, 0.2); color: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">${tech}</span>`).join('');
    
    const featuresList = features.map(feature => `<li style="margin-bottom: 8px;">${feature}</li>`).join('');
    
    // Custom content for specific projects
    let additionalInfo = '';
    let projectType = 'cybersecurity';
    
    if (title.includes('Apptite')) {
        projectType = 'fullstack';
        additionalInfo = `
            <div style="margin-bottom: 24px;">
                <h4 style="color: #32B8C6; font-size: 18px; margin-bottom: 12px;">Social Impact</h4>
                <p style="color: #a7a9a9; line-height: 1.6; margin: 0;">
                    This platform addresses food waste by creating a bridge between donors with excess food and recipients in need. 
                    The application demonstrates full-stack development capabilities while making a positive social impact in the community.
                </p>
            </div>
        `;
    } else if (title.includes('File Integrity Monitor')) {
        additionalInfo = `
            <div style="margin-bottom: 24px;">
                <h4 style="color: #1FB8CD; font-size: 18px; margin-bottom: 12px;">Security Applications</h4>
                <p style="color: #a7a9a9; line-height: 1.6; margin: 0;">
                    Ideal for compliance monitoring, detecting unauthorized system changes, and maintaining system integrity. 
                    Essential for SOC operations and incident response workflows.
                </p>
            </div>
        `;
    } else if (title.includes('Brute Force Detection')) {
        additionalInfo = `
            <div style="margin-bottom: 24px;">
                <h4 style="color: #1FB8CD; font-size: 18px; margin-bottom: 12px;">Threat Intelligence</h4>
                <p style="color: #a7a9a9; line-height: 1.6; margin: 0;">
                    Leverages machine learning to identify attack patterns and automatically implement countermeasures. 
                    Integrates with existing security infrastructure for comprehensive protection.
                </p>
            </div>
        `;
    } else if (title.includes('Tic Tac Toe')) {
        additionalInfo = `
            <div style="margin-bottom: 24px;">
                <h4 style="color: #1FB8CD; font-size: 18px; margin-bottom: 12px;">Network Security Demonstration</h4>
                <p style="color: #a7a9a9; line-height: 1.6; margin: 0;">
                    Showcases understanding of peer-to-peer networking protocols and secure communication channels. 
                    Demonstrates practical implementation of decentralized network architecture.
                </p>
            </div>
        `;
    }
    
    const categoryColor = projectType === 'fullstack' ? '#32B8C6' : '#1FB8CD';
    const finalDescription = projectType === 'fullstack' 
        ? 'This project demonstrates full-stack development expertise and social impact through technology, showcasing the ability to build comprehensive applications that serve real-world needs.'
        : 'This project demonstrates expertise in cybersecurity, showcasing practical implementation of security best practices and innovative solutions.';
    
    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
            <div style="flex: 1;">
                <div style="background: rgba(${projectType === 'fullstack' ? '50, 184, 198' : '31, 184, 205'}, 0.1); color: ${categoryColor}; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 500; display: inline-block; margin-bottom: 12px;">${category}</div>
                <h3 style="color: #ffffff; margin: 0; font-size: 28px;">${title}</h3>
            </div>
            <button class="modal-close" style="background: none; border: none; color: #1FB8CD; font-size: 32px; cursor: pointer; padding: 0; margin-left: 16px; line-height: 1;">&times;</button>
        </div>
        
        <div style="margin-bottom: 24px;">
            <h4 style="color: ${categoryColor}; font-size: 18px; margin-bottom: 12px;">Project Overview</h4>
            <p style="color: #a7a9a9; line-height: 1.6; margin: 0;">${description}</p>
        </div>
        
        ${additionalInfo}
        
        <div style="margin-bottom: 24px;">
            <h4 style="color: ${categoryColor}; font-size: 18px; margin-bottom: 12px;">Technologies Used</h4>
            <div style="line-height: 1.8;">
                ${techList}
            </div>
        </div>
        
        <div style="margin-bottom: 32px;">
            <h4 style="color: ${categoryColor}; font-size: 18px; margin-bottom: 12px;">Key Features</h4>
            <ul style="color: #a7a9a9; padding-left: 20px; line-height: 1.6; margin: 0;">
                ${featuresList}
            </ul>
        </div>
        
        <div style="border-top: 1px solid rgba(31, 184, 205, 0.2); padding-top: 20px;">
            <p style="color: #a7a9a9; font-size: 14px; margin: 0; margin-bottom: 16px;">
                ${finalDescription}
            </p>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <a href="https://github.com" target="_blank" style="color: ${categoryColor}; text-decoration: none; font-weight: 500; display: inline-flex; align-items: center; gap: 6px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View on GitHub
                </a>
                <span style="color: #626c6c;">|</span>
                <a href="#contact" style="color: ${categoryColor}; text-decoration: none; font-weight: 500;">
                    Discuss Project →
                </a>
            </div>
        </div>
    `;
    
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    
    setTimeout(() => {
        backdrop.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);
    
    function closeModal() {
        backdrop.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (document.body.contains(backdrop)) {
                document.body.removeChild(backdrop);
            }
            document.body.style.overflow = 'auto';
        }, 300);
    }
    
    backdrop.addEventListener('click', function(e) {
        if (e.target === backdrop) {
            closeModal();
        }
    });
    
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // Handle internal navigation links
    const internalLinks = modal.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            closeModal();
            // Allow the original smooth scrolling to handle navigation
        });
    });
    
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Skill bar animations
function initSkillAnimations() {
    const skillBars = document.querySelectorAll('.skill__progress');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 300);
                
                observer.unobserve(progressBar);
            }
        });
    }, {
        threshold: 0.5
    });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Header scroll effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', throttle(() => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(15, 20, 25, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.background = 'rgba(15, 20, 25, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
    }, 100));
}

// Scroll animations for elements
function initScrollAnimations() {
    const projectCards = document.querySelectorAll('.project__card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
    
    const toolItems = document.querySelectorAll('.tool__item');
    const toolObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
                toolObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    toolItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        toolObserver.observe(item);
    });
}

// Utility function for throttling
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimization: Lazy load animations
function initLazyAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.about__content, .section__title, .hero__content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        animationObserver.observe(el);
    });
    
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Initialize additional enhancements
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initLazyAnimations();
    }, 500);
    
    // Add a greeting message to console
    console.log('%cMelbin Johnson Portfolio', 'color: #1FB8CD; font-size: 24px; font-weight: bold;');
    console.log('%cCybersecurity Enthusiast & Full-Stack Developer', 'color: #32B8C6; font-size: 16px;');
    console.log('%cThank you for visiting! 🔒', 'color: #a7a9a9; font-size: 14px;');
});