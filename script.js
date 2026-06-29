/* ===================================================
   PSR CONSTRUCTION — script.js
   Navy Blue + Orange Premium Theme
   =================================================== */

'use strict';

/* ─────────────────────────────────────────
   1. UTILITY HELPERS
───────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─────────────────────────────────────────
   2. SMOOTH SCROLL TO SECTION
───────────────────────────────────────── */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const navH = $('#navbar')?.offsetHeight || 80;
  const top = el.getBoundingClientRect().top + window.scrollY - navH;
  window.scrollTo({ top, behavior: 'smooth' });
}

/* ─────────────────────────────────────────
   3. NAVBAR — scroll state + active links
───────────────────────────────────────── */
(function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    const prog = $('#scrollProgress');
    if (prog) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = max > 0 ? (window.scrollY / max * 100) + '%' : '0%';
    }

    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - (navbar.offsetHeight + 80);
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─────────────────────────────────────────
   4. MOBILE NAV TOGGLE
───────────────────────────────────────── */
(function initMobileNav() {
  const btn = $('#menuToggle');
  const nav = $('#mobileNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
})();

function closeMobileNav() {
  const nav = $('#mobileNav');
  const btn = $('#menuToggle');
  if (!nav || !btn) return;
  nav.classList.remove('open');
  btn.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ─────────────────────────────────────────
   5. HERO PARALLAX GLOW (mouse tracker)
───────────────────────────────────────── */
(function initHeroGlow() {
  const hero = $('.hero');
  const glow = $('#heroGlow');
  if (!hero || !glow) return;

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    glow.style.left = (e.clientX - rect.left) + 'px';
    glow.style.top  = (e.clientY - rect.top)  + 'px';
  });
})();

/* ─────────────────────────────────────────
   6. SCROLL-REVEAL (IntersectionObserver)
───────────────────────────────────────── */
(function initScrollReveal() {
  const els = $$('.scroll-reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ─────────────────────────────────────────
   7. ANIMATED COUNTERS
───────────────────────────────────────── */
(function initCounters() {
  const counters = $$('.counter');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const duration = 1800;
      const step = 16;
      const increment = target / (duration / step);
      let current = 0;

      const tick = () => {
        current = Math.min(current + increment, target);
        el.textContent = Math.floor(current);
        if (current < target) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
})();

/* ─────────────────────────────────────────
   8. SERVICES — enquire now links → contact
───────────────────────────────────────── */
(function initServiceLinks() {
  $$('.service-link').forEach(link => {
    link.style.cursor = 'pointer';
    link.addEventListener('click', () => scrollToSection('contact'));
  });
})();

/* ─────────────────────────────────────────
   9. PROJECT FILTER
───────────────────────────────────────── */
(function initProjectFilter() {
  const btns = $$('.filter-btn');
  const cards = $$('#projectsGrid .project-card');
  if (!btns.length || !cards.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'All' || card.dataset.cat === filter;
        card.classList.toggle('hidden', !match);
      });

      const grid = $('#projectsGrid');
      if (grid) {
        const visible = cards.filter(c => !c.classList.contains('hidden'));
        visible.forEach((c, i) => {
          c.style.gridColumn = (filter === 'All' && i === 0) ? 'span 2' : '';
        });
      }
    });
  });
})();

/* ─────────────────────────────────────────
   10. GALLERY FILTER
───────────────────────────────────────── */
(function initGalleryFilter() {
  const btns  = $$('.gallery-filter-btn');
  const items = $$('#galleryGrid .gallery-item');
  if (!btns.length || !items.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.gfilter;
      items.forEach(item => {
        const match = filter === 'All' || item.dataset.gtag === filter;
        item.classList.toggle('hidden', !match);
        if (filter !== 'All') item.style.gridColumn = '';
      });

      if (filter === 'All') {
        items.forEach(item => {
          if (item.classList.contains('gallery-span2')) item.style.gridColumn = '';
        });
      }
    });
  });

  items.forEach(item => {
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
})();

/* ─────────────────────────────────────────
   11. LIGHTBOX
───────────────────────────────────────── */
const galleryData = [
  { src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=90&auto=format&fit=crop', tag: 'Villa',       tagColor: '#7C3AED', caption: 'Luxury Villa Construction, Chittoor' },
  { src: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=90&auto=format&fit=crop', tag: 'Residential', tagColor: '#84CC16', caption: 'Modern Independent House' },
  { src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=90&auto=format&fit=crop', tag: 'Commercial',  tagColor: '#E67E22', caption: 'Commercial Building Project' },
  { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=90&auto=format&fit=crop', tag: 'Villa',       tagColor: '#7C3AED', caption: 'Premium Villa with Garden' },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=90&auto=format&fit=crop', tag: 'Interior',     tagColor: '#A78BFA', caption: 'Interior Design & Fit-Out' },
  { src: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=90&auto=format&fit=crop', tag: 'Industrial',   tagColor: '#E67E22', caption: 'Industrial Warehouse Construction' },
  { src: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=90&auto=format&fit=crop', tag: 'Residential', tagColor: '#84CC16', caption: 'Home Construction Andhra Pradesh' },
  { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=90&auto=format&fit=crop', tag: 'Villa',       tagColor: '#7C3AED', caption: 'Villa with Landscaping' },
  { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=90&auto=format&fit=crop', tag: 'Interior',    tagColor: '#A78BFA', caption: 'Luxury Home Interior' },
];

let lbIndex = 0;

function openLightbox(idx) {
  lbIndex = idx;
  renderLightbox();
  const lb = $('#lightbox');
  if (lb) {
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lb = $('#lightbox');
  if (lb) {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function renderLightbox() {
  const data = galleryData[lbIndex];
  if (!data) return;
  const img  = $('#lightboxImg');
  const tag  = $('#lightboxTag');
  const cap  = $('#lightboxCaption');
  const ctr  = $('#lightboxCounter');
  if (img) { img.src = data.src; img.alt = data.caption; }
  if (tag) { tag.textContent = data.tag; tag.style.background = data.tagColor; }
  if (cap) cap.textContent = data.caption;
  if (ctr) ctr.textContent = `${lbIndex + 1} / ${galleryData.length}`;
}

function lbPrev() {
  lbIndex = (lbIndex - 1 + galleryData.length) % galleryData.length;
  renderLightbox();
}

function lbNext() {
  lbIndex = (lbIndex + 1) % galleryData.length;
  renderLightbox();
}

document.addEventListener('keydown', e => {
  const lb = $('#lightbox');
  if (!lb?.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  lbPrev();
  if (e.key === 'ArrowRight') lbNext();
  if (e.key === 'Escape')     closeLightbox();
});

/* ─────────────────────────────────────────
   12. TESTIMONIALS CAROUSEL
───────────────────────────────────────── */
(function initTestimonials() {
  const testimonials = [
    { name: 'Tatepallli kumar',     location: 'Chittoor, AP',     stars: 5, text: 'I found PSR Constructions (Surendra) through a Google search a year ago and chose the best option for my dream home. The quality is excellent, with perfect planning from design to execution, interiors, and painting. Surendra delivered everything promised, communicated well, and showed great dedication, honesty, and professionalism. I highly recommend PSR Constructions—choose them to start your dream home journey, as they live up to their tagline: “We build your Dream House.” Right people, right choice, best quality! Thank you, Surendra brother, for the amazing service. Wishing PSR continued success in fulfilling more dreams—our bond will last for future projects too.' },
    { name: 'Shiva Kumar',     location: 'Tirupati, AP',     stars: 5, text: 'Very friendly builder he is having good experience about construction.I got very good experience in my own construction' },
    { name: 'Dr G V K ',   location: 'Kuppam, AP',       stars: 5, text: 'Experienced,Trusted & Budget Friendly Constructions' },
    { name: 'Sandhya Rani',       location: 'Madanapalle, AP',  stars: 5, text: 'They are maintaining Good quality,valuable services-We recommend the PSR Constructions' },
    { name: 'Gnanasekar',   location: 'Chittoor, AP',     stars: 5, text: 'Commercial project delivered ahead of schedule. The structural quality is excellent and the finishes are clean. Our shop complex looks exactly as planned.' },
    { name: 'Hareesh Gollapalli',     location: 'Gollapalli, AP',     stars: 5, text: 'Home renovation by PSR was stress-free. They handled everything from design to execution. The interior work — fall ceiling, tiles, carpentry — all services is good.' },
    
  ];

  const track     = $('#testiTrack');
  const dotsWrap  = $('#testiDots');
  const countEl   = $('#testiCount');
  const progressEl = $('#testiProgressFill');
  if (!track) return;

  let current    = 0;
  let perView    = getPerView();
  let totalPages = Math.ceil(testimonials.length / perView);
  let autoTimer  = null;
  const AUTO_INTERVAL = 5000;

  function getPerView() {
    if (window.innerWidth < 640)  return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function buildCards() {
    track.innerHTML = '';
    const cols = perView === 1 ? '1fr' : perView === 2 ? '1fr 1fr' : '1fr 1fr 1fr';
    track.style.gridTemplateColumns = cols;

    const start = current * perView;
    testimonials.slice(start, start + perView).forEach(t => {
      const stars = Array(t.stars).fill('<span class="testi-star">★</span>').join('');
      const card = document.createElement('div');
      card.className = 'testi-card';
      card.innerHTML = `
        <div class="testi-stars">${stars}</div>
        <p class="testi-text">${t.text}</p>
        <div class="testi-author">
          <div class="testi-avatar">${t.name[0]}</div>
          <div>
            <div class="testi-name">${t.name}</div>
            <div class="testi-location">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ${t.location}
            </div>
          </div>
        </div>`;
      track.appendChild(card);
    });
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === current ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Page ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateProgress() {
    if (progressEl) progressEl.style.width = ((current + 1) / totalPages * 100) + '%';
    if (countEl)    countEl.textContent = `Showing reviews ${current * perView + 1}–${Math.min((current + 1) * perView, testimonials.length)} of ${testimonials.length}`;
  }

  function goTo(idx) {
    current = (idx + totalPages) % totalPages;
    buildCards();
    buildDots();
    updateProgress();
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), AUTO_INTERVAL);
  }

  function render() {
    perView    = getPerView();
    totalPages = Math.ceil(testimonials.length / perView);
    current    = Math.min(current, totalPages - 1);
    buildCards();
    buildDots();
    updateProgress();
  }

  render();
  resetAuto();

  window.addEventListener('resize', render, { passive: true });

  const wrap = $('.testi-carousel-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => clearInterval(autoTimer));
    wrap.addEventListener('mouseleave', resetAuto);
  }

  window.testiPrev = () => goTo(current - 1);
  window.testiNext = () => goTo(current + 1);
})();

/* ─────────────────────────────────────────
   13. CONTACT FORM VALIDATION & SUBMIT
   (FormSubmit integration — fixed: real submit
   wiring, real success/error handling, logging)
───────────────────────────────────────── */
(function initContactForm() {
  const formWrap = $('#formWrap');
  if (!formWrap) return;

  function getVal(id) { return ($(id)?.value || '').trim(); }

  function setError(id, msg) {
    const errEl = $(`#err-${id}`);
    const input = $(`#f${id}`);
    if (errEl) errEl.textContent = msg;
    if (input) input.classList.toggle('error', !!msg);
  }

  function clearErrors() {
    ['name','phone','email','type','message'].forEach(f => setError(f, ''));
  }

  function validate() {
    let valid = true;
    clearErrors();

    const name = getVal('#fname');
    if (!name || name.length < 2) { setError('name', 'Please enter your full name.'); valid = false; }

    const phone = getVal('#fphone').replace(/\s/g, '');
    if (!phone || !/^[+]?[\d]{10,15}$/.test(phone)) { setError('phone', 'Enter a valid 10-digit phone number.'); valid = false; }

    const type = getVal('#ftype');
    if (!type) { setError('type', 'Please select a project type.'); valid = false; }

    const msg = getVal('#fmessage');
    if (!msg || msg.length < 10) { setError('message', 'Please describe your requirements (min 10 characters).'); valid = false; }

    return valid;
  }

  /* Wire the form's submit event to this handler (was missing — form was
     previously doing a native POST/page-navigation to FormSubmit and
     never running this code at all). */
  const formEl = $('#contactForm');
  if (formEl) {
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      submitForm();
    });
  }

  window.submitForm = async function () {
    if (!validate()) return;

    const name    = getVal('#fname');
    const phone   = getVal('#fphone');
    const type    = getVal('#ftype');
    const message = getVal('#fmessage');

    const submitBtn = $('#formSubmit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending…</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          style="animation:spin 0.8s linear infinite">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"/>
        </svg>`;
    }

    if (!document.getElementById('spinStyle')) {
      const s = document.createElement('style');
      s.id = 'spinStyle';
      s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
      document.head.appendChild(s);
    }

    function resetSubmitBtn() {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Send Enquiry</span>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M1 7H13M8 2L13 7L8 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      }
    }

    function showError(message) {
      resetSubmitBtn();
      let errBanner = $('#formSubmitError');
      if (!errBanner) {
        errBanner = document.createElement('p');
        errBanner.id = 'formSubmitError';
        errBanner.style.cssText = 'color:#dc2626;font-size:12.5px;margin-top:10px;text-align:center;';
        formEl?.appendChild(errBanner);
      }
      errBanner.textContent = `Sorry, your enquiry could not be sent: ${message}. Please try WhatsApp or call us instead.`;
    }

    const formData = new FormData();
    formData.append('name',         name);
    formData.append('phone',        phone);
    formData.append('project_type', type);
    formData.append('message',      message);
    formData.append('_subject',     `New Enquiry from ${name} — PSR Construction`);
    formData.append('_template',    'table');
    formData.append('_captcha',     'false');
    formData.append('_next',        'false');

    const waText = encodeURIComponent(
      `Hello PSR Construction!\n\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Project Type:* ${type}\n\n` +
      `*Message:*\n${message}\n\n` +
      `_(Sent from PSRConstruction website)_`
    );

    try {
      const res = await fetch(
        'https://formsubmit.co/ajax/psrconstructions@gmail.com',
        { method: 'POST', body: formData }
      );

      const json = await res.json();

      /* Console logging for FormSubmit response, as requested */
      console.log('FormSubmit response status:', res.status);
      console.log('FormSubmit response body:', json);

      if (res.ok && (json.success === true || json.success === 'true')) {
        /* ── REAL SUCCESS ── */
        showSuccess(name, waText);
      } else {
        /* ── REAL FAILURE — show actual error, do NOT fake success ── */
        const errMsg = json.message || `Unexpected response (status ${res.status})`;
        console.error('FormSubmit reported failure:', errMsg, json);
        showError(errMsg);
      }

    } catch (err) {
      /* ── NETWORK / PARSE ERROR — show actual error, do NOT fake success ── */
      console.error('FormSubmit request failed:', err);
      showError(err.message || 'network error');
    }
  };

  function showSuccess(name, waText) {
    formWrap.innerHTML = `
      <div class="form-success">
        <div class="form-success-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h3 class="form-success-title">Enquiry Sent!</h3>
        <p class="form-success-text">
          Thank you, <strong>${name}</strong>. Your enquiry has been emailed to PSR Construction.<br/>
          We'll get back to you within 24 hours. For immediate help, WhatsApp us directly.
        </p>
        <div style="margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <a href="https://wa.me/919738885999?text=${waText}"
             target="_blank" rel="noopener noreferrer"
             class="btn-primary"
             style="display:inline-flex;align-items:center;gap:8px;">
            <span>Chat on WhatsApp</span>
          </a>
          <button class="btn-outline"
                  onclick="location.reload()"
                  style="display:inline-flex;align-items:center;gap:8px;">
            <span>New Enquiry</span>
          </button>
        </div>
      </div>`;
  }

  ['fname','fphone','femail','ftype','fmessage'].forEach(id => {
    const el = $(`#${id}`);
    if (!el) return;
    el.addEventListener('blur', () => {
      const key = id.replace('f','');
      const val = el.value.trim();
      let err = '';
      if (key === 'name'    && val.length < 2)  err = 'Please enter your full name.';
      if (key === 'phone'   && val && !/^[+]?[\d]{10,15}$/.test(val.replace(/\s/g,''))) err = 'Enter a valid phone number.';
      if (key === 'email'   && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) err = 'Enter a valid email address.';
      if (key === 'type'    && !val)  err = 'Please select a project type.';
      if (key === 'message' && val.length < 10) err = 'Please describe your requirements.';
      setError(key, err);
    });
  });
})();

/* ─────────────────────────────────────────
   14. GET DIRECTIONS (Geolocation)
───────────────────────────────────────── */
function getDirections() {
  const btn    = $('#dirBtn');
  const txt    = $('#dirText');
  const status = $('#geoStatus');
  const dest   = '13.2175,79.1000';

  if (!navigator.geolocation) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank', 'noopener');
    return;
  }

  if (txt) txt.textContent = 'Locating…';
  if (status) status.textContent = 'Getting your location…';
  if (btn) btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${dest}&travelmode=driving`;
      window.open(url, '_blank', 'noopener');
      if (txt) txt.textContent = 'Get Directions';
      if (status) status.textContent = '';
      if (btn) btn.disabled = false;
    },
    () => {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank', 'noopener');
      if (txt) txt.textContent = 'Get Directions';
      if (status) status.textContent = '';
      if (btn) btn.disabled = false;
    },
    { timeout: 8000 }
  );
}

/* ─────────────────────────────────────────
   15. FOOTER YEAR
───────────────────────────────────────── */
(function setFooterYear() {
  const el = $('#footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ─────────────────────────────────────────
   16. HERO BACKGROUND SUBTLE PARALLAX
───────────────────────────────────────── */
(function initHeroParallax() {
  const img = $('.hero-bg-img');
  if (!img || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      img.style.transform = `translateY(${y * 0.28}px)`;
    }
  }, { passive: true });
})();

/* ─────────────────────────────────────────
   17. SERVICE CARD RIPPLE EFFECT
───────────────────────────────────────── */
(function initServiceRipple() {
  $$('.service-card, .whyus-card').forEach(card => {
    card.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;border-radius:50%;
        background:rgba(167,139,250,0.18);
        pointer-events:none;transform:scale(0);
        animation:ripple 0.55s ease-out forwards;`;
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
      card.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  if (!$('#rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = `@keyframes ripple{to{transform:scale(2.5);opacity:0;}}`;
    document.head.appendChild(style);
  }
})();

/* ─────────────────────────────────────────
   18. STAT CARD HOVER TILT
───────────────────────────────────────── */
(function initStatTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  $$('.stat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─────────────────────────────────────────
   19. CLOSE MOBILE NAV ON OUTSIDE CLICK
───────────────────────────────────────── */
document.addEventListener('click', e => {
  const nav = $('#mobileNav');
  const btn = $('#menuToggle');
  if (!nav?.classList.contains('open')) return;
  if (!nav.contains(e.target) && !btn.contains(e.target)) {
    closeMobileNav();
  }
});

/* ─────────────────────────────────────────
   20. WHYUS CTA STRIP — call button
───────────────────────────────────────── */
(function initWhyUsCTA() {
  const strip = $('.whyus-cta-strip');
  if (!strip) return;
  const callBtn = strip.querySelector('.btn-outline');
  if (callBtn) {
    callBtn.addEventListener('click', () => {
      window.location.href = 'tel:+919738885999';
    });
  }
})();

/* ─────────────────────────────────────────
   21. LAZY IMAGE LOADING FALLBACK
───────────────────────────────────────── */
(function initImgFallback() {
  $$('img[loading="lazy"]').forEach(img => {
    img.addEventListener('error', function () {
      this.style.background = 'var(--lavender)';
      this.alt = '';
    });
  });
})();

/* ─────────────────────────────────────────
   22. INIT ON DOM READY
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  $$('section').forEach(sec => {
    $$('.scroll-reveal', sec).forEach((el, i) => {
      if (!el.style.animationDelay) {
        el.style.transitionDelay = (i * 0.07) + 's';
      }
    });
  });
});