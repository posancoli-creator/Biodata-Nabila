/**
 * SCRIPT.JS - WEBSITE BIODATA PRIBADI AKHMAD ASRI FAUZAN
 * JavaScript Murni (Vanilla JS, Tanpa Framework / Library Tambahan)
 * 
 * Fitur:
 * 1. Mode Gelap & Terang (Dark / Light Theme Toggle dengan LocalStorage)
 * 2. Navigasi Sticky & Highlight Menu Aktif Saat Scroll (Scrollspy)
 * 3. Menu Hamburger Responsif untuk Perangkat HP
 * 4. Pengguliran Halus (Smooth Scrolling) dengan Kompensasi Tinggi Navbar
 * 5. Galeri Foto Rumah dengan Pop-up Lightbox Interaktif (Navigasi, Keyboard, & Swipe HP)
 * 6. Animasi Muncul Halus Saat Scroll (Scroll Reveal via Intersection Observer)
 * 7. Tombol Kembali ke Atas (Back to Top)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. TEMA TERANG & GELAP (LIGHT / DARK MODE)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Cek preferensi tema yang tersimpan di LocalStorage atau preferensi sistem browser
  const savedTheme = localStorage.getItem('theme-mode');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersDark) {
    htmlRoot.setAttribute('data-theme', 'dark');
  } else {
    htmlRoot.setAttribute('data-theme', 'light');
  }

  // Event listener tombol ganti tema
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme-mode', newTheme);
      
      // Update label aksesibilitas
      themeToggleBtn.setAttribute('aria-label', `Ganti ke mode ${newTheme === 'dark' ? 'terang' : 'gelap'}`);
    });
  }


  /* ==========================================================================
     2. NAVBAR STICKY & EFEK SCROLL
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Tambah kelas scrolled pada navbar jika halaman digulir lebih dari 30px
    if (navbar) {
      if (scrollPos > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Tampilkan tombol back-to-top jika digulir lebih dari 350px
    if (backToTopBtn) {
      if (scrollPos > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  // Aksi klik tombol back-to-top
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  /* ==========================================================================
     3. MENU HAMBURGER (RESPONSIF MOBILE / HP)
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Buka / Tutup menu saat tombol hamburger diklik
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      hamburgerBtn.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Otomatis tutup menu mobile jika tautan menu diklik
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Otomatis tutup jika pengguna mengklik di luar area menu
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }


  /* ==========================================================================
     4. HIGHLIGHT MENU AKTIF SAAT SCROLL (SCROLLSPY)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 120; // Offset posisi pandang

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);


  /* ==========================================================================
     5. GALERI RUMAH DENGAN LIGHTBOX POP-UP
     ========================================================================== */
  // Data foto galeri rumah
  const galleryItems = [
    {
      src: 'assets/foto/rumah-depan.jpg',
      caption: 'Rumah Tampak Depan - Akhmad Asri Fauzan'
    },
    {
      src: 'assets/foto/rumah-kanan.jpg',
      caption: 'Rumah Tampak Kanan - Sudut Samping Kanan'
    },
    {
      src: 'assets/foto/rumah-kiri.jpg',
      caption: 'Rumah Tampak Kiri - Sudut Samping Kiri'
    },
    {
      src: 'assets/foto/rumah-belakang.jpg',
      caption: 'Rumah Tampak Belakang - Halaman Belakang'
    }
  ];

  let currentImageIndex = 0;

  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxCloseBtn = document.getElementById('lightbox-close');
  const lightboxPrevBtn = document.getElementById('lightbox-prev');
  const lightboxNextBtn = document.getElementById('lightbox-next');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const galleryCards = document.querySelectorAll('.gallery-card');

  // Fungsi memperbarui gambar pada lightbox
  function updateLightbox(index) {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;

    currentImageIndex = index;
    const currentItem = galleryItems[currentImageIndex];

    lightboxImg.src = currentItem.src;
    lightboxImg.alt = currentItem.caption;
    lightboxCaption.textContent = currentItem.caption;
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryItems.length}`;
  }

  // Buka lightbox
  function openLightbox(index) {
    updateLightbox(index);
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Kunci scroll halaman saat lightbox aktif
  }

  // Tutup lightbox
  function closeLightbox() {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Kembalikan scroll halaman
  }

  // Navigasi sebelumnya & berikutnya
  function prevImage() {
    updateLightbox(currentImageIndex - 1);
  }

  function nextImage() {
    updateLightbox(currentImageIndex + 1);
  }

  // Pasang event klik pada tiap kartu foto di galeri
  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const index = parseInt(card.getAttribute('data-index'), 10);
      openLightbox(index);
    });
  });

  // Pasang event tombol lightbox
  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevImage);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextImage);

  // Navigasi keyboard (Escape untuk tutup, Panah Kiri/Kanan untuk ganti foto)
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    }
  });

  // Dukungan Swipe sentuh pada HP
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50; // Jarak minimal usap layar (pixel)
    if (touchEndX < touchStartX - swipeThreshold) {
      nextImage(); // Geser ke kiri -> foto berikutnya
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      prevImage(); // Geser ke kanan -> foto sebelumnya
    }
  }


  /* ==========================================================================
     6. ANIMASI MUNCUL HALUS SAAT SCROLL (SCROLL REVEAL)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Hanya animasikan sekali
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback jika browser lawas tidak mendukung IntersectionObserver
    revealElements.forEach(el => el.classList.add('active'));
  }

});
