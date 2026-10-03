document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const menuToggle = document.getElementById('sMenuToggle');
  const navList = document.getElementById('sNavList');

  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.textContent = isOpen ? '✕' : '☰';
    });

    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      });
    });
  }

  // Interactive Category Tabs Filter (Samsung Developer Style)
  const tabButtons = document.querySelectorAll('.s-tab-btn');
  const serviceCards = document.querySelectorAll('.s-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active tab state
      tabButtons.forEach(btn => btn.classList.remove('is-active'));
      button.classList.add('is-active');

      const selectedCategory = button.getAttribute('data-category');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Scrollspy - Update active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.s-nav-link');

  function updateActiveNav() {
    let currentId = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (currentId && link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // Footer Dynamic Year
  const yearElement = document.getElementById('sYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Web3Forms AJAX Contact Form Submission
  const contactForm = document.getElementById('sContactForm');
  const toastAlert = document.getElementById('sToastAlert');
  const submitBtn = document.getElementById('sSubmitBtn');
  const keyInput = document.getElementById('web3formsKey');

  // Inject Web3Forms key from config.js if present
  if (keyInput && typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.WEB3FORMS_KEY) {
    keyInput.value = SITE_CONFIG.WEB3FORMS_KEY;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('sName').value.trim();
      const email = document.getElementById('sEmail').value.trim();
      const message = document.getElementById('sMessage').value.trim();
      const company = document.getElementById('sCompany') ? document.getElementById('sCompany').value.trim() : '';

      if (!name || !email || !message) return;

      const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit Inquiry →';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Inquiry...';
      }

      if (toastAlert) {
        toastAlert.className = 's-toast-alert info show';
        toastAlert.innerHTML = '<span>⏳ Sending your inquiry securely to SOLO TECH team...</span>';
      }

      const formData = new FormData(contactForm);

      // Populate access key from SITE_CONFIG if not already set
      if (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.WEB3FORMS_KEY) {
        formData.set('access_key', SITE_CONFIG.WEB3FORMS_KEY);
      }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(async (response) => {
        const json = await response.json();
        if (response.status === 200 && json.success) {
          if (toastAlert) {
            toastAlert.className = 's-toast-alert show';
            toastAlert.innerHTML = '<span>✓ Thank you! Your inquiry has been sent directly to <strong>solotechnologies41@gmail.com</strong>. Our engineering team will review your specs and respond promptly.</span>';
          }
          contactForm.reset();
        } else {
          throw new Error(json.message || 'Submission failed');
        }
      })
      .catch((error) => {
        console.error('Web3Forms submission error:', error);
        if (toastAlert) {
          toastAlert.className = 's-toast-alert error show';
          toastAlert.innerHTML = '<span>✕ Direct delivery failed. Opening email client fallback...</span>';
        }
        setTimeout(() => {
          const subject = encodeURIComponent(`SOLO TECH Inquiry: ${name}`);
          const bodyContent = `Name: ${name}\nCompany: ${company || 'N/A'}\nEmail: ${email}\n\nProject Scope & Requirements:\n${message}`;
          window.location.href = `mailto:solotechnologies41@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyContent)}`;
        }, 1200);
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      });
    });
  }
});
