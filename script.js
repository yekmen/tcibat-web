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

  // Variables pour suivre la galerie active
  let currentGalleryImages = [];
  let currentImageIndex = 0;

  // Création dynamique des boutons Précédent / Suivant si non présents
  let prevBtn = modal ? modal.querySelector('.prev-btn') : null;
  let nextBtn = modal ? modal.querySelector('.next-btn') : null;

  if (modal && (!prevBtn || !nextBtn)) {
    prevBtn = document.createElement('button');
    prevBtn.className = 'gallery-nav prev-btn';
    prevBtn.innerHTML = '&#10094;'; // Flèche gauche ❮
    prevBtn.style.cssText = 'position:absolute; left:20px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.5); color:white; border:none; font-size:2rem; padding:10px 15px; cursor:pointer; border-radius:4px; z-index:10000;';

    nextBtn = document.createElement('button');
    nextBtn.className = 'gallery-nav next-btn';
    nextBtn.innerHTML = '&#10095;'; // Flèche droite ❯
    nextBtn.style.cssText = 'position:absolute; right:20px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.5); color:white; border:none; font-size:2rem; padding:10px 15px; cursor:pointer; border-radius:4px; z-index:10000;';

    modal.appendChild(prevBtn);
    modal.appendChild(nextBtn);
  }

  // Mettre à jour l'image affichée dans le modal
  function updateModalImage() {
    if (!modalImg || currentGalleryImages.length === 0) return;

    const currentPath = currentGalleryImages[currentImageIndex];
    modalImg.src = currentPath;

    // Met à jour la légende (ex: "Rénovation Salon (1/3)")
    if (modalCaption) {
      const baseCaption = modalCaption.dataset.baseTitle || '';
      modalCaption.textContent = `${baseCaption} (${currentImageIndex + 1}/${currentGalleryImages.length})`;
    }

    // Masquer les flèches s'il n'y a qu'une seule image
    const displayStyle = currentGalleryImages.length > 1 ? 'block' : 'none';
    if (prevBtn) prevBtn.style.display = displayStyle;
    if (nextBtn) nextBtn.style.display = displayStyle;
  }

  // Ouvrir le modal en lisant la liste d'images personnalisée (100% compatible file://)
  function openGallery(event) {
    const card = event.currentTarget;
    const galleryData = card.dataset.gallery; // Récupère la liste d'images
    const mainImg = card.querySelector('img');
    if (!mainImg) return;

    currentGalleryImages = [];
    currentImageIndex = 0;

    if (modalCaption) {
      modalCaption.dataset.baseTitle = mainImg.alt || card.dataset.title || '';
    }

    if (galleryData) {
      // Découpe la chaîne séparée par des virgules en tableau JavaScript
      currentGalleryImages = galleryData.split(',').map(src => src.trim());
    }

    // Si aucun data-gallery, on utilise l'image de couverture comme seule image
    if (currentGalleryImages.length === 0) {
      currentGalleryImages = [mainImg.src];
    }

    updateModalImage();

    if (modal) modal.classList.add('is-open');
  }

  function closeGallery() {
    if (modal) modal.classList.remove('is-open');
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

  // Attacher le clic sur tous les articles
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', openGallery);
  });

  // Fermer via le bouton de fermeture
  if (closeBtn) {
    closeBtn.addEventListener('click', closeGallery);
  }

  // Fermer en cliquant à l'extérieur de l'image (sur l'overlay sombre)
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeGallery();
    });
  }

}); // end of DOMContentLoaded