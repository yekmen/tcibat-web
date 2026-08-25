// ============================================================
// TCI BÂTIMENT – JavaScript
// ============================================================

/* ── Navbar scroll effect ─────────────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* ── Mobile menu ──────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
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
}

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
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nom = document.getElementById('nom').value.trim();
    const email = document.getElementById('email').value.trim();
    const sujet = document.getElementById('sujet').value.trim();
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
    const formSuccess = document.getElementById('formSuccess');
    if (formSuccess) {
      formSuccess.style.display = 'block';
      setTimeout(() => {
        formSuccess.style.display = 'none';
      }, 5000);
    }
    contactForm.reset();
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

/* ── Smooth scroll for nav links (Sécurisé contre les plantages DOM) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // Évite de faire planter querySelector avec un href vide ou juste "#"
    if (href === '#' || !href) return;

    try {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } catch (err) {
      console.warn("Sélecteur d'ancre invalide ou ignoré :", href);
    }
  });
});

/* ── Counter animation (stats) ─────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1600;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString('fr-FR') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-count]').forEach(el => {
  counterObserver.observe(el);
});

/* Fade in keyframe injection */
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }`;
document.head.appendChild(style);

/* ── DOM Loaded Block (Specs & Gallery Modal) ─────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // Display project specs from data-specs attribute
  document.querySelectorAll('.project-card').forEach(card => {
    const specs = card.dataset.specs;
    if (specs) {
      const infoDiv = card.querySelector('.project-info');
      if (infoDiv) {
        const specsEl = document.createElement('p');
        specsEl.className = 'project-specs';
        specsEl.style.marginTop = '8px';
        specsEl.style.fontSize = '0.9rem';
        specsEl.style.color = '#fff';
        specsEl.textContent = specs;
        infoDiv.appendChild(specsEl);
      }
    }
  });

  /* ------------------------------------------------------------------
      Image gallery – open modal on project click with navigation
  ------------------------------------------------------------------- */
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('gallery-img');
  const modalCaption = document.getElementById('gallery-caption');
  const closeBtn = modal ? modal.querySelector('.close-btn') : null;
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  const thumbsContainer = document.getElementById('gallery-thumbnails');

  // Variables pour suivre la galerie active
  let currentGalleryImages = [];
  let currentImageIndex = 0;

  // Mettre à jour l'image affichée dans le modal
  function updateModalImage(animate = true) {
    if (!modalImg || currentGalleryImages.length === 0) return;

    const currentPath = currentGalleryImages[currentImageIndex];

    if (animate) {
      modalImg.style.opacity = '0.3';
      modalImg.style.transform = 'scale(0.98)';
      setTimeout(() => {
        modalImg.src = currentPath;
        modalImg.style.opacity = '1';
        modalImg.style.transform = 'scale(1)';
      }, 120);
    } else {
      modalImg.src = currentPath;
    }

    // Met à jour la légende
    if (modalCaption) {
      const baseCaption = modalCaption.dataset.baseTitle || '';
      if (currentGalleryImages.length > 1) {
        modalCaption.textContent = `${baseCaption} (${currentImageIndex + 1} / ${currentGalleryImages.length})`;
      } else {
        modalCaption.textContent = baseCaption;
      }
    }

    // Affichage des flèches
    const displayStyle = currentGalleryImages.length > 1 ? 'flex' : 'none';
    if (prevBtn) prevBtn.style.display = displayStyle;
    if (nextBtn) nextBtn.style.display = displayStyle;

    // Mise à jour des miniatures actives
    if (thumbsContainer) {
      const allThumbs = thumbsContainer.querySelectorAll('.gallery-thumb');
      allThumbs.forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === currentImageIndex);
        if (idx === currentImageIndex) {
          thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      });
    }
  }

  // Rendu des miniatures
  function renderThumbnails() {
    if (!thumbsContainer) return;
    thumbsContainer.innerHTML = '';

    if (currentGalleryImages.length <= 1) {
      thumbsContainer.style.display = 'none';
      return;
    }

    thumbsContainer.style.display = 'flex';
    currentGalleryImages.forEach((imgSrc, idx) => {
      const thumb = document.createElement('img');
      thumb.src = imgSrc;
      thumb.alt = `Miniature ${idx + 1}`;
      thumb.className = `gallery-thumb ${idx === currentImageIndex ? 'active' : ''}`;
      thumb.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = idx;
        updateModalImage();
      });
      thumbsContainer.appendChild(thumb);
    });
  }

  // Ouvrir le modal
  function openGallery(event) {
    const card = event.currentTarget;
    const galleryData = card.dataset.gallery;
    const mainImg = card.querySelector('img');
    if (!mainImg) return;

    currentGalleryImages = [];
    currentImageIndex = 0;

    if (modalCaption) {
      modalCaption.dataset.baseTitle = card.dataset.title || (card.querySelector('h3') ? card.querySelector('h3').textContent : '') || mainImg.alt || '';
    }

    if (galleryData) {
      currentGalleryImages = galleryData.split(',').map(src => src.trim()).filter(Boolean);
    }

    // Si aucun data-gallery ou vide, on utilise l'image de la carte
    if (currentGalleryImages.length === 0) {
      currentGalleryImages = [mainImg.getAttribute('src') || mainImg.src];
    }

    renderThumbnails();
    updateModalImage(false);

    if (modal) {
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeGallery() {
    if (modal) {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  // Fonctions de navigation
  function nextImage() {
    if (currentGalleryImages.length <= 1) return;
    currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
    updateModalImage();
  }

  function prevImage() {
    if (currentGalleryImages.length <= 1) return;
    currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    updateModalImage();
  }

  // Événements sur les boutons de navigation
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });

  // Navigation au clavier (Flèches et Échap)
  document.addEventListener('keydown', (e) => {
    if (modal && modal.classList.contains('is-open')) {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeGallery();
    }
  });

  // Attacher le clic sur tous les articles de projets
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', openGallery);
  });

  // Fermer via la croix
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeGallery();
    });
  }

  // Fermer en cliquant sur le fond sombre
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-image-wrapper')) {
        closeGallery();
      }
    });
  }

}); // end of DOMContentLoaded