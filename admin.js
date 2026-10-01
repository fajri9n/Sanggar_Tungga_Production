/**
 * TANGGA PRODUCTION - ADMIN DASHBOARD JAVASCRIPT (admin.js)
 * Live Visitor Monitoring & Analytics Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let currentRange = 'all';
  let searchQuery = '';
  let deviceFilter = 'all';
  let sourceFilter = 'all';
  let currentPage = 1;
  const itemsPerPage = 15;

  let trafficChartInstance = null;
  let deviceChartInstance = null;

  // DOM Elements - Auth
  const authOverlay = document.getElementById('admin-auth-overlay');
  const authCard = document.getElementById('auth-card');
  const authForm = document.getElementById('auth-form');
  const authPassword = document.getElementById('auth-password');
  const authToggleEye = document.getElementById('auth-toggle-eye');
  const authError = document.getElementById('auth-error');
  const btnLogout = document.getElementById('btn-logout');
  const quickFillBtn = document.getElementById('quick-fill-btn');

  // DOM Elements - Top Bar & Actions
  const clockEl = document.getElementById('admin-clock');
  const btnRefresh = document.getElementById('btn-refresh');
  const btnExport = document.getElementById('btn-export');
  const btnClearLogs = document.getElementById('btn-clear-logs');

  // DOM Elements - Confirmation Modal
  const clearModal = document.getElementById('clear-modal');
  const btnCancelClear = document.getElementById('btn-cancel-clear');
  const btnConfirmClear = document.getElementById('btn-confirm-clear');

  // DOM Elements - Filter Pills
  const filterPillButtons = document.querySelectorAll('.filter-pill-btn');

  // DOM Elements - Table
  const tableSearchInput = document.getElementById('table-search');
  const filterDeviceSelect = document.getElementById('filter-device');
  const filterSourceSelect = document.getElementById('filter-source');
  const tableBody = document.getElementById('visitor-table-body');
  const tableCountInfo = document.getElementById('table-count-info');
  const btnPrevPage = document.getElementById('btn-prev-page');
  const btnNextPage = document.getElementById('btn-next-page');
  const pageIndicator = document.getElementById('page-indicator');

  /* ----------------------------------------------------
     1. Authentication Handling
     ---------------------------------------------------- */
  const checkAuth = () => {
    const isAuth = sessionStorage.getItem('sanggar_admin_auth');
    if (isAuth === 'true') {
      authOverlay.classList.add('hidden');
      initDashboard();
    } else {
      authOverlay.classList.remove('hidden');
      if (authPassword) authPassword.focus();
    }
  };

  if (authToggleEye && authPassword) {
    authToggleEye.addEventListener('click', () => {
      const type = authPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      authPassword.setAttribute('type', type);
      authToggleEye.innerHTML = type === 'password'
        ? '<i class="fa-solid fa-eye"></i>'
        : '<i class="fa-solid fa-eye-slash"></i>';
    });
  }

  if (quickFillBtn && authPassword) {
    quickFillBtn.addEventListener('click', () => {
      authPassword.value = 'admin123';
      authError.classList.remove('show');
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPass = authPassword.value.trim();

      // Password: admin123
      if (enteredPass === 'admin123' || enteredPass === 'sanggar2026') {
        sessionStorage.setItem('sanggar_admin_auth', 'true');
        authError.classList.remove('show');
        authOverlay.classList.add('hidden');
        initDashboard();
      } else {
        authError.classList.add('show');
        authCard.classList.remove('shake');
        void authCard.offsetWidth; // Trigger reflow
        authCard.classList.add('shake');
        authPassword.select();
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('sanggar_admin_auth');
      checkAuth();
    });
  }

  /* ----------------------------------------------------
     2. Real-time Clock (WIB)
     ---------------------------------------------------- */
  const updateClock = () => {
    if (!clockEl) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${mins}:${secs} WIB`;
  };
  setInterval(updateClock, 1000);
  updateClock();

  /* ----------------------------------------------------
     3. Dashboard Data & KPI Cards
     ---------------------------------------------------- */
  const renderKPIs = (summary) => {
    const kpiTotal = document.getElementById('kpi-total-pageviews');
    const kpiUnique = document.getElementById('kpi-unique-visitors');
    const kpiToday = document.getElementById('kpi-today-visits');
    const kpiDevice = document.getElementById('kpi-device-dominant');
    const kpiDeviceSub = document.getElementById('kpi-device-sub');

    if (kpiTotal) kpiTotal.textContent = summary.totalPageviews.toLocaleString('id-ID');
    if (kpiUnique) kpiUnique.textContent = summary.uniqueVisitors.toLocaleString('id-ID');
    if (kpiToday) kpiToday.textContent = summary.todayVisits.toLocaleString('id-ID');

    // Calculate dominant device
    const devs = summary.devices || { Smartphone: 0, Desktop: 0, Tablet: 0 };
    const totalDevs = (devs.Smartphone || 0) + (devs.Desktop || 0) + (devs.Tablet || 0);
    const smartPct = totalDevs > 0 ? Math.round(((devs.Smartphone || 0) / totalDevs) * 100) : 0;

    if (kpiDevice) kpiDevice.textContent = totalDevs > 0 ? `${smartPct}%` : '0%';
    if (kpiDeviceSub) kpiDeviceSub.textContent = totalDevs > 0 ? `Smartphone (${devs.Smartphone || 0} pengguna)` : 'Menunggu pengunjung';
  };

  /* ----------------------------------------------------
     4. Render Interactive Charts
     ---------------------------------------------------- */
  const renderCharts = (summary) => {
    if (typeof Chart === 'undefined') {
      const trafficCanvas = document.getElementById('chart-traffic');
      if (trafficCanvas && trafficCanvas.parentElement) {
        const ctx = trafficCanvas.getContext('2d');
        const width = (trafficCanvas.width = trafficCanvas.parentElement.clientWidth || 500);
        const height = (trafficCanvas.height = 240);
        const labels = Object.keys(summary.dailyStats);
        const dataValues = Object.values(summary.dailyStats);
        const maxVal = Math.max(...dataValues, 5);
        ctx.clearRect(0, 0, width, height);

        const barWidth = (width - 60) / labels.length;
        labels.forEach((lbl, i) => {
          const val = dataValues[i];
          const h = (val / maxVal) * 150;
          const x = 40 + i * barWidth;
          const y = 190 - h;

          ctx.fillStyle = 'rgba(212, 175, 55, 0.75)';
          ctx.fillRect(x + 4, y, barWidth - 8, h);

          ctx.fillStyle = '#fceda2';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(String(val), x + barWidth / 2, y - 6);

          ctx.fillStyle = '#a39e93';
          ctx.font = '11px sans-serif';
          ctx.fillText(lbl, x + barWidth / 2, 210);
        });
      }
      return;
    }

    // Chart 1: Traffic Line Chart
    const trafficCanvas = document.getElementById('chart-traffic');
    if (trafficCanvas) {
      const labels = Object.keys(summary.dailyStats);
      const dataValues = Object.values(summary.dailyStats);

      if (trafficChartInstance) {
        trafficChartInstance.destroy();
      }

      const ctx = trafficCanvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 260);
      gradient.addColorStop(0, 'rgba(212, 175, 55, 0.45)');
      gradient.addColorStop(1, 'rgba(212, 175, 55, 0.01)');

      trafficChartInstance = new Chart(trafficCanvas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Kunjungan Harian',
            data: dataValues,
            borderColor: '#d4af37',
            borderWidth: 2.5,
            pointBackgroundColor: '#fceda2',
            pointBorderColor: '#9e7a1e',
            pointRadius: 4.5,
            pointHoverRadius: 7,
            backgroundColor: gradient,
            fill: true,
            tension: 0.38
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(20, 18, 14, 0.95)',
              titleColor: '#f7e096',
              bodyColor: '#ffffff',
              borderColor: 'rgba(212, 175, 55, 0.4)',
              borderWidth: 1,
              padding: 10,
              displayColors: false,
              callbacks: {
                label: (context) => ` ${context.parsed.y} kunjungan`
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#a39e93', font: { size: 11 } }
            },
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: {
                color: '#a39e93',
                font: { size: 11 },
                precision: 0
              }
            }
          }
        }
      });
    }

    // Chart 2: Devices Donut Chart
    const deviceCanvas = document.getElementById('chart-devices');
    if (deviceCanvas) {
      const devs = summary.devices || { Smartphone: 0, Desktop: 0, Tablet: 0 };
      const labels = ['Smartphone', 'Desktop', 'Tablet'];
      const dataValues = [devs.Smartphone || 0, devs.Desktop || 0, devs.Tablet || 0];

      if (deviceChartInstance) {
        deviceChartInstance.destroy();
      }

      deviceChartInstance = new Chart(deviceCanvas, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: dataValues,
            backgroundColor: ['#d4af37', '#9e7a1e', '#eab308'],
            borderColor: '#14120e',
            borderWidth: 3,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#f3f0e8',
                font: { size: 12 },
                padding: 16,
                usePointStyle: true
              }
            },
            tooltip: {
              backgroundColor: 'rgba(20, 18, 14, 0.95)',
              titleColor: '#f7e096',
              bodyColor: '#ffffff',
              borderColor: 'rgba(212, 175, 55, 0.4)',
              borderWidth: 1,
              padding: 10
            }
          }
        }
      });
    }
  };

  /* ----------------------------------------------------
     5. Render Secondary Stat Bars (Browsers & Sources)
     ---------------------------------------------------- */
  const renderSecondaryStats = (summary) => {
    // Browsers
    const browserContainer = document.getElementById('stats-browsers');
    if (browserContainer) {
      const browsers = summary.browsers || {};
      const sorted = Object.entries(browsers).sort((a, b) => b[1] - a[1]).slice(0, 4);
      const total = summary.totalPageviews || 1;

      browserContainer.innerHTML = sorted.length > 0 ? sorted.map(([name, count]) => {
        const pct = Math.round((count / total) * 100);
        let icon = 'fa-globe';
        if (name.includes('Chrome')) icon = 'fa-chrome';
        else if (name.includes('Safari')) icon = 'fa-safari';
        else if (name.includes('Edge')) icon = 'fa-edge';
        else if (name.includes('Firefox')) icon = 'fa-firefox-browser';

        return `
          <div class="stats-list-item">
            <div class="stats-list-header">
              <span class="stats-list-label"><i class="fa-brands ${icon} text-gold"></i> ${name}</span>
              <span class="stats-list-val">${count} <small>(${pct}%)</small></span>
            </div>
            <div class="stats-bar-track">
              <div class="stats-bar-fill" style="width: ${pct}%"></div>
            </div>
          </div>
        `;
      }).join('') : '<p style="font-size:0.8rem;color:var(--text-muted);padding:8px 0;"><i class="fa-solid fa-clock-rotate-left"></i> Belum ada data browser riil.</p>';
    }

    // Sources
    const sourceContainer = document.getElementById('stats-sources');
    if (sourceContainer) {
      const sources = summary.sources || {};
      const sorted = Object.entries(sources).sort((a, b) => b[1] - a[1]).slice(0, 4);
      const total = summary.totalPageviews || 1;

      sourceContainer.innerHTML = sorted.length > 0 ? sorted.map(([name, count]) => {
        const pct = Math.round((count / total) * 100);
        let icon = 'fa-link';
        if (name.includes('Instagram')) icon = 'fa-instagram';
        else if (name.includes('WhatsApp')) icon = 'fa-whatsapp';
        else if (name.includes('Google')) icon = 'fa-google';
        else if (name.includes('TikTok')) icon = 'fa-tiktok';

        return `
          <div class="stats-list-item">
            <div class="stats-list-header">
              <span class="stats-list-label"><i class="fa-brands ${icon} text-gold"></i> ${name}</span>
              <span class="stats-list-val">${count} <small>(${pct}%)</small></span>
            </div>
            <div class="stats-bar-track">
              <div class="stats-bar-fill" style="width: ${pct}%"></div>
            </div>
          </div>
        `;
      }).join('') : '<p style="font-size:0.8rem;color:var(--text-muted);padding:8px 0;"><i class="fa-solid fa-clock-rotate-left"></i> Belum ada data rujukan riil.</p>';
    }
  };

  /* ----------------------------------------------------
     6. Render Visitor Table with Search & Pagination
     ---------------------------------------------------- */
  const renderTable = (logs) => {
    if (!tableBody) return;

    // Filter by Search Query
    let filtered = logs.filter((log) => {
      const query = searchQuery.toLowerCase();
      const matchSearch = (
        log.ip.toLowerCase().includes(query) ||
        log.city.toLowerCase().includes(query) ||
        log.region.toLowerCase().includes(query) ||
        log.os.toLowerCase().includes(query) ||
        log.browser.toLowerCase().includes(query) ||
        log.source.toLowerCase().includes(query) ||
        log.timeFormatted.toLowerCase().includes(query)
      );

      // Filter by Device
      const matchDevice = deviceFilter === 'all' || log.deviceType.toLowerCase() === deviceFilter.toLowerCase();

      // Filter by Source
      const matchSource = sourceFilter === 'all' || log.source.toLowerCase().includes(sourceFilter.toLowerCase());

      return matchSearch && matchDevice && matchSource;
    });

    const totalFiltered = filtered.length;
    const totalPages = Math.ceil(totalFiltered / itemsPerPage) || 1;

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageItems = filtered.slice(startIdx, startIdx + itemsPerPage);

    // Update Pagination indicators
    if (tableCountInfo) {
      tableCountInfo.textContent = `Menampilkan ${pageItems.length > 0 ? startIdx + 1 : 0} - ${startIdx + pageItems.length} dari ${totalFiltered} entri log`;
    }
    if (pageIndicator) {
      pageIndicator.textContent = `Halaman ${currentPage} / ${totalPages}`;
    }
    if (btnPrevPage) btnPrevPage.disabled = currentPage <= 1;
    if (btnNextPage) btnNextPage.disabled = currentPage >= totalPages;

    if (pageItems.length === 0) {
      const isSearching = searchQuery || deviceFilter !== 'all' || sourceFilter !== 'all';
      const emptyMsg = isSearching
        ? 'Tidak ada log pengunjung yang sesuai dengan filter pencarian.'
        : 'Belum ada riwayat kunjungan riil yang tercatat.<br><span style="font-size:0.78rem;color:var(--text-muted);display:block;margin-top:6px;">Data kunjungan nyata (IP, Kota, Perangkat, Browser) akan otomatis masuk ke tabel ini begitu ada pengunjung yang membuka website utama.</span>';

      tableBody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="table-empty-state">
              <i class="fa-solid fa-users-viewfinder text-gold" style="font-size:2rem;margin-bottom:10px;display:block;"></i>
              <p>${emptyMsg}</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = pageItems.map((log, index) => {
      const isOnline = log.status === 'Online Sekarang';
      const statusHtml = isOnline
        ? `<span class="status-tag online"><span class="status-dot"></span> Online</span>`
        : `<span class="status-tag completed"><i class="fa-solid fa-check"></i> Selesai</span>`;

      let devIcon = 'fa-mobile-screen';
      if (log.deviceType === 'Desktop') devIcon = 'fa-desktop';
      else if (log.deviceType === 'Tablet') devIcon = 'fa-tablet-screen-button';

      let srcClass = '';
      let srcIcon = 'fa-link';
      if (log.source.includes('Instagram')) { srcClass = 'ig'; srcIcon = 'fa-instagram'; }
      else if (log.source.includes('WhatsApp')) { srcClass = 'wa'; srcIcon = 'fa-whatsapp'; }
      else if (log.source.includes('Google')) { srcClass = 'google'; srcIcon = 'fa-google'; }

      return `
        <tr>
          <td><span class="text-gold-light" style="font-weight:700;">#${startIdx + index + 1}</span></td>
          <td>
            <div style="font-weight:600; color:#fff;">${log.timeFormatted.split(',')[1] || log.timeFormatted}</div>
            <div style="font-size:0.72rem; color:#a39e93;">${log.timeFormatted.split(',')[0]}</div>
          </td>
          <td>
            <div class="loc-badge"><i class="fa-solid fa-location-dot text-gold"></i> ${log.city}</div>
            <div style="font-size:0.72rem; color:#a39e93; margin-top:2px;">
              <span class="ip-badge">${log.ip}</span> • ${log.isp || log.region}
            </div>
          </td>
          <td>
            <span class="device-badge">
              <i class="fa-solid ${devIcon}"></i> ${log.deviceType}
            </span>
            <div style="font-size:0.72rem; color:#a39e93; margin-top:3px;">${log.os} (${log.screenRes})</div>
          </td>
          <td>
            <div style="color:#ffffff; font-weight:500;">${log.browser}</div>
          </td>
          <td>
            <span class="source-badge ${srcClass}">
              <i class="fa-brands ${srcIcon}"></i> ${log.source}
            </span>
          </td>
          <td>${statusHtml}</td>
        </tr>
      `;
    }).join('');
  };

  /* ----------------------------------------------------
     7. Refresh & Re-render Dashboard
     ---------------------------------------------------- */
  const initDashboard = () => {
    if (!window.SanggarTracker) return;

    const summary = window.SanggarTracker.getAnalyticsSummary(currentRange);
    renderKPIs(summary);
    renderCharts(summary);
    renderSecondaryStats(summary);
    renderTable(summary.filteredLogs);
  };

  /* ----------------------------------------------------
     8. Event Listeners & Controls
     ---------------------------------------------------- */
  // Time Range Filter
  filterPillButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterPillButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentRange = btn.getAttribute('data-range') || 'all';
      currentPage = 1;
      initDashboard();
    });
  });

  // Table Search Input
  if (tableSearchInput) {
    tableSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      currentPage = 1;
      initDashboard();
    });
  }

  // Device Filter
  if (filterDeviceSelect) {
    filterDeviceSelect.addEventListener('change', (e) => {
      deviceFilter = e.target.value;
      currentPage = 1;
      initDashboard();
    });
  }

  // Source Filter
  if (filterSourceSelect) {
    filterSourceSelect.addEventListener('change', (e) => {
      sourceFilter = e.target.value;
      currentPage = 1;
      initDashboard();
    });
  }

  // Pagination Prev / Next
  if (btnPrevPage) {
    btnPrevPage.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        initDashboard();
      }
    });
  }
  if (btnNextPage) {
    btnNextPage.addEventListener('click', () => {
      currentPage++;
      initDashboard();
    });
  }

  // Refresh Button
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      btnRefresh.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memuat...';
      setTimeout(() => {
        initDashboard();
        btnRefresh.innerHTML = '<i class="fa-solid fa-rotate"></i> Refresh Data';
      }, 400);
    });
  }

  // Export CSV Button
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      if (window.SanggarTracker) {
        window.SanggarTracker.exportCSV();
      }
    });
  }



  // Clear Logs Modal Controls
  if (btnClearLogs && clearModal) {
    btnClearLogs.addEventListener('click', () => {
      clearModal.classList.add('active');
    });
  }
  if (btnCancelClear && clearModal) {
    btnCancelClear.addEventListener('click', () => {
      clearModal.classList.remove('active');
    });
  }
  if (btnConfirmClear && clearModal) {
    btnConfirmClear.addEventListener('click', () => {
      if (window.SanggarTracker) {
        window.SanggarTracker.clearLogs();
        clearModal.classList.remove('active');
        initDashboard();
      }
    });
  }

  // Initial Check
  checkAuth();
});
