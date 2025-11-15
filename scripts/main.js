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
  
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Validate
    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields');
      return;
    }
    
    // Create mailto link
    const mailtoLink = `mailto:priteshyadav2015@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    
    // Open default email client
    window.location.href = mailtoLink;
    
    // Reset form
    form.reset();
  });
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
