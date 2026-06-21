// Simple fade-in animation as works scroll into view
document.addEventListener('DOMContentLoaded', () => {
  const works = document.querySelectorAll('.work');

  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything
    works.forEach(w => w.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  works.forEach(work => observer.observe(work));

  // Lightbox: click any artwork image to view it enlarged
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryImages = Array.from(document.querySelectorAll('.work-media img'));

  let currentIndex = -1;

  function showImage(index) {
    if (index < 0) index = galleryImages.length - 1;
    if (index >= galleryImages.length) index = 0;
    currentIndex = index;
    const img = galleryImages[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  function openLightbox(img) {
    const index = galleryImages.indexOf(img);
    showImage(index);
    lightbox.classList.add('open');
    history.pushState({ lightbox: true }, '');
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
    currentIndex = -1;
    if (history.state && history.state.lightbox) {
      history.back();
    }
  }

  function showPrev() {
    showImage(currentIndex - 1);
  }

  function showNext() {
    showImage(currentIndex + 1);
  }

  galleryImages.forEach(img => {
    img.addEventListener('click', () => openLightbox(img));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
  });
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    showNext();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  window.addEventListener('popstate', () => {
    if (lightbox.classList.contains('open')) {
      lightbox.classList.remove('open');
      lightboxImg.src = '';
      currentIndex = -1;
    }
  });
});
