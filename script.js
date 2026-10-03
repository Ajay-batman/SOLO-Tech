document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.textContent = isOpen ? '✕' : '☰';
    });

    // Close menu when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = '☰';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = '☰';
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = '☰';
      }
    });
  }

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('in'));
  }

  // Scrollspy - Highlight active nav link on scroll
  const sections = document.querySelectorAll('section[id], main[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navItems.forEach(link => {
      link.classList.remove('active');
      if (currentId && link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // Footer Copyright Year
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Contact Form Handling
  const contactForm = document.getElementById('contactForm');
  const toastMsg = document.getElementById('toastMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const company = document.getElementById('company').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        return;
      }

      // Display feedback toast
      if (toastMsg) {
        toastMsg.classList.add('show');
        setTimeout(() => {
          toastMsg.classList.remove('show');
        }, 5000);
      }

      // Prepare mailto link with encoded parameters
      const subject = encodeURIComponent(`Solo Tech 1 Inquiry: ${name}`);
      const bodyContent = `Name: ${name}\nCompany: ${company || 'N/A'}\nEmail: ${email}\n\nProject Scope & Requirements:\n${message}`;
      const mailtoUrl = `mailto:solotechnologies41@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyContent)}`;

      // Trigger user's email client
      window.location.href = mailtoUrl;
    });
  }
});
