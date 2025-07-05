// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Adjust offset based on screen size and mobile menu state
            let headerOffset = 80;
            
            // Check if mobile menu is active and adjust offset
            const navMenu = document.getElementById('nav-menu');
            const isMobile = window.innerWidth <= 768;
            const isMenuActive = navMenu.classList.contains('active');
            
            if (isMobile && isMenuActive) {
                // Close mobile menu first
                navMenu.classList.remove('active');
                document.getElementById('hamburger').classList.remove('active');
                
                // Add extra offset for mobile to account for menu transition
                headerOffset = 100;
            } else if (isMobile) {
                // Mobile without active menu
                headerOffset = 90;
            }
            
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            // Add a small delay for mobile to ensure menu closes before scrolling
            const scrollDelay = (isMobile && isMenuActive) ? 300 : 0;
            
            setTimeout(() => {
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, scrollDelay);
        }
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Contact Form Handling - Now handled by handleFormSubmission function
// The form uses onsubmit="handleFormSubmission(event)" instead of event listeners

// Contact Form Handling for FormSubmit.co
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // Set dynamic subject
        const dynamicSubject = document.getElementById('dynamicSubject');
        if (dynamicSubject) {
            const timestamp = new Date().toLocaleString();
            dynamicSubject.value = "New Contact Form Submission - " + timestamp;
        }

        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
        }

        // Let the form submit to FormSubmit.co
        return true;
    });
}

// Form validation function
function validateForm(data) {
    let isValid = true;
    clearErrorMessages();

    if (!data.name || data.name.trim() === '') {
        showFieldError('name', 'Full name is required');
        isValid = false;
    }
    if (!data.email || data.email.trim() === '') {
        showFieldError('email', 'Email address is required');
        isValid = false;
    } else if (!isValidEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    if (!data.message || data.message.trim() === '') {
        showFieldError('message', 'Message is required');
        isValid = false;
    }
    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show field error
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    const formGroup = field.parentElement;
    field.classList.add('error');
    // Remove existing error message for this field
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) existingError.remove();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'red';
    errorDiv.style.fontSize = '0.9em';
    errorDiv.style.marginTop = '5px';
    formGroup.appendChild(errorDiv);
}

// Clear error messages
function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    const errorFields = document.querySelectorAll('.error');
    errorMessages.forEach(msg => msg.remove());
    errorFields.forEach(field => field.classList.remove('error'));
}

// Show success/error messages as popup
function showPopupMessage(message, type) {
    // Remove any existing popup
    const existingPopup = document.getElementById('form-popup-message');
    if (existingPopup) existingPopup.remove();
    // Create popup container
    const popup = document.createElement('div');
    popup.id = 'form-popup-message';
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.top = '30px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.zIndex = '9999';
    popup.style.padding = '18px 32px';
    popup.style.borderRadius = '8px';
    popup.style.fontWeight = 'bold';
    popup.style.fontSize = '1.1rem';
    popup.style.boxShadow = '0 4px 24px rgba(0,0,0,0.13)';
    popup.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    popup.style.color = type === 'success' ? '#155724' : '#721c24';
    popup.style.border = type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 4000);
}

// Override showMessage to use popup
function showMessage(message, type) {
    showPopupMessage(message, type);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .team-card, .about-text, .about-image');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = '#ffffff';
        header.style.backdropFilter = 'none';
    }
});

// Hamburger animation
const hamburgerStyle = document.createElement('style');
hamburgerStyle.textContent = `
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(hamburgerStyle);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Phone number formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{3})/, '($1) $2');
        }
        e.target.value = value;
    });
}

// Initialize Google Maps (placeholder function)
// In a real implementation, you would use the Google Maps API
function initMap() {
    // This is a placeholder for Google Maps integration
    // You would need to:
    // 1. Get a Google Maps API key
    // 2. Include the Google Maps script
    // 3. Initialize the map with your office location
    
    console.log('Google Maps would be initialized here');
}

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Print styles for better printing
const printStyles = document.createElement('style');
printStyles.textContent = `
    @media print {
        .header, .footer, .hamburger, .btn {
            display: none !important;
        }
        
        body {
            font-size: 12pt;
            line-height: 1.4;
        }
        
        .hero, .about, .services, .team, .contact {
            page-break-inside: avoid;
            margin-bottom: 20pt;
        }
        
        h1, h2, h3 {
            page-break-after: avoid;
        }
    }
`;
document.head.appendChild(printStyles);

// Form submission function - replaced by handleFormSubmission
// This function is kept for backward compatibility but not used
function prepareForm() {
    console.log('prepareForm() called - but using handleFormSubmission instead');
    // This function is deprecated - use handleFormSubmission instead
}

// Handle form response
function handleFormResponse() {
    console.log('Form response received - iframe loaded');
    
    // Reset button state
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    if (submitButton) {
        submitButton.textContent = 'Send Message';
        submitButton.disabled = false;
    }
    
    // Reset form
    const form = document.getElementById('contact-form');
    if (form) {
        form.reset();
    }
    
    // The redirect to form-status.html will happen automatically via FormSubmit's _next parameter
}

// New function to handle form submission and redirect
function handleFormSubmission(event) {
    event.preventDefault();
    
    console.log('handleFormSubmission() called - starting form submission');
    
    // Get form data
    const form = event.target;
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Basic form validation
    if (validateForm(formObject)) {
        // Set dynamic subject
        const dynamicSubject = document.getElementById('dynamicSubject');
        if (dynamicSubject) {
            const timestamp = new Date().toLocaleString();
            dynamicSubject.value = "New Contact Form Submission - " + timestamp;
        }

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Simulate form submission (in real implementation, you'd send to server)
        setTimeout(() => {
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Reset form
            form.reset();
            
            // Redirect to status page with success parameter
            window.location.href = 'form-status.html?status=success';
        }, 2000);
    } else {
        // Validation failed
        showMessage('Please fix the errors above and try again.', 'error');
    }
}
