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

  // News Channel Horizontal Service Ticker is powered smoothly by hardware-accelerated CSS marquee animations (sTickerMotion) with pause-on-hover.

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

  // Interactive Hero Device Tabs Switcher with Auto-Cycling (Mobile · Tablet · Buds)
  const deviceTabs = document.querySelectorAll('.s-device-tab');
  const deviceStage = document.getElementById('panel-device');
  const deviceTypeLabel = document.getElementById('deviceTypeLabel');
  const deviceMetricLabel = document.getElementById('deviceMetricLabel');

  const deviceOrder = ['mobile', 'tablet', 'buds'];
  const deviceData = {
    mobile: {
      type: 'Mobile',
      duration: 6000 // 6.0s SMIL animation cycle
    },
    tablet: {
      type: 'Tablet',
      duration: 6033 // 6.033s SMIL animation cycle
    },
    buds: {
      type: 'Earbuds',
      duration: 4638 // 4.638s SMIL animation cycle
    }
  };

  if (deviceTabs.length && deviceStage) {
    let currentDeviceIndex = 0;
    let autoSwitchTimer = null;
    let isHovered = false;

    function switchDevice(device, isManual = false) {
      if (!device || !deviceData[device]) return;
      currentDeviceIndex = deviceOrder.indexOf(device);

      // Update active tab button state
      deviceTabs.forEach(btn => {
        const isActive = btn.getAttribute('data-device') === device;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Update stage form-factor class
      deviceStage.classList.remove('device-mobile', 'device-tablet', 'device-buds');
      deviceStage.classList.add(`device-${device}`);

      // Update active media panel with erase-in transition
      const allMedia = deviceStage.querySelectorAll('.s-device-media');
      allMedia.forEach(m => m.classList.remove('is-active'));
      const targetMedia = document.getElementById(`media-${device}`);
      if (targetMedia) {
        void targetMedia.offsetWidth; // Force reflow to restart erase-in animation
        targetMedia.classList.add('is-active');
        const video = targetMedia.querySelector('video');
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }
      }

      // Update device label badge with subtle fade
      if (deviceTypeLabel) {
        const pill = deviceTypeLabel.closest('.s-device-meta-pill') || deviceTypeLabel;
        pill.style.opacity = '0';

        setTimeout(() => {
          deviceTypeLabel.textContent = deviceData[device].type;
          pill.style.opacity = '1';
        }, 150);
      }

      // Schedule next automatic switch after this animation completes its cycle
      scheduleNextSwitch();
    }

    function scheduleNextSwitch() {
      clearTimeout(autoSwitchTimer);
      if (isHovered) return; // Pause when user is inspecting

      const currentDevice = deviceOrder[currentDeviceIndex];
      const duration = deviceData[currentDevice]?.duration || 5500;

      autoSwitchTimer = setTimeout(() => {
        const nextIndex = (currentDeviceIndex + 1) % deviceOrder.length;
        switchDevice(deviceOrder[nextIndex]);
      }, duration);
    }

    // Manual tab click handling
    deviceTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const device = tab.getAttribute('data-device');
        switchDevice(device, true);
      });
    });

    // Pause on hover so the user can inspect, resume on leave
    const projectorCard = document.querySelector('.s-device-projector-card');
    if (projectorCard) {
      projectorCard.addEventListener('mouseenter', () => {
        isHovered = true;
        clearTimeout(autoSwitchTimer);
      });
      projectorCard.addEventListener('mouseleave', () => {
        isHovered = false;
        scheduleNextSwitch();
      });
    }

    // Start auto-cycling initial timer
    scheduleNextSwitch();
  }
});
