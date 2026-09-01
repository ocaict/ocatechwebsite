/**
 * OCATECH Digital Solutions — Main JavaScript
 * Handles navigation, mobile menu, scroll effects, and programme filtering
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initProgrammeFilter();
  initScrollEffects();
});

/**
 * 1. Mobile Navigation & Header State
 */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const siteHeader = document.querySelector('.site-header');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      mobileToggle.classList.toggle('is-active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile drawer when clicking a link
    const drawerLinks = mobileDrawer.querySelectorAll('.mobile-nav-link, .btn');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Header background on scroll
  if (siteHeader) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Highlight active link based on current path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/**
 * 2. Programme Filtering on programmes.html
 */
function initProgrammeFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const programmeCards = document.querySelectorAll('.programme-card');

  if (!filterButtons.length || !programmeCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      // Update active button state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      let visibleCount = 0;
      programmeCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Handle empty state if needed
      const emptyState = document.getElementById('programmeEmptyState');
      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    });
  });

  // Check URL query param for pre-filtering (e.g. programmes.html?cat=artificial-intelligence)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam) {
    const targetBtn = document.querySelector(`.filter-btn[data-filter="${catParam}"]`);
    if (targetBtn) {
      targetBtn.click();
    }
  }
}

/**
 * 3. Smooth Scroll & Back to Top helpers
 */
function initScrollEffects() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * Helper to build pre-filled WhatsApp links
 * @param {string} courseOrService 
 */
function getWhatsAppUrl(courseOrService) {
  const phone = '2348165321429';
  const message = courseOrService 
    ? `Hello OCATECH, I am interested in enrolling or learning more about "${courseOrService}". Please provide more details.`
    : `Hello OCATECH, I would like to inquire about your ICT training programmes and services.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
window.getWhatsAppUrl = getWhatsAppUrl;
