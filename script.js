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
    "src": "assets/galeri/galeri_01.jpg",
    "category": "Pementasan Budaya",
    "catKey": "pementasan",
    "title": "Gelar Karya Budaya Tungga Production #1",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_02.jpg",
    "category": "Penari & Busana",
    "catKey": "penari",
    "title": "Pesona Penari Berbusana Adat #2",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_03.jpg",
    "category": "Pementasan Budaya",
    "catKey": "pementasan",
    "title": "Gelar Karya Budaya Tungga Production #3",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_04.jpg",
    "category": "Pementasan Budaya",
    "catKey": "pementasan",
    "title": "Gelar Karya Budaya Tungga Production #4",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_05.jpg",
    "category": "Seni & Tradisi",
    "catKey": "karya",
    "title": "Harmoni Cipta Seni Nusantara #5",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_06.jpg",
    "category": "Pementasan Panggung",
    "catKey": "pementasan",
    "title": "Momen Panggung Seni Budaya #6",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_07.jpg",
    "category": "Kostum & Rias Siger",
    "catKey": "penari",
    "title": "Keanggunan Busana & Mahkota Siger #7",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_08.jpg",
    "category": "Kegiatan Sanggar",
    "catKey": "latihan",
    "title": "Dokumentasi Kegiatan Seni #8",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_09.jpg",
    "category": "Seni & Tradisi",
    "catKey": "karya",
    "title": "Harmoni Cipta Seni Nusantara #9",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_10.jpg",
    "category": "Pementasan Panggung",
    "catKey": "pementasan",
    "title": "Momen Panggung Seni Budaya #10",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_11.jpg",
    "category": "Kostum & Rias Siger",
    "catKey": "penari",
    "title": "Keanggunan Busana & Mahkota Siger #11",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_12.jpg",
    "category": "Kegiatan Sanggar",
    "catKey": "latihan",
    "title": "Dokumentasi Kegiatan Seni #12",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_13.jpg",
    "category": "Seni & Tradisi",
    "catKey": "karya",
    "title": "Harmoni Cipta Seni Nusantara #13",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_14.jpg",
    "category": "Pementasan Panggung",
    "catKey": "pementasan",
    "title": "Momen Panggung Seni Budaya #14",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_15.jpg",
    "category": "Kostum & Rias Siger",
    "catKey": "penari",
    "title": "Keanggunan Busana & Mahkota Siger #15",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_16.jpg",
    "category": "Kegiatan Sanggar",
    "catKey": "latihan",
    "title": "Dokumentasi Kegiatan Seni #16",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_17.jpg",
    "category": "Seni & Tradisi",
    "catKey": "karya",
    "title": "Harmoni Cipta Seni Nusantara #17",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_18.jpg",
    "category": "Pementasan Panggung",
    "catKey": "pementasan",
    "title": "Momen Panggung Seni Budaya #18",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_19.jpg",
    "category": "Kostum & Rias Siger",
    "catKey": "penari",
    "title": "Keanggunan Busana & Mahkota Siger #19",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_20.jpg",
    "category": "Kegiatan Sanggar",
    "catKey": "latihan",
    "title": "Dokumentasi Kegiatan Seni #20",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_21.jpg",
    "category": "Seni & Tradisi",
    "catKey": "karya",
    "title": "Harmoni Cipta Seni Nusantara #21",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_22.jpg",
    "category": "Pementasan Panggung",
    "catKey": "pementasan",
    "title": "Momen Panggung Seni Budaya #22",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_23.jpg",
    "category": "Kostum & Rias Siger",
    "catKey": "penari",
    "title": "Keanggunan Busana & Mahkota Siger #23",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_24.jpg",
    "category": "Kegiatan Sanggar",
    "catKey": "latihan",
    "title": "Dokumentasi Kegiatan Seni #24",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_25.jpg",
    "category": "Seni & Tradisi",
    "catKey": "karya",
    "title": "Harmoni Cipta Seni Nusantara #25",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_26.jpg",
    "category": "Pementasan Panggung",
    "catKey": "pementasan",
    "title": "Momen Panggung Seni Budaya #26",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_27.jpg",
    "category": "Kostum & Rias Siger",
    "catKey": "penari",
    "title": "Keanggunan Busana & Mahkota Siger #27",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_28.jpg",
    "category": "Kegiatan Sanggar",
    "catKey": "latihan",
    "title": "Dokumentasi Kegiatan Seni #28",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_29.jpg",
    "category": "Seni & Tradisi",
    "catKey": "karya",
    "title": "Harmoni Cipta Seni Nusantara #29",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_30.jpg",
    "category": "Pementasan Panggung",
    "catKey": "pementasan",
    "title": "Momen Panggung Seni Budaya #30",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_31.jpg",
    "category": "Kostum & Rias Siger",
    "catKey": "penari",
    "title": "Keanggunan Busana & Mahkota Siger #31",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_32.jpg",
    "category": "Kegiatan Sanggar",
    "catKey": "latihan",
    "title": "Dokumentasi Kegiatan Seni #32",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_33.jpg",
    "category": "Seni & Tradisi",
    "catKey": "karya",
    "title": "Harmoni Cipta Seni Nusantara #33",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_34.jpg",
    "category": "Pementasan Panggung",
    "catKey": "pementasan",
    "title": "Momen Panggung Seni Budaya #34",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_35.jpg",
    "category": "Kostum & Rias Siger",
    "catKey": "penari",
    "title": "Keanggunan Busana & Mahkota Siger #35",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_36.jpg",
    "category": "Kegiatan Sanggar",
    "catKey": "latihan",
    "title": "Dokumentasi Kegiatan Seni #36",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_37.jpg",
    "category": "Seni & Tradisi",
    "catKey": "karya",
    "title": "Harmoni Cipta Seni Nusantara #37",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_38.jpg",
    "category": "Pementasan Panggung",
    "catKey": "pementasan",
    "title": "Momen Panggung Seni Budaya #38",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_39.jpg",
    "category": "Kostum & Rias Siger",
    "catKey": "penari",
    "title": "Keanggunan Busana & Mahkota Siger #39",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_40.jpg",
    "category": "Kegiatan Sanggar",
    "catKey": "latihan",
    "title": "Dokumentasi Kegiatan Seni #40",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_41.jpg",
    "category": "Seni & Tradisi",
    "catKey": "karya",
    "title": "Harmoni Cipta Seni Nusantara #41",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  },
  {
    "src": "assets/galeri/galeri_42.jpg",
    "category": "Pementasan Panggung",
    "catKey": "pementasan",
    "title": "Momen Panggung Seni Budaya #42",
    "desc": "Dokumentasi resmi Sanggar Tungga Production pada perhelatan seni budaya daerah Lampung & Nusantara."
  }
];

  /* ----------------------------------------------------
     2. Dynamic Gallery Rendering & Filtering (42 Photos)
     ---------------------------------------------------- */
  const galleryGrid = document.getElementById('gallery-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const btnLoadMore = document.getElementById('btn-load-more');
  const loadedCountSpan = document.getElementById('gallery-loaded-count');
  const totalCountSpan = document.getElementById('gallery-total-count');
  const loadMoreContainer = document.getElementById('gallery-load-more-container');

  const BATCH_SIZE = 12;
  let currentFilter = 'all';
  let displayedItemsCount = 0;
  let activeFilteredList = [...galleryData];

  // Function to create a gallery card DOM element
  const createGalleryCard = (item, globalIndex) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'gallery-item';
    cardEl.setAttribute('data-category', item.catKey);
    cardEl.setAttribute('data-index', globalIndex);

    cardEl.innerHTML = `
      <div class="gallery-card">
        <div class="gallery-img-container">
          <img src="${item.src}" alt="${item.title}" loading="lazy">
          <div class="gallery-overlay">
            <div class="overlay-content">
              <span class="gallery-tag">${item.category}</span>
              <h3 class="gallery-caption-title">${item.title}</h3>
              <p class="gallery-caption-sub">${item.desc}</p>
              <span class="view-btn"><i class="fa-solid fa-expand"></i> Perbesar Foto</span>
            </div>
          </div>
        </div>
      </div>
    `;

    cardEl.addEventListener('click', () => {
      openLightbox(globalIndex);
    });

    return cardEl;
  };

  // Render more items into gallery
  const renderGalleryBatch = () => {
    if (!galleryGrid) return;

    const nextBatch = activeFilteredList.slice(displayedItemsCount, displayedItemsCount + BATCH_SIZE);
    const fragment = document.createDocumentFragment();

    nextBatch.forEach((item) => {
      // Find original index in galleryData for lightbox navigation
      const origIndex = galleryData.indexOf(item);
      const card = createGalleryCard(item, origIndex >= 0 ? origIndex : 0);
      fragment.appendChild(card);
    });

    galleryGrid.appendChild(fragment);
    displayedItemsCount += nextBatch.length;

    // Update counters
    if (loadedCountSpan) loadedCountSpan.textContent = displayedItemsCount;
    if (totalCountSpan) totalCountSpan.textContent = activeFilteredList.length;

    // Hide or show load more button
    if (loadMoreContainer) {
      if (displayedItemsCount >= activeFilteredList.length) {
        loadMoreContainer.style.display = 'none';
      } else {
        loadMoreContainer.style.display = 'block';
      }
    }
  };

  // Apply category filter
  const applyFilter = (filterKey) => {
    currentFilter = filterKey;
    if (filterKey === 'all') {
      activeFilteredList = [...galleryData];
    } else {
      activeFilteredList = galleryData.filter(item => item.catKey === filterKey);
    }

    if (galleryGrid) galleryGrid.innerHTML = '';
    displayedItemsCount = 0;
    renderGalleryBatch();
  };

  // Filter button click listeners
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterKey = btn.getAttribute('data-filter');
      applyFilter(filterKey);
    });
  });

  // Load More button click listener
  if (btnLoadMore) {
    btnLoadMore.addEventListener('click', () => {
      renderGalleryBatch();
    });
  }

  // Initial gallery render
  applyFilter('all');

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

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevPhoto);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextPhoto);

  // Keyboard navigation for Lightbox
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevPhoto();
    if (e.key === 'ArrowRight') showNextPhoto();
  });

  // Touch Swipe for mobile devices
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
      const waNumber = '6289669626831';
      const textMessage = 
