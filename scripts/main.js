// ============================================
// MODERN PORTFOLIO - MAIN JAVASCRIPT v2.0
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      offset: 50
    });
  }

  // Smooth scroll navigation
  setupSmoothScroll();
  
  // Back to top button
  setupBackToTop();
  
  // Active nav link on scroll
  setupNavActiveLink();
  
  // Contact form handling
  setupContactForm();
  
  // Mobile menu close on link click
  setupMobileMenuClose();
});

// ============================================
// Smooth Scroll Navigation
// ============================================
function setupSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if href is just '#'
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const targetPosition = target.offsetTop - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// Back to Top Button
// ============================================
function setupBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  
  if (!backToTopBtn) return;
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });
  
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============================================
// Active Navigation Link on Scroll
// ============================================
function setupNavActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav a[href^="#"]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });
}

// ============================================
// Contact Form Handling
// ============================================
function setupContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  if (!form) return;
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validate
    if (!name || !email || !subject || !message) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    
    if (!isValidEmail(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    // Disable submit button
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
      // Try multiple API options
      const success = await sendEmail({
        name: name,
        email: email,
        subject: subject,
        message: message
      });
      
      if (success) {
        showNotification('Message sent successfully! I\'ll get back to you soon. 🚀', 'success');
        form.reset();
      } else {
        // Fallback to mailto
        const mailtoLink = `mailto:priteshyadav2015@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
        window.location.href = mailtoLink;
        showNotification('Opening your email client...', 'info');
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      showNotification('Something went wrong. Please try again or email directly.', 'error');
    } finally {
      // Re-enable submit button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ============================================
// Email Sending Function (Multiple API Support)
// ============================================
async function sendEmail(formData) {
  // Option 1: EmailJS (Replace with your actual EmailJS credentials)
  try {
    if (typeof emailjs !== 'undefined') {
      const result = await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: 'priteshyadav2015@gmail.com'
        },
        'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
      );
      return result.status === 200;
    }
  } catch (error) {
    console.log('EmailJS failed, trying next option...');
  }
  
  // Option 2: Netlify Forms (if hosted on Netlify)
  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        'form-name': 'contact',
        'name': formData.name,
        'email': formData.email,
        'subject': formData.subject,
        'message': formData.message
      })
    });
    
    if (response.ok) return true;
  } catch (error) {
    console.log('Netlify Forms failed, trying next option...');
  }
  
  // Option 3: Formspree (Replace with your Formspree endpoint)
  try {
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      })
    });
    
    if (response.ok) return true;
  } catch (error) {
    console.log('Formspree failed, trying next option...');
  }
  
  // Option 4: Custom API endpoint
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) return true;
  } catch (error) {
    console.log('Custom API failed, using fallback...');
  }
  
  return false; // All options failed, will use mailto fallback
}

// ============================================
// Utility Functions
// ============================================
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show position-fixed`;
  notification.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
  notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// ============================================
// Mobile Menu Close
// ============================================
function setupMobileMenuClose() {
  const navbarCollapse = document.querySelector('.navbar-collapse');
  const navLinks = document.querySelectorAll('.navbar-nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close the navbar collapse
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const toggleBtn = document.querySelector('.navbar-toggler');
        if (toggleBtn) {
          toggleBtn.click();
        }
      }
    });
  });
}

// ============================================
// Utility Functions
// ============================================

// Debounce function for scroll events
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

// Add animation to elements on scroll
function observeElements() {
  const elements = document.querySelectorAll('[data-animate]');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, {
      threshold: 0.1
    });
    
    elements.forEach(el => observer.observe(el));
  }
}

// ============================================
// Loading Optimization
// ============================================

// Lazy load images
function setupLazyLoading() {
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
}

// ============================================
// Print Styles Adjustment
// ============================================
window.addEventListener('beforeprint', () => {
  document.body.style.backgroundColor = '#ffffff';
});

window.addEventListener('afterprint', () => {
  document.body.style.backgroundColor = '';
});

// ============================================
// Console
// ============================================
console.log('%cPritesh Yadav Portfolio', 'font-size: 20px; font-weight: bold; color: #2563eb;');
console.log('%cVersion 2.0 - Modern Redesign', 'font-size: 12px; color: #10b981;');
console.log('Portfolio Website Created with ❤️');
