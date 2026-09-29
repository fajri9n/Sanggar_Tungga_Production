/**
 * TANGGA PRODUCTION - SANGGAR SENI & BUDAYA NUSANTARA
 * Main Interactive Javascript (script.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Update Current Year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------
     1. Navigation Bar Scroll Effect & Mobile Hamburger
     ---------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Add scrolled class on page scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close mobile menu on clicking any navigation link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      }
    });

    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      }
    });
  }

  // Active navigation highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const highlightActiveNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightActiveNav);

  /* ----------------------------------------------------
     2. Gallery Items Data & Filtering
     ---------------------------------------------------- */
  const galleryData = [
    {
      src: 'assets/gelar_karya_pentas.jpg',
      category: 'Pementasan Utama',
      catKey: 'tari-tradisi',
      title: 'Gelar Karya Budaya: Bhavana Eka Culture',
      desc: 'Pementasan spektakuler Sanggar Tangga Production bersama seluruh penari cilik, remaja, dan jajaran pembina sanggar seni.'
    },
    {
      src: 'assets/penari_cilik_siger.jpg',
      category: 'Kelas & Latihan',
      catKey: 'workshop',
      title: 'Sembah Penari Cilik Bersiger Emas',
      desc: 'Generasi muda Sanggar Tangga Production berbusana kebaya putih dengan mahkota siger keemasan khas kebanggaan daerah.'
    },
    {
      src: 'assets/sertifikat_budaya.jpg',
      category: 'Apresiasi & Legalitas',
      catKey: 'seremoni',
      title: 'Sertifikat Gelar Karya Budaya',
      desc: 'Penyerahan piagam apresiasi resmi dan sertifikat pementasan seni budaya Sanggar Tangga Production.'
    },
    {
      src: 'assets/gelar_karya_semangat.jpg',
      category: 'Tari Tradisi',
      catKey: 'tari-tradisi',
      title: 'Semangat Pelestari Budaya Nusantara',
      desc: 'Kekompakan seniman tari dan pengurus Sanggar Tangga Production dalam melestarikan seni budaya daerah di Tanggamus.'
    },
    {
      src: 'assets/gelar_karya_salam.jpg',
      category: 'Tari Kreasi',
      catKey: 'tari-kreasi',
      title: 'Harmoni Panggung Kebersamaan',
      desc: 'Dokumentasi kebersamaan dan pertunjukan tari penuh pesona dari peserta didik sanggar seni.'
    },
    {
      src: 'assets/ceremony.jpg',
      category: 'Pernikahan & Acara',
      catKey: 'seremoni',
      title: 'Tari Penyambutan & Adat Pengantin',
      desc: 'Prosesi tari penyambutan tamu terhormat dan resepsi pernikahan adat bernuansa sakral dan agung.'
    }
  ];

  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          // Add quick scale-up animation
          item.style.animation = 'fadeInItem 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ----------------------------------------------------
     3. Lightbox Modal Preview Functionality
     ---------------------------------------------------- */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-description');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxSpinner = document.getElementById('lightbox-spinner');

  let currentPhotoIndex = 0;

  // Open Lightbox
  const openLightbox = (index) => {
    currentPhotoIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  // Close Lightbox
  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Update image and caption
  const updateLightboxContent = () => {
    const item = galleryData[currentPhotoIndex];
    if (!item) return;

    if (lightboxSpinner) lightboxSpinner.classList.add('show');
    lightboxImg.style.opacity = '0.3';

    // Preload image
    const tempImg = new Image();
    tempImg.src = item.src;
    tempImg.onload = () => {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.title;
      lightboxImg.style.opacity = '1';
      if (lightboxSpinner) lightboxSpinner.classList.remove('show');
    };

    lightboxCategory.textContent = item.category;
    lightboxTitle.textContent = item.title;
    lightboxDesc.textContent = item.desc;
    lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${galleryData.length}`;
  };

  // Navigation handlers
  const showPrevPhoto = () => {
    currentPhotoIndex = (currentPhotoIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  };

  const showNextPhoto = () => {
    currentPhotoIndex = (currentPhotoIndex + 1) % galleryData.length;
    updateLightboxContent();
  };

  // Attach click listeners to gallery cards
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const index = parseInt(item.getAttribute('data-index'), 10);
      openLightbox(index);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevPhoto);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextPhoto);

  // Keyboard navigation for Lightbox
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevPhoto();
    if (e.key === 'ArrowRight') showNextPhoto();
  });

  // Touch Swipe for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;

  lightboxModal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightboxModal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        showPrevPhoto(); // Swiped right
      } else {
        showNextPhoto(); // Swiped left
      }
    }
  };

  /* ----------------------------------------------------
     4. Interactive WhatsApp Consultation Form Handler
     ---------------------------------------------------- */
  const bookingForm = document.getElementById('booking-form');
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');

  const showToast = (message) => {
    if (!toast) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  };

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const date = document.getElementById('form-date').value;
      const service = document.getElementById('form-service').value;
      const message = document.getElementById('form-message').value.trim();

      if (!name || !phone || !service) {
        showToast('Mohon lengkapi data nama, no telepon, dan pilihan layanan.');
        return;
      }

      // Format date for indonesian format
      let formattedDate = 'Belum ditentukan';
      if (date) {
        try {
          const d = new Date(date);
          formattedDate = d.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        } catch (err) {
          formattedDate = date;
        }
      }

      // Construct courteous WhatsApp message template
      const waNumber = '6281234567890';
      const textMessage = 
`*KONFIRMASI BOOKING / KONSULTASI TANGGA PRODUCTION*
----------------------------------------
*Nama / Instansi:* ${name}
*No. WhatsApp:* ${phone}
*Layanan Yang Diminati:* ${service}
*Rencana Tanggal Acara:* ${formattedDate}
${message ? `*Catatan / Detail Acara:* \n${message}` : ''}
----------------------------------------
Halo Tim Tangga Production, mohon informasi ketersediaan jadwal dan penawaran untuk rencana pementasan di atas. Terima kasih! 🙏✨`;

      const encodedText = encodeURIComponent(textMessage);
      const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;

      showToast('Menghubungkan langsung ke WhatsApp Tangga Production...');

      // Open WhatsApp in a new tab after a brief feedback moment
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 600);
    });
  }

  /* ----------------------------------------------------
     5. Animated Number Counters in Hero Section
     ---------------------------------------------------- */
  const metricElements = document.querySelectorAll('.metric-number');
  let animated = false;

  const runCounterAnimation = () => {
    metricElements.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      let start = 0;
      const duration = 1600;
      const stepTime = 30;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          el.textContent = `${target}+`;
          clearInterval(timer);
        } else {
          el.textContent = `${Math.floor(start)}+`;
        }
      }, stepTime);
    });
  };

  // Run on load after slight delay
  setTimeout(() => {
    if (!animated) {
      runCounterAnimation();
      animated = true;
    }
  }, 400);

  console.log('Tangga Production website successfully initialized.');
});
