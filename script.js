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

// Contact Form Handling - Production Version
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        // Basic form validation
        if (validateForm(formObject)) {
            // Set dynamic subject if element exists
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

            // If this is a real form submission (has action attribute), allow it
            if (this.hasAttribute('action') && this.getAttribute('action')) {
                // Let the form submit naturally
                return true;
            } else {
                // Demo mode - prevent default and show success message
                e.preventDefault();
                showMessage('Thank you for your message! We will contact you within 24 hours.', 'success');
                contactForm.reset();
                if (submitButton) {
                    submitButton.textContent = 'Send Message';
                    submitButton.disabled = false;
                }
            }
        } else {
            // Validation failed
            e.preventDefault();
            showMessage('Please fix the errors above and try again.', 'error');
        }
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

// Show success/error messages
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message-global');
    existingMessages.forEach(msg => msg.remove());
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message-global';
    messageDiv.textContent = message;
    // Style the message
    messageDiv.style.padding = '15px';
    messageDiv.style.marginBottom = '20px';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.fontWeight = 'bold';
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    }
    const form = document.getElementById('contact-form');
    if (form) {
        form.insertBefore(messageDiv, form.firstChild);
    }
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
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

// Form submission function from POC
function prepareForm() {
    console.log('prepareForm() called - starting form submission');
    
    const timestamp = new Date().toLocaleString();
    const uniqueSubject = "New Contact Form Submission - " + timestamp;
    document.getElementById('dynamicSubject').value = uniqueSubject;
    
    console.log('Dynamic subject set:', uniqueSubject);

    // Show loading state
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Set a timeout to handle potential issues
    setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Check if form was actually submitted
        const form = document.getElementById('contact-form');
        console.log('Form validity check:', form.checkValidity());
        
        if (form.checkValidity()) {
            console.log('Form is valid, showing success message');
            document.getElementById('contact-form').reset();
            document.getElementById('successMessage').style.display = 'block';
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                document.getElementById('successMessage').style.display = 'none';
            }, 5000);
        } else {
            console.log('Form validation failed, showing error message');
            document.getElementById('errorMessage').style.display = 'block';
            setTimeout(() => {
                document.getElementById('errorMessage').style.display = 'none';
            }, 5000);
        }
    }, 2000);
}

// Handle form response
function handleFormResponse() {
    console.log('Form response received - iframe loaded');
    // This function will be called when the iframe loads
    // You can add additional logging here
}