`*KONFIRMASI BOOKING / KONSULTASI TUNGGA PRODUCTION*
----------------------------------------
*Nama / Instansi:* ${name}
*No. WhatsApp:* ${phone}
*Layanan Yang Diminati:* ${service}
*Rencana Tanggal Acara:* ${formattedDate}
${message ? `*Catatan / Detail Acara:* \n${message}` : ''}
----------------------------------------
Halo Tim Tungga Production, mohon informasi ketersediaan jadwal dan penawaran untuk rencana pementasan di atas. Terima kasih! 🙏✨`;

      const encodedText = encodeURIComponent(textMessage);
      const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;

      showToast('Menghubungkan langsung ke WhatsApp Tungga Production...');

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

  /* ----------------------------------------------------
     6. Biodata Tim & Pelatih Modal Functionality
     ---------------------------------------------------- */
  const teamData = {
    ketua: {
      name: 'Noviza Juwita',
      roleTag: 'Ketua Sanggar',
      title: 'Ketua & Pimpinan Sanggar Tungga Production',
      icon: 'fa-solid fa-crown',
      avatar: 'assets/profile/tim_ketua.jpg',
      origin: 'Pekon Kelungu, Kec. Kotaagung, Kab. Tanggamus, Lampung',
      specialty: 'Koreografi Tradisi Lampung & Manajemen Seni Pertunjukan',
      experience: '10+ Tahun Mengabdi di Bidang Seni Budaya',
      achieve: 'Inisiator Gelar Karya Budaya "Bhavana Eka Culture"',
      desc: 'Noviza Juwita merupakan pendiri sekaligus ketua yang mendedikasikan hidupnya untuk pelestarian seni tari dan kebudayaan daerah Lampung. Beliau aktif memimpin program regenerasi seni tari untuk anak-anak dan remaja di Sanggar Tungga Production, serta memimpin pementasan resmi di berbagai agenda tingkat kabupaten hingga nasional.',
      quote: '"Budaya bukanlah benda mati yang tersimpan di museum, melainkan napas kehidupan yang harus terus ditarikan dan dibanggakan oleh generasi penerus bangsa."'
    },
    pembina: {
      name: 'Dra. Hj. Siti Rohmah',
      roleTag: 'Pembina Sanggar',
      title: 'Pembina & Penasihat Seni Budaya',
      icon: 'fa-solid fa-landmark',
      avatar: 'assets/profile/tim_pembina.jpg',
      origin: 'Kotaagung, Tanggamus, Lampung',
      specialty: 'Pembinaan Karakter & Pakem Adat Kebudayaan',
      experience: '15+ Tahun Pengabdian Seni & Pendidikan',
      achieve: 'Pembina Kolaborasi Kemendikbud & Pemkab Tanggamus',
      desc: 'Dra. Hj. Siti Rohmah berperan penting sebagai pembina moral dan intelektual sanggar. Mengarahkan keselarasan antara inovasi seni modern dan kearifan nilai-nilai tradisi leluhur adat Lampung (Piil Pesenggiri) agar selalu tercermin dalam setiap langkah gerak penari.',
      quote: '"Menjaga keaslian tradisi dengan hati yang tulus adalah jalan terbaik memuliakan marwah budaya bangsa kita."'
    },
    penasihat: {
      name: 'H. Hendra, S.Kom',
      roleTag: 'Penasihat Produksi',
      title: 'Penasihat & Koordinator Produksi Panggung',
      icon: 'fa-solid fa-award',
      avatar: 'assets/profile/tim_penasihat.jpg',
      origin: 'Tanggamus, Lampung',
      specialty: 'Manajemen Panggung & Tata Kelola Acara',
      experience: '12+ Tahun di Bidang Produksi Event & Seni',
      achieve: 'Koordinator Produksi Gelar Karya Budaya 2026',
      desc: 'H. Hendra, S.Kom bertanggung jawab atas manajemen panggung, koordinasi teknis pementasan kolosal, logistik kesenian, dan legalitas sanggar. Memastikan setiap pertunjukan Sanggar Tungga Production berjalan megah, tepat waktu, dan berstandar profesional.',
      quote: '"Pertunjukan yang memukau lahir dari perpaduan antara disiplin manajemen di balik panggung dan keindahan rasa di atas panggung."'
    },
    'penata-rias': {
      name: 'Anisa Larasati',
      roleTag: 'Penata Rias & Busana',
      title: 'Penata Busana Adat & Mahkota Siger',
      icon: 'fa-solid fa-gem',
      avatar: 'assets/galeri/galeri_02.jpg',
      origin: 'Tanggamus, Lampung',
      specialty: 'Rias Pengantin Adat & Pemasangan Siger Emas',
      experience: '8+ Tahun Penata Rias Seni Panggung',
      achieve: 'Pengelola 200+ Busana Adat & Mahkota Tradisi',
      desc: 'Anisa Larasati memiliki keahlian mendalam dalam tata rias tradisional Lampung, tata busana kain tapis bersulam benang emas, dan teknik pemasangan mahkota siger yang kokoh namun anggun. Beliau memastikan setiap penari tampil memesona dengan pesona kemewahan adat.',
      quote: '"Setiap helai kain tapis dan kilau mahkota siger memiliki jiwa kehormatan yang memancarkan pesona sejati tanah Lampung."'
    }
  };

  const biodataModal = document.getElementById('biodata-modal');
  const biodataClose = document.getElementById('biodata-close');
  const biodataBackdrop = document.getElementById('biodata-backdrop');
  const bioAvatar = document.getElementById('bio-avatar');
  const bioAvatarIcon = document.getElementById('bio-avatar-icon');
  const bioRoleTag = document.getElementById('bio-role-tag');
  const bioName = document.getElementById('bio-name');
  const bioTitle = document.getElementById('bio-title');
  const bioDesc = document.getElementById('bio-desc');
  const bioOrigin = document.getElementById('bio-origin');
  const bioSpecialty = document.getElementById('bio-specialty');
  const bioExperience = document.getElementById('bio-experience');
  const bioAchieve = document.getElementById('bio-achieve');
  const bioQuote = document.getElementById('bio-quote');

  const openBiodata = (memberKey) => {
    const data = teamData[memberKey];
    if (!data || !biodataModal) return;

    if (bioAvatar) {
      bioAvatar.src = data.avatar;
      bioAvatar.alt = data.name;
    }
    if (bioAvatarIcon && data.icon) {
      bioAvatarIcon.className = data.icon + ' biodata-avatar-icon';
    }
    bioRoleTag.textContent = data.roleTag;
    bioName.textContent = data.name;
    bioTitle.textContent = data.title;
    bioDesc.textContent = data.desc;
    bioOrigin.textContent = data.origin;
    bioSpecialty.textContent = data.specialty;
    bioExperience.textContent = data.experience;
    bioAchieve.textContent = data.achieve;
    bioQuote.textContent = data.quote;

    biodataModal.classList.add('active');
    biodataModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeBiodata = () => {
    if (!biodataModal) return;
    biodataModal.classList.remove('active');
    biodataModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Add click listeners to team cards & bio buttons
  const teamCards = document.querySelectorAll('.team-card');
  teamCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      const memberKey = card.getAttribute('data-member');
      openBiodata(memberKey);
    });
  });

  const bioButtons = document.querySelectorAll('.btn-profile-bio');
  bioButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const memberKey = btn.getAttribute('data-member');
      openBiodata(memberKey);
    });
  });

  if (biodataClose) biodataClose.addEventListener('click', closeBiodata);
  if (biodataBackdrop) biodataBackdrop.addEventListener('click', closeBiodata);

  // Close biodata on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && biodataModal && biodataModal.classList.contains('active')) {
      closeBiodata();
    }
  });

  /* ----------------------------------------------------
     7. Hero Background Slideshow (Subtle Auto Crossfade)
     ---------------------------------------------------- */
  const heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1) {
    let currentHeroIndex = 0;
    setInterval(() => {
      heroSlides[currentHeroIndex].classList.remove('active');
      currentHeroIndex = (currentHeroIndex + 1) % heroSlides.length;
      heroSlides[currentHeroIndex].classList.add('active');
    }, 4500);
  }

  console.log('Tungga Production website successfully initialized.');
});
