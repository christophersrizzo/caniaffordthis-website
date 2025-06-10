// Smooth scrolling to sections
function scrollToSignup() {
    document.getElementById('signup').scrollIntoView({
        behavior: 'smooth'
    });
}

function scrollToDemo() {
    document.getElementById('demo').scrollIntoView({
        behavior: 'smooth'
    });
}

// Email form handling
document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('emailForm');
    const heroEmailForm = document.getElementById('heroEmailForm');
    const successMessage = document.getElementById('successMessage');
    const emailInput = document.getElementById('email');
    const heroEmailInput = document.getElementById('heroEmail');

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Store email locally (you'll replace this with your email service)
    function storeEmail(email) {
        // For now, store in localStorage (replace with your backend/email service)
        let emails = JSON.parse(localStorage.getItem('earlyAccessEmails') || '[]');
        if (!emails.includes(email)) {
            emails.push({
                email: email,
                timestamp: new Date().toISOString(),
                source: 'landing-page'
            });
            localStorage.setItem('earlyAccessEmails', JSON.stringify(emails));
        }
        
        // You can replace this with a call to your email service:
        // Example: Mailchimp, ConvertKit, Supabase, etc.
        console.log('Email captured:', email);
        
        // Optional: Send to Google Forms, Airtable, or other services
        // fetch('YOUR_WEBHOOK_URL', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email: email })
        // });
    }

    // Form submission handler
    function handleFormSubmission(e, formElement, inputElement) {
        e.preventDefault();
        
        const email = inputElement.value.trim();
        
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Store the email
        storeEmail(email);
        
        // Show success message
        if (formElement === heroEmailForm) {
            // For hero form, show inline success
            const formGroup = formElement.querySelector('.form-group');
            const benefits = formElement.querySelector('.form-benefits');
            formGroup.innerHTML = '<div style="text-align: center; color: #4CAF50; font-size: 1.2rem; font-weight: 600;">🎉 You\'re In! Check your email for confirmation.</div>';
            benefits.style.display = 'none';
        } else {
            // For main form, use existing success message
            emailForm.style.display = 'none';
            successMessage.style.display = 'block';
        }
        
        // Track conversion (replace with your analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'send_to': 'YOUR_CONVERSION_ID',
                'value': 1.0,
                'currency': 'USD'
            });
        }
        
        // Optional: Reset form after delay
        if (formElement !== heroEmailForm) {
            setTimeout(() => {
                emailForm.style.display = 'block';
                successMessage.style.display = 'none';
                emailInput.value = '';
            }, 5000);
        }
    }

    // Add event listeners to both forms
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            handleFormSubmission(e, emailForm, emailInput);
        });
    }

    if (heroEmailForm) {
        heroEmailForm.addEventListener('submit', function(e) {
            handleFormSubmission(e, heroEmailForm, heroEmailInput);
        });
    }

    // Add some interactive elements
    
    // Animate stats when they come into view (for other stat sections on the page)
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    animateNumber(stat);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe any remaining stat sections
    const statsSections = document.querySelectorAll('.hero-stats, .stats');
    statsSections.forEach(section => {
        statsObserver.observe(section);
    });
    
    // Number animation function
    function animateNumber(element) {
        const target = element.textContent.replace(/[^0-9]/g, '');
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (element.textContent.includes('$')) {
                element.textContent = '$' + Math.floor(current).toLocaleString();
            } else if (element.textContent.includes('%')) {
                element.textContent = Math.floor(current) + '%';
            } else {
                element.textContent = Math.floor(current).toLocaleString() + '+';
            }
        }, 50);
    }

    // Track page engagement
    let maxScroll = 0;
    let timeOnPage = 0;
    const startTime = Date.now();
    
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        maxScroll = Math.max(maxScroll, scrollPercent);
    });
    
    window.addEventListener('beforeunload', () => {
        timeOnPage = Math.round((Date.now() - startTime) / 1000);
        
        // Log engagement metrics (replace with your analytics)
        console.log('Engagement metrics:', {
            timeOnPage: timeOnPage,
            maxScroll: maxScroll,
            emailCaptured: localStorage.getItem('earlyAccessEmails') ? true : false
        });
    });

    // Add some visual feedback
    const ctaButtons = document.querySelectorAll('.cta-button, .hero-cta, .submit-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple effect CSS
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 600ms linear;
        background-color: rgba(255, 255, 255, 0.6);
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    button {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Console message for developers
console.log(`
🚀 Can I Afford This? Landing Page
📧 Email capture is working locally
🔧 To connect to email service, update the storeEmail function in script.js
📊 Engagement tracking is logged to console
`);

// Export email list function (for development/testing)
window.getEmailList = function() {
    return JSON.parse(localStorage.getItem('earlyAccessEmails') || '[]');
};

window.clearEmailList = function() {
    localStorage.removeItem('earlyAccessEmails');
    console.log('Email list cleared');
};