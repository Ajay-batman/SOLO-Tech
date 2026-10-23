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

  // ===== 3D ORBIT DEVICE SHOWCASE CONTROLLER (Mobile · Tablet · Buds · Watch) =====
  const orbitContainer = document.getElementById('orbitContainer');
  const orbitCards = orbitContainer ? [...orbitContainer.querySelectorAll('.s-3d-card')] : [];
  const orbitPrev = document.getElementById('orbitPrev');
  const orbitNext = document.getElementById('orbitNext');
  const orbitCount = document.getElementById('orbitCount');
  const orbitReflection = document.getElementById('orbitReflection');
  const deviceTabs = document.querySelectorAll('.s-device-tab');
  const projectorCard = document.querySelector('.s-device-projector-card');

  if (orbitContainer && orbitCards.length) {
    let active = 0;
    let startX = 0, lastX = 0, dragging = false, dragOffset = 0;
    let autoSwitchTimer = null;
    let isHovered = false;

    function renderOrbit() {
      const mobile = window.innerWidth < 650;
      const spacing = mobile ? 135 : 210;

      const yOffsets = {
        mobile: 0,
        tablet: 0,
        buds: 0,
        watch: 0
      };

      const reflScales = {
        mobile: 1.1,
        tablet: 1.1,
        buds: 1.1,
        watch: 1.1
      };
      
      orbitCards.forEach((card, i) => {
        let rel = i - active;
        const half = orbitCards.length / 2;
        if (rel > half) rel -= orbitCards.length;
        if (rel < -half) rel += orbitCards.length;

        const abs = Math.abs(rel);
        const devType = card.getAttribute('data-device') || ['mobile', 'tablet', 'buds', 'watch'][i];
        const groundY = yOffsets[devType] || 0;

        let x = 0, z = 0, rotateY = 0, rotateZ = 0, rotateX = 0, scale = 1;
        let opacity = 0, zIndex = 1, isInteractive = false;

        if (abs === 0) {
          // Center Active Device: 100% visible, sharp, heroic front & center
          x = dragOffset * 0.42;
          z = 90;
          rotateY = -dragOffset * 0.09;
          rotateZ = -dragOffset * 0.01;
          rotateX = 0;
          scale = 1.03;
          opacity = 1;
          zIndex = 25;
          isInteractive = true;
        } else if (abs === 1) {
          // Adjacent devices: ready for transition, completely disappeared (opacity 0)
          const dir = rel > 0 ? 1 : -1;
          x = dir * spacing + dragOffset * 0.38;
          z = -75;
          rotateY = dir * -34 - dragOffset * 0.08;
          rotateZ = dir * -1.5 - dragOffset * 0.01;
          rotateX = 1.8;
          scale = 0.82;
          // During live pointer dragging, reveal the incoming device proportionally:
          if (dragging && Math.abs(dragOffset) > 10) {
            const dragProgress = Math.min(1, Math.abs(dragOffset) / (spacing * 0.75));
            if ((dragOffset < 0 && dir > 0) || (dragOffset > 0 && dir < 0)) {
              opacity = Math.min(0.9, dragProgress);
            } else {
              opacity = 0;
            }
          } else {
            opacity = 0; // Disappeared when stationary
          }
          zIndex = 10;
          isInteractive = false;
        } else {
          // Rear / opposite device: completely disappeared
          x = dragOffset * 0.15;
          z = -180;
          rotateY = -dragOffset * 0.04;
          rotateZ = 0;
          rotateX = 3;
          scale = 0.65;
          opacity = 0;
          zIndex = 1;
          isInteractive = false;
        }

        const y = (abs === 0 ? -6 : abs * 8) + groundY;

        card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY.toFixed(1)}deg) rotateZ(${rotateZ.toFixed(2)}deg) scale(${scale})`;
        card.style.zIndex = String(zIndex);
        card.style.opacity = String(opacity);
        card.style.filter = 'none';
        card.style.pointerEvents = isInteractive ? 'auto' : 'none';
        card.classList.toggle('is-active', abs === 0);
      });

      if (orbitCount) {
        orbitCount.textContent = `${String(active + 1).padStart(2, '0')} / ${String(orbitCards.length).padStart(2, '0')}`;
      }
      
      const activeDev = orbitCards[active]?.getAttribute('data-device') || 'mobile';
      if (orbitReflection) {
        orbitReflection.style.transform = `translateX(-50%) scaleX(${reflScales[activeDev] || 1})`;
      }

      // Sync active tab state
      deviceTabs.forEach((tab, idx) => {
        const isSelected = idx === active;
        tab.classList.toggle('active', isSelected);
        tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      });
    }

    function moveOrbit(step) {
      active = (active + step + orbitCards.length) % orbitCards.length;
      renderOrbit();
      scheduleOrbitAutoSwitch();
    }

    function scheduleOrbitAutoSwitch() {
      clearTimeout(autoSwitchTimer);
      if (isHovered || dragging) return;
      autoSwitchTimer = setTimeout(() => {
        moveOrbit(1);
      }, 5500);
    }

    // Prev / Next button listeners
    if (orbitPrev) {
      orbitPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        moveOrbit(-1);
      });
    }
    if (orbitNext) {
      orbitNext.addEventListener('click', (e) => {
        e.stopPropagation();
        moveOrbit(1);
      });
    }

    // Clicking on cards to center them
    orbitCards.forEach((card, i) => {
      card.addEventListener('click', () => {
        if (i !== active) {
          let step = i - active;
          const half = orbitCards.length / 2;
          if (step > half) step -= orbitCards.length;
          if (step < -half) step += orbitCards.length;
          moveOrbit(step);
        }
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          let step = i - active;
          const half = orbitCards.length / 2;
          if (step > half) step -= orbitCards.length;
          if (step < -half) step += orbitCards.length;
          moveOrbit(step);
        }
      });
    });

    // Device tabs click
    deviceTabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        if (idx !== active) {
          let step = idx - active;
          const half = orbitCards.length / 2;
          if (step > half) step -= orbitCards.length;
          if (step < -half) step += orbitCards.length;
          moveOrbit(step);
        }
      });
    });

    // Pointer Drag / Swipe on the orbit container
    orbitContainer.addEventListener('pointerdown', (e) => {
      orbitContainer.classList.add('is-dragging');
      startX = e.clientX;
      lastX = startX;
      dragOffset = 0;
      dragging = true;
      clearTimeout(autoSwitchTimer);
      orbitContainer.setPointerCapture(e.pointerId);
    });

    orbitContainer.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const delta = e.clientX - lastX;
      dragOffset += delta;
      lastX = e.clientX;
      renderOrbit();
    });

    orbitContainer.addEventListener('pointerup', (e) => {
      if (!dragging) return;
      orbitContainer.classList.remove('is-dragging');
      const delta = e.clientX - startX;
      dragging = false;
      dragOffset = 0;
      if (Math.abs(delta) > 35) {
        moveOrbit(delta < 0 ? 1 : -1);
      } else {
        renderOrbit();
      }
      scheduleOrbitAutoSwitch();
    });

    orbitContainer.addEventListener('pointercancel', () => {
      orbitContainer.classList.remove('is-dragging');
      dragging = false;
      dragOffset = 0;
      renderOrbit();
      scheduleOrbitAutoSwitch();
    });

    // Hover detection to pause auto-cycling
    if (projectorCard) {
      projectorCard.addEventListener('mouseenter', () => {
        isHovered = true;
        clearTimeout(autoSwitchTimer);
      });
      projectorCard.addEventListener('mouseleave', () => {
        isHovered = false;
        scheduleOrbitAutoSwitch();
      });
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowRight') moveOrbit(1);
      if (e.key === 'ArrowLeft') moveOrbit(-1);
    });

    window.addEventListener('resize', renderOrbit);

    // Initial render and timer
    renderOrbit();
    scheduleOrbitAutoSwitch();
  } else {
    // Fallback single-stage switcher for pages using legacy stage
    const legacyDeviceStage = document.getElementById('panel-device');
    const legacyTypeLabel = document.getElementById('deviceTypeLabel');
    if (deviceTabs.length && legacyDeviceStage) {
      const deviceOrder = ['mobile', 'tablet', 'buds', 'watch'];
      let currentDeviceIndex = 0;
      let autoSwitchTimer = null;

      function switchLegacy(device) {
        currentDeviceIndex = deviceOrder.indexOf(device);
        deviceTabs.forEach(btn => {
          const isActive = btn.getAttribute('data-device') === device;
          btn.classList.toggle('active', isActive);
        });
        legacyDeviceStage.classList.remove('device-mobile', 'device-tablet', 'device-buds', 'device-watch');
        legacyDeviceStage.classList.add(`device-${device}`);
        const allMedia = legacyDeviceStage.querySelectorAll('.s-device-media');
        allMedia.forEach(m => m.classList.remove('is-active'));
        const targetMedia = document.getElementById(`media-${device}`);
        if (targetMedia) {
          void targetMedia.offsetWidth;
          targetMedia.classList.add('is-active');
        }
        if (legacyTypeLabel) {
          legacyTypeLabel.textContent = device.charAt(0).toUpperCase() + device.slice(1);
        }
      }

      deviceTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          switchLegacy(tab.getAttribute('data-device'));
        });
      });
    }
  }
});
