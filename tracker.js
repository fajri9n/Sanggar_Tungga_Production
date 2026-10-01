/**
 * TANGGA PRODUCTION - REAL VISITOR TRACKER ENGINE
 * 100% Real-time Data Tracking (Tanpa Data Dummy)
 */

(function () {
  const STORAGE_KEY_LOGS = 'sanggar_visitor_logs';
  const STORAGE_KEY_SUMMARY = 'sanggar_analytics_summary';
  const STORAGE_KEY_SESSION = 'sanggar_session_id';

  // Bersihkan data dummy lama jika sebelumnya pernah tersimpan di browser
  try {
    const existing = localStorage.getItem(STORAGE_KEY_LOGS);
    if (existing) {
      const parsed = JSON.parse(existing);
      // Deteksi jika terdapat data dummy bawaan sebelumnya (misal IP dummy 182.1.22.45 atau lokasi Wonoboyo)
      const hasDummy = parsed.some(
        (l) => l.ip === '182.1.22.45' || l.city === 'Talang Padang' || l.city === 'Wonoboyo' || l.id?.startsWith('log_dummy')
      );
      if (hasDummy) {
        localStorage.removeItem(STORAGE_KEY_LOGS);
        localStorage.removeItem(STORAGE_KEY_SUMMARY);
        console.log('[Sanggar Tracker] Data dummy lama berhasil dibersihkan.');
      }
    }
  } catch (e) {
    // Ignore error
  }

  // 1. Deteksi Perangkat, OS, & Browser Asli (Real Client Data)
  function getRealDeviceInfo() {
    const ua = navigator.userAgent;
    let deviceType = 'Desktop';
    let os = 'Windows';
    let browser = 'Google Chrome';

    // Deteksi tipe perangkat asli
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i.test(ua);

    if (isTablet) {
      deviceType = 'Tablet';
    } else if (isMobile || (window.screen.width <= 768 && navigator.maxTouchPoints > 0)) {
      deviceType = 'Smartphone';
    } else {
      deviceType = 'Desktop';
    }

    // Deteksi OS asli
    if (/Windows NT 10.0/i.test(ua)) os = 'Windows 10/11';
    else if (/Windows NT 6.3/i.test(ua)) os = 'Windows 8.1';
    else if (/Windows NT 6.1/i.test(ua)) os = 'Windows 7';
    else if (/Android/i.test(ua)) {
      const match = ua.match(/Android\s([0-9.]+)/i);
      os = match ? `Android ${match[1]}` : 'Android';
    } else if (/iPhone/i.test(ua)) {
      const match = ua.match(/OS\s([0-9_]+)/i);
      os = match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS (iPhone)';
    } else if (/iPad/i.test(ua)) {
      os = 'iPadOS';
    } else if (/Mac OS X/i.test(ua)) {
      os = 'macOS';
    } else if (/Linux/i.test(ua)) {
      os = 'Linux';
    }

    // Deteksi Browser asli
    if (/SamsungBrowser/i.test(ua)) {
      browser = 'Samsung Internet';
    } else if (/FxiOS|Firefox/i.test(ua)) {
      browser = 'Mozilla Firefox';
    } else if (/Edg/i.test(ua)) {
      browser = 'Microsoft Edge';
    } else if (/OPR|Opera/i.test(ua)) {
      browser = 'Opera';
    } else if (/CriOS/i.test(ua)) {
      browser = 'Chrome iOS';
    } else if (/Chrome/i.test(ua)) {
      browser = deviceType === 'Smartphone' ? 'Chrome Mobile' : 'Google Chrome';
    } else if (/Safari/i.test(ua)) {
      browser = deviceType === 'Smartphone' ? 'Safari Mobile' : 'Apple Safari';
    }

    const screenRes = `${window.screen.width} × ${window.screen.height}`;
    const language = navigator.language || 'id-ID';

    return { deviceType, os, browser, screenRes, language };
  }

  // 2. Deteksi Sumber Lalu Lintas / Referrer Asli
  function getRealTrafficSource() {
    const ref = document.referrer;
    if (!ref) return 'Akses Langsung / URL';
    if (ref.includes('instagram.com') || ref.includes('l.instagram.com')) return 'Instagram';
    if (ref.includes('whatsapp.com') || ref.includes('api.whatsapp.com')) return 'WhatsApp';
    if (ref.includes('google.') || ref.includes('google.co.id')) return 'Google Search';
    if (ref.includes('tiktok.com')) return 'TikTok';
    if (ref.includes('facebook.com') || ref.includes('fb.me')) return 'Facebook';
    if (ref.includes('youtube.com')) return 'YouTube';
    try {
      const url = new URL(ref);
      return url.hostname.replace('www.', '');
    } catch (e) {
      return 'Rujukan Eksternal';
    }
  }

  // 3. Format Waktu Indonesia (WIB)
  function formatIndoTime(d) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    const secs = String(d.getSeconds()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${mins}:${secs} WIB`;
  }

  // Ambil data log pengunjung riil yang tersimpan
  function getLogs() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_LOGS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  // Simpan log pengunjung riil (maksimal 200 data riil terbaru)
  function saveLogs(logs) {
    if (logs.length > 200) {
      logs = logs.slice(0, 200);
    }
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  }

  // 4. Rekam Kunjungan Nyata (Real Visitor Capture)
  async function recordRealVisit() {
    // Mencegah duplicate count jika user me-refresh tab dalam kurun waktu 3 menit
    const sessionId = sessionStorage.getItem(STORAGE_KEY_SESSION);
    const lastVisitTime = sessionStorage.getItem('sanggar_last_visit_time');
    const nowTime = Date.now();

    if (sessionId && lastVisitTime && nowTime - parseInt(lastVisitTime, 10) < 180000) {
      return; // Sesi yang sama masih aktif
    }

    const newSessionId = 'sess_' + nowTime + '_' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem(STORAGE_KEY_SESSION, newSessionId);
    sessionStorage.setItem('sanggar_last_visit_time', String(nowTime));

    const devInfo = getRealDeviceInfo();
    const source = getRealTrafficSource();
    const now = new Date();

    // Data geolokasi & IP nyata (Live Lookup)
    let geo = {
      ip: 'Mendeteksi IP...',
      city: 'Lokasi Pengunjung',
      region: 'Indonesia',
      isp: 'Internet Provider'
    };

    // Panggil layanan IP nyata tanpa cache dummy
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch('https://ipwho.is/', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          geo.ip = data.ip || 'Terhubung';
          geo.city = data.city || 'Indonesia';
          geo.region = data.region || data.country || 'Indonesia';
          geo.isp = data.connection?.isp || data.connection?.org || 'Penyedia Akses';
        }
      }
    } catch (e) {
      // Jika ipwho.is gagal/terblokir, coba alternatif kedua (ipify)
      try {
        const altRes = await fetch('https://api.ipify.org?format=json');
        if (altRes.ok) {
          const altData = await altRes.json();
          geo.ip = altData.ip || 'IP Terdeteksi';
          geo.city = 'Pengunjung Lokal';
          geo.region = 'Indonesia';
        }
      } catch (err) {
        geo.ip = 'Akses Browser Langsung';
      }
    }

    const realEntry = {
      id: 'real_visit_' + now.getTime() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: now.toISOString(),
      timeFormatted: formatIndoTime(now),
      ip: geo.ip,
      city: geo.city,
      region: geo.region,
      isp: geo.isp,
      deviceType: devInfo.deviceType,
      os: devInfo.os,
      browser: devInfo.browser,
      screenRes: devInfo.screenRes,
      source: source,
      page: window.location.pathname.split('/').pop() || 'index.html',
      status: 'Online Sekarang'
    };

    const logs = getLogs();
    logs.unshift(realEntry);
    saveLogs(logs);
  }

  // 5. Hitung Ringkasan Analitik Berdasarkan Data Riil
  function getAnalyticsSummary(timeRange = 'all') {
    const logs = getLogs();
    const now = new Date();

    const filtered = logs.filter((log) => {
      if (timeRange === 'all') return true;
      const logDate = new Date(log.timestamp);
      const diffHours = (now - logDate) / (1000 * 3600);
      if (timeRange === 'today') return diffHours <= 24;
      if (timeRange === '7d') return diffHours <= 7 * 24;
      if (timeRange === '30d') return diffHours <= 30 * 24;
      return true;
    });

    const totalPageviews = filtered.length;
    const uniqueIPs = new Set(filtered.map((l) => l.ip)).size;

    // Kunjungan hari ini riil
    const todayLogs = logs.filter((l) => {
      const d = new Date(l.timestamp);
      return d.toDateString() === now.toDateString();
    });

    // Breakdown perangkat riil
    const devices = { Smartphone: 0, Desktop: 0, Tablet: 0 };
    filtered.forEach((l) => {
      if (devices[l.deviceType] !== undefined) {
        devices[l.deviceType]++;
      } else {
        devices['Smartphone']++;
      }
    });

    // Breakdown browser riil
    const browsers = {};
    filtered.forEach((l) => {
      const b = l.browser || 'Lainnya';
      browsers[b] = (browsers[b] || 0) + 1;
    });

    // Breakdown sumber rujukan riil
    const sources = {};
    filtered.forEach((l) => {
      const s = l.source || 'Akses Langsung / URL';
      sources[s] = (sources[s] || 0) + 1;
    });

    // Statistik harian riil 7 hari terakhir
    const dailyStats = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
      const key = `${d.getDate()}/${d.getMonth() + 1}`;
      dailyStats[key] = 0;
    }

    filtered.forEach((l) => {
      const d = new Date(l.timestamp);
      const key = `${d.getDate()}/${d.getMonth() + 1}`;
      if (dailyStats[key] !== undefined) {
        dailyStats[key]++;
      }
    });

    return {
      totalPageviews,
      uniqueVisitors: uniqueIPs,
      todayVisits: todayLogs.length,
      devices,
      browsers,
      sources,
      dailyStats,
      filteredLogs: filtered
    };
  }

  // 6. Bersihkan Semua Log
  function clearLogs() {
    localStorage.removeItem(STORAGE_KEY_LOGS);
    localStorage.removeItem(STORAGE_KEY_SUMMARY);
  }

  // 7. Ekspor Data Riil ke CSV
  function exportCSV() {
    const logs = getLogs();
    if (!logs.length) {
      alert('Belum ada data kunjungan riil untuk diekspor.');
      return;
    }

    const headers = [
      'No',
      'Waktu Akses',
      'IP Address',
      'Kota / Lokasi',
      'Provinsi / Region',
      'Penyedia (ISP)',
      'Perangkat',
      'Sistem Operasi',
      'Browser',
      'Resolusi Layar',
      'Sumber Rujukan',
      'Halaman'
    ];
    const rows = logs.map((item, idx) => [
      idx + 1,
      `"${item.timeFormatted}"`,
      `"${item.ip}"`,
      `"${item.city}"`,
      `"${item.region}"`,
      `"${item.isp || '-'}"`,
      `"${item.deviceType}"`,
      `"${item.os}"`,
      `"${item.browser}"`,
      `"${item.screenRes}"`,
      `"${item.source}"`,
      `"${item.page}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `log_pengunjung_riil_tungga_production_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Ekspor API
  window.SanggarTracker = {
    recordVisit: recordRealVisit,
    getLogs,
    getAnalyticsSummary,
    clearLogs,
    exportCSV
  };

  // Jalankan pelacakan HANYA saat pengunjung mengakses halaman web (bukan saat di admin.html)
  if (typeof window !== 'undefined') {
    const isDashboard = window.location.pathname.includes('admin.html');
    if (!isDashboard) {
      recordRealVisit();
    }
  }
})();
