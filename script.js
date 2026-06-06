// ============================================================
// TCI BÂTIMENT – JavaScript
// ============================================================

/* ── Navbar scroll effect ─────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Mobile menu ──────────────────────────────────────────── */
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── Scroll reveal ────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Contact form ─────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const nom     = document.getElementById('nom').value.trim();
    const email   = document.getElementById('email').value.trim();
    const sujet   = document.getElementById('sujet').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!nom || !email || !sujet || !message) {
      showAlert('Veuillez remplir tous les champs.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('Veuillez entrer une adresse email valide.', 'error');
      return;
    }

    const mailtoLink =
      `mailto:contact@tci-batiment.fr` +
      `?subject=${encodeURIComponent('[Site web] ' + sujet)}` +
      `&body=${encodeURIComponent(
        `Nom : ${nom}\nEmail : ${email}\n\n${message}`
      )}`;

    window.location.href = mailtoLink;

    // Show success message
    document.getElementById('formSuccess').style.display = 'block';
    contactForm.reset();
    setTimeout(() => {
      document.getElementById('formSuccess').style.display = 'none';
    }, 5000);
  });
}

function showAlert(msg, type) {
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed; top:90px; right:24px; z-index:9999;
    background: ${type === 'error' ? '#fee2e2' : '#dcfce7'};
    color: ${type === 'error' ? '#991b1b' : '#166534'};
    border-radius: 8px; padding: 14px 20px;
    font-weight: 600; font-size: .9rem;
    box-shadow: 0 4px 20px rgba(0,0,0,.12);
    animation: fadeUp .3s ease;
  `;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

/* ── Smooth scroll for nav links ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Counter animation (hero stats) ──────────────────────── */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// Trigger counters when hero stats come into view
const statsEl = document.querySelector('.hero-stats');
if (statsEl) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });
  statsObserver.observe(statsEl);
}

/* ── Project lightbox (simple) ────────────────────────────── */
document.querySelectorAll('.project-card[data-title]').forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    const title = card.dataset.title || '';
    openLightbox(img.src, title);
  });
});

function openLightbox(src, caption) {
  const lb = document.createElement('div');
  lb.style.cssText = `
    position:fixed; inset:0; z-index:9999;
    background:rgba(0,0,0,.88);
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    padding:24px; cursor:zoom-out;
    animation: fadeIn .2s ease;
  `;
  lb.innerHTML = `
    <img src="${src}" alt="${caption}"
         style="max-width:90vw; max-height:80vh; border-radius:8px; box-shadow:0 24px 80px rgba(0,0,0,.5);">
    ${caption ? `<p style="color:rgba(255,255,255,.8); margin-top:16px; font-size:.95rem;">${caption}</p>` : ''}
  `;
  lb.addEventListener('click', () => lb.remove());
  document.body.appendChild(lb);
}

/* Fade in keyframe injection */
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }`;
document.head.appendChild(style);
