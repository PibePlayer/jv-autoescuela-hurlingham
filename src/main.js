import { FALLBACK_COURSES, FLEET_CATEGORIES, HERO_SLIDES, QUIZ_QUESTIONS } from './scripts/data.js';

const WHATSAPP_NUMBER = '5491168172577';

const state = {
  courses: [...FALLBACK_COURSES],
  heroIndex: 0,
  activeFleet: 'manual',
  activeFilter: 'all',
  cart: loadCart(),
  paymentMethod: 'transferencia',
  selectedSlot: null,
  quizIndex: 0,
  quizScore: 0,
  quizAnswered: false
};

let heroTimer = null;

function renderHeroSlide(index) {
  state.heroIndex = (index + HERO_SLIDES.length) % HERO_SLIDES.length;
  const s = HERO_SLIDES[state.heroIndex];

  const eyebrow = document.getElementById('hero-eyebrow');
  const title = document.getElementById('hero-title');
  const lead = document.getElementById('hero-lead');
  const img = document.getElementById('hero-img');
  const capTitle = document.getElementById('hero-cap-title');
  const capSub = document.getElementById('hero-cap-sub');
  const dots = document.getElementById('hero-dots');
  const content = document.getElementById('hero-slide-content');

  if (content) {
    content.classList.remove('panel-animate');
    void content.offsetWidth;
    content.classList.add('panel-animate');
  }

  if (eyebrow) eyebrow.textContent = s.eyebrow;
  if (title) title.textContent = s.title;
  if (lead) lead.textContent = s.lead;
  if (img) img.src = s.image;
  if (capTitle) capTitle.innerHTML = `<strong>${s.captionTitle}</strong>`;
  if (capSub) capSub.textContent = s.captionSub;

  if (dots) {
    dots.innerHTML = HERO_SLIDES.map(
      (_, i) =>
        `<button type="button" class="hero-dot ${i === state.heroIndex ? 'is-active' : ''}" data-hero-dot="${i}" aria-label="Slide ${
          i + 1
        }"></button>`
    ).join('');
    dots.querySelectorAll('[data-hero-dot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        renderHeroSlide(Number(btn.getAttribute('data-hero-dot')));
        restartHeroAutoplay();
      });
    });
  }
}

function restartHeroAutoplay() {
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = setInterval(() => renderHeroSlide(state.heroIndex + 1), 5500);
}

function setupHeroSlider() {
  renderHeroSlide(0);
  document.getElementById('hero-prev')?.addEventListener('click', () => {
    renderHeroSlide(state.heroIndex - 1);
    restartHeroAutoplay();
  });
  document.getElementById('hero-next')?.addEventListener('click', () => {
    renderHeroSlide(state.heroIndex + 1);
    restartHeroAutoplay();
  });
  const sliderEl = document.getElementById('hero-slider');
  sliderEl?.addEventListener('mouseenter', () => heroTimer && clearInterval(heroTimer));
  sliderEl?.addEventListener('mouseleave', restartHeroAutoplay);
  restartHeroAutoplay();
}

function loadCart() {
  try {
    const raw = localStorage.getItem('jv_quote_cart_v1');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem('jv_quote_cart_v1', JSON.stringify(state.cart));
  } catch {
    // ignore
  }
}

/* ==========================================================================
   FLOTA INTERACTIVA CON TRANSICIÓN FLUIDA
   ========================================================================== */
function renderFleetShowcase() {
  const tabsEl = document.getElementById('fleet-tabs');
  const boxEl = document.getElementById('fleet-showcase-container');
  if (!tabsEl || !boxEl) return;

  tabsEl.innerHTML = FLEET_CATEGORIES.map(
    (f) => `
      <button
        type="button"
        class="fleet-tab ${f.id === state.activeFleet ? 'is-active' : ''}"
        data-fleet-tab="${f.id}"
        role="tab"
        aria-selected="${f.id === state.activeFleet}"
      >
        ${f.tabLabel}
      </button>
    `
  ).join('');

  tabsEl.querySelectorAll('[data-fleet-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeFleet = btn.getAttribute('data-fleet-tab');
      renderFleetShowcase();
    });
  });

  const current = FLEET_CATEGORIES.find((f) => f.id === state.activeFleet) || FLEET_CATEGORIES[0];
  boxEl.innerHTML = `
    <article class="fleet-showcase panel-animate">
      <div class="fleet-showcase-media">
        <img src="${current.image}" alt="${current.imageAlt}" />
        <span class="fleet-license-tag">${current.license}</span>
      </div>
      <div class="fleet-showcase-content">
        <h3>${current.title}</h3>
        <p>${current.summary}</p>
        <ul class="fleet-specs">
          ${current.bullets.map((b) => `<li>${b}</li>`).join('')}
        </ul>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <button type="button" class="btn btn-primary btn-sm" id="fleet-book-btn">
            Reservar Turno en esta Categoría
          </button>
          <button type="button" class="btn btn-outline btn-sm" id="fleet-courses-btn">
            Ver Packs Disponibles
          </button>
        </div>
      </div>
    </article>
  `;

  document.getElementById('fleet-book-btn')?.addEventListener('click', () => jumpToBooking(current.id));
  document.getElementById('fleet-courses-btn')?.addEventListener('click', () => {
    state.activeFilter = current.id;
    document.querySelectorAll('.filter-btn').forEach((b) => {
      b.classList.toggle('is-active', b.getAttribute('data-category') === current.id);
    });
    renderCourses();
    document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ==========================================================================
   CURSOS SIN PRECIOS INVENTADOS
   ========================================================================== */
async function fetchCourses() {
  try {
    const res = await fetch('/api/courses');
    if (!res.ok) return;
    const data = await res.json();
    if (data?.ok && Array.isArray(data.courses) && data.courses.length > 0) {
      state.courses = data.courses;
    }
  } catch {
    // fallback local
  }
  renderCourses();
  populateBookingCourseSelect();
}

function renderCourses() {
  const grid = document.getElementById('courses-grid');
  if (!grid) return;

  const filtered =
    state.activeFilter === 'all'
      ? state.courses
      : state.courses.filter((c) => c.category === state.activeFilter);

  grid.innerHTML = filtered
    .map(
      (course) => `
      <article class="course-card panel-animate ${course.highlight ? 'is-featured' : ''}">
        <span class="course-cat">${course.categoryLabel}</span>
        <span class="course-badge">${course.badge}</span>
        <h3>${course.title}</h3>
        <p class="course-desc">${course.description}</p>
        <div class="course-meta">
          ${course.classesCount} ${course.classesCount === 1 ? 'encuentro' : 'clases'} · ${course.durationMin} min · ${course.vehicle}
        </div>
        <div class="course-btns">
          <button type="button" class="btn btn-primary btn-sm" data-add-cart="${course.id}">
            Cotizar
          </button>
          <button
            type="button"
            class="btn btn-outline btn-sm"
            data-select-booking="${course.id}"
            data-select-cat="${course.category}"
          >
            Turno
          </button>
        </div>
      </article>
    `
    )
    .join('');

  grid.querySelectorAll('[data-add-cart]').forEach((btn) => {
    btn.addEventListener('click', () => {
      addToCart(btn.getAttribute('data-add-cart'));
      openCartDrawer();
    });
  });

  grid.querySelectorAll('[data-select-booking]').forEach((btn) => {
    btn.addEventListener('click', () => {
      jumpToBooking(btn.getAttribute('data-select-cat'), btn.getAttribute('data-select-booking'));
    });
  });
}

function populateBookingCourseSelect() {
  const select = document.getElementById('booking-course');
  if (!select) return;
  const current = select.value;
  select.innerHTML = `<option value="">Clase inicial / A definir con el instructor</option>`;
  state.courses.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.title} (${c.vehicle})`;
    select.appendChild(opt);
  });
  if (current) select.value = current;
}

function jumpToBooking(category, courseId = '') {
  const catSelect = document.getElementById('booking-category');
  const courseSelect = document.getElementById('booking-course');
  if (catSelect && ['manual', 'automatico', 'moto', 'gran-porte'].includes(category)) {
    catSelect.value = category;
  }
  if (courseSelect && courseId) {
    courseSelect.value = courseId;
  }
  document.getElementById('turnero')?.scrollIntoView({ behavior: 'smooth' });
  loadAvailability();
}

/* ==========================================================================
   COTIZADOR / CARRITO DE CONSULTA
   ========================================================================== */
function addToCart(courseId) {
  const existing = state.cart.find((item) => item.id === courseId);
  if (existing) existing.qty = Math.min(10, existing.qty + 1);
  else state.cart.push({ id: courseId, qty: 1 });
  saveCart();
  renderCart();
}

function updateCartQty(courseId, delta) {
  const item = state.cart.find((i) => i.id === courseId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) state.cart = state.cart.filter((i) => i.id !== courseId);
  saveCart();
  renderCart();
}

function renderCart() {
  const countEl = document.getElementById('cart-count');
  const container = document.getElementById('cart-items-container');
  const footer = document.getElementById('cart-footer');
  if (!countEl || !container || !footer) return;

  countEl.textContent = String(state.cart.reduce((sum, i) => sum + i.qty, 0));

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 36px 12px; color: var(--jv-muted);">
        <p style="font-weight: 700; color: var(--jv-asphalt); margin-bottom: 6px;">Sin cursos seleccionados</p>
        <p style="font-size: 0.9rem; margin: 0 0 18px;">
          Elegí los cursos que te interesan y te pasamos el presupuesto actualizado por WhatsApp.
        </p>
        <a href="#cursos" class="btn btn-primary btn-sm" id="cart-browse-link">Ver Cursos</a>
      </div>
    `;
    footer.innerHTML = '';
    document.getElementById('cart-browse-link')?.addEventListener('click', closeCartDrawer);
    return;
  }

  container.innerHTML = state.cart
    .map((cartItem) => {
      const course = state.courses.find((c) => c.id === cartItem.id);
      if (!course) return '';
      return `
        <div class="cart-item">
          <div>
            <div class="cart-item-title">${course.title}</div>
            <div class="cart-item-meta">${course.vehicle}</div>
          </div>
          <div class="qty-controls">
            <button type="button" class="qty-btn" data-qty-minus="${course.id}" aria-label="Quitar">-</button>
            <span style="font-weight: 700; font-size: 0.9rem;">${cartItem.qty}</span>
            <button type="button" class="qty-btn" data-qty-plus="${course.id}" aria-label="Sumar">+</button>
          </div>
        </div>
      `;
    })
    .join('');

  container.querySelectorAll('[data-qty-minus]').forEach((b) =>
    b.addEventListener('click', () => updateCartQty(b.getAttribute('data-qty-minus'), -1))
  );
  container.querySelectorAll('[data-qty-plus]').forEach((b) =>
    b.addEventListener('click', () => updateCartQty(b.getAttribute('data-qty-plus'), 1))
  );

  footer.innerHTML = `
    <div style="margin-bottom: 12px;">
      <label for="cart-payment-method" style="display: block; font-size: 0.82rem; font-weight: 700; margin-bottom: 5px;">
        Forma de pago que te interesa consultar
      </label>
      <select id="cart-payment-method" style="width: 100%; padding: 9px 11px; border-radius: 8px; border: 1px solid var(--jv-border);">
        <option value="transferencia" ${state.paymentMethod === 'transferencia' ? 'selected' : ''}>Transferencia / Efectivo</option>
        <option value="tarjeta" ${state.paymentMethod === 'tarjeta' ? 'selected' : ''}>Cuotas / Tarjeta</option>
      </select>
    </div>
    <button type="button" class="btn btn-whatsapp" style="width: 100%;" id="checkout-submit-btn">
      Consultar Valor por WhatsApp
    </button>
    <p style="font-size: 0.76rem; color: var(--jv-muted); text-align: center; margin: 8px 0 0;">
      Atención directa de JV Autoescuela Hurlingham · 11-6817-2577
    </p>
  `;

  document.getElementById('cart-payment-method')?.addEventListener('change', (e) => {
    state.paymentMethod = e.target.value;
  });

  document.getElementById('checkout-submit-btn')?.addEventListener('click', handleCheckout);
}

async function handleCheckout() {
  const btn = document.getElementById('checkout-submit-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Abriendo WhatsApp...';
  }

  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: state.cart,
        paymentMethod: state.paymentMethod
      })
    });
    const data = await res.json();
    if (data?.ok && data.order?.whatsappUrl) {
      window.open(data.order.whatsappUrl, '_blank', 'noopener,noreferrer');
      return;
    }
  } catch {
    // fallback
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Consultar Valor por WhatsApp';
    }
  }

  const lines = state.cart.map((it) => {
    const c = state.courses.find((x) => x.id === it.id);
    return `- ${it.qty}x ${c ? c.title : it.id}`;
  });
  const msg = `Hola JV Autoescuela Hurlingham! Quiero consultar el valor de:\n${lines.join('\n')}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
}

function openCartDrawer() {
  document.getElementById('cart-backdrop')?.classList.add('is-open');
  const drawer = document.getElementById('cart-drawer');
  drawer?.classList.add('is-open');
  drawer?.setAttribute('aria-hidden', 'false');
}

function closeCartDrawer() {
  document.getElementById('cart-backdrop')?.classList.remove('is-open');
  const drawer = document.getElementById('cart-drawer');
  drawer?.classList.remove('is-open');
  drawer?.setAttribute('aria-hidden', 'true');
}

/* ==========================================================================
   TURNERO ONLINE + GOOGLE CALENDAR
   ========================================================================== */
function getNextValidDateString() {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  if (now.getDay() === 0) now.setDate(now.getDate() + 1);
  return now.toISOString().split('T')[0];
}

function computeLocalSlots(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const day = dt.getUTCDay();
  if (day === 0) {
    return {
      closed: true,
      reason: 'Los domingos permanecemos cerrados. Atendemos de Lunes a Sábados.',
      slots: []
    };
  }
  const hours =
    day === 6
      ? ['09:00', '10:00', '11:00', '12:00']
      : ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  return {
    closed: false,
    dayType: day === 6 ? 'Sábado (9 a 13 hs)' : 'Lunes a Viernes (8 a 18 hs)',
    slots: hours.map((time) => ({ time, available: true }))
  };
}

async function loadAvailability() {
  const dateInput = document.getElementById('booking-date');
  const catInput = document.getElementById('booking-category');
  const grid = document.getElementById('slots-grid');
  const helper = document.getElementById('slots-helper');
  if (!dateInput || !grid || !helper) return;

  const date = dateInput.value;
  const category = catInput?.value || 'manual';
  state.selectedSlot = null;

  let data;
  try {
    const res = await fetch(`/api/availability?date=${encodeURIComponent(date)}&category=${encodeURIComponent(category)}`);
    if (res.ok) data = await res.json();
  } catch {
    data = null;
  }

  if (!data || !data.ok) data = computeLocalSlots(date);

  if (data.closed) {
    grid.innerHTML = '';
    helper.textContent = data.reason || 'Día cerrado.';
    return;
  }

  helper.textContent = `Horario de atención: ${data.dayType}.`;
  grid.innerHTML = data.slots
    .map(
      (s) => `
      <button type="button" class="slot-btn" data-slot="${s.time}" ${s.available ? '' : 'disabled'}>
        ${s.time} hs
      </button>
    `
    )
    .join('');

  const firstAvailable = data.slots.find((s) => s.available);
  if (firstAvailable) selectSlot(firstAvailable.time);

  grid.querySelectorAll('.slot-btn:not(:disabled)').forEach((btn) => {
    btn.addEventListener('click', () => selectSlot(btn.getAttribute('data-slot')));
  });
}

function selectSlot(time) {
  state.selectedSlot = time;
  document.querySelectorAll('#slots-grid .slot-btn').forEach((btn) => {
    btn.classList.toggle('is-selected', btn.getAttribute('data-slot') === time);
  });
}

async function handleBookingSubmit(e) {
  e.preventDefault();
  const resultBox = document.getElementById('booking-result');
  const submitBtn = document.getElementById('booking-submit-btn');

  if (!state.selectedSlot) {
    alert('Por favor elegí un día abierto (Lunes a Sábado) y un horario disponible.');
    return;
  }

  const payload = {
    name: document.getElementById('booking-name').value.trim(),
    phone: document.getElementById('booking-phone').value.trim(),
    neighborhood: document.getElementById('booking-neighborhood').value,
    category: document.getElementById('booking-category').value,
    courseId: document.getElementById('booking-course').value,
    date: document.getElementById('booking-date').value,
    time: state.selectedSlot,
    experience: document.getElementById('booking-experience').value,
    notes: document.getElementById('booking-notes').value.trim()
  };

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Generando turno...';
  }

  let booking = null;
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data?.ok) booking = data.booking;
  } catch {
    booking = null;
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirmar Pre-Reserva y Google Calendar';
    }
  }

  if (!booking) {
    const [y, m, d] = payload.date.split('-');
    const [hh, mm] = payload.time.split(':').map(Number);
    const startStr = `${y}${m}${d}T${String(hh).padStart(2, '0')}${String(mm).padStart(2, '0')}00`;
    const endStr = `${y}${m}${d}T${String(hh + 1).padStart(2, '0')}${String(mm).padStart(2, '0')}00`;
    const calParams = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Clase JV Autoescuela (${payload.category})`,
      dates: `${startStr}/${endStr}`,
      ctz: 'America/Argentina/Buenos_Aires',
      details: `Alumno: ${payload.name} | Tel: ${payload.phone} | Zona: ${payload.neighborhood}`,
      location: 'Av. Gobernador Vergara 3855, Hurlingham'
    });
    const waText = `Hola JV Autoescuela Hurlingham! Soy ${payload.name} (${payload.neighborhood}). Quiero reservar clase de ${payload.category} para el ${payload.date} a las ${payload.time} hs.`;
    booking = {
      code: `JV-${Date.now().toString().slice(-5)}`,
      vehicleLabel: payload.category,
      date: payload.date,
      time: payload.time,
      googleCalendarUrl: `https://calendar.google.com/calendar/render?${calParams.toString()}`,
      whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`
    };
  }

  if (resultBox) {
    resultBox.hidden = false;
    resultBox.innerHTML = `
      <h4>¡Pre-reserva generada! Código ${booking.code}</h4>
      <p style="margin: 0; font-size: 0.92rem;">
        Turno solicitado para <strong>${booking.date} a las ${booking.time} hs</strong> (${booking.vehicleLabel}).
      </p>
      <div class="booking-status-actions">
        <a href="${booking.googleCalendarUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-dark btn-sm">
          + Agendar en Google Calendar
        </a>
        <a href="${booking.whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
          Confirmar por WhatsApp
        </a>
      </div>
    `;
  }
}

/* ==========================================================================
   EXAMEN TABS & SIMULADOR
   ========================================================================== */
function setupExamTabs() {
  const btns = document.querySelectorAll('[data-exam-tab]');
  const pautasPanel = document.getElementById('exam-pautas-panel');
  const quizPanel = document.getElementById('exam-quiz-panel');
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-exam-tab');
      btns.forEach((b) => b.classList.toggle('is-active', b === btn));
      if (pautasPanel && quizPanel) {
        pautasPanel.hidden = target !== 'pautas';
        quizPanel.hidden = target !== 'quiz';
      }
    });
  });
}

function renderQuiz() {
  const progress = document.getElementById('quiz-progress');
  const body = document.getElementById('quiz-body');
  if (!progress || !body) return;

  if (state.quizIndex >= QUIZ_QUESTIONS.length) {
    progress.textContent = 'Resultado';
    body.innerHTML = `
      <h3 class="quiz-question">Puntaje: ${state.quizScore} de ${QUIZ_QUESTIONS.length} correctas</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px;">
        <button type="button" class="btn btn-primary btn-sm" id="quiz-restart-btn">Reintentar</button>
        <a href="#turnero" class="btn btn-outline btn-sm">Reservar Práctica</a>
      </div>
    `;
    document.getElementById('quiz-restart-btn')?.addEventListener('click', () => {
      state.quizIndex = 0;
      state.quizScore = 0;
      state.quizAnswered = false;
      renderQuiz();
    });
    return;
  }

  const q = QUIZ_QUESTIONS[state.quizIndex];
  progress.textContent = `Pregunta ${state.quizIndex + 1} de ${QUIZ_QUESTIONS.length}`;

  body.innerHTML = `
    <p class="quiz-question">${q.question}</p>
    <div class="quiz-options">
      ${q.options.map((opt, idx) => `<button type="button" class="quiz-option" data-opt-idx="${idx}">${opt}</button>`).join('')}
    </div>
    <div class="quiz-feedback" id="quiz-feedback" hidden></div>
    <div style="margin-top: 14px; display: flex; justify-content: flex-end;">
      <button type="button" class="btn btn-dark btn-sm" id="quiz-next-btn" hidden>Siguiente →</button>
    </div>
  `;

  body.querySelectorAll('.quiz-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (state.quizAnswered) return;
      state.quizAnswered = true;
      const chosen = Number(btn.getAttribute('data-opt-idx'));
      const isRight = chosen === q.correctIndex;
      if (isRight) state.quizScore += 1;

      body.querySelectorAll('.quiz-option').forEach((optBtn, idx) => {
        optBtn.disabled = true;
        if (idx === q.correctIndex) optBtn.classList.add('is-correct');
        else if (idx === chosen && !isRight) optBtn.classList.add('is-wrong');
      });

      const fb = document.getElementById('quiz-feedback');
      if (fb) {
        fb.hidden = false;
        fb.innerHTML = `<strong>${isRight ? '¡Correcto!' : 'Atención:'}</strong> ${q.explanation}`;
      }

      const nextBtn = document.getElementById('quiz-next-btn');
      if (nextBtn) {
        nextBtn.hidden = false;
        nextBtn.addEventListener('click', () => {
          state.quizIndex += 1;
          state.quizAnswered = false;
          renderQuiz();
        });
      }
    });
  });
}

/* ==========================================================================
   SCROLL REVEAL & HEADER SCROLL SHADOW
   ========================================================================== */
function setupAnimations() {
  const header = document.getElementById('site-header');
  window.addEventListener(
    'scroll',
    () => {
      header?.classList.toggle('is-scrolled', window.scrollY > 16);
    },
    { passive: true }
  );

  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

function init() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('main-nav');
  menuBtn?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuBtn?.setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeFilter = btn.getAttribute('data-category') || 'all';
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.toggle('is-active', b === btn));
      renderCourses();
    });
  });

  document.getElementById('open-cart-btn')?.addEventListener('click', openCartDrawer);
  document.getElementById('close-cart-btn')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cart-backdrop')?.addEventListener('click', closeCartDrawer);

  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const minDate = getNextValidDateString();
    dateInput.min = new Date().toISOString().split('T')[0];
    dateInput.value = minDate;
    dateInput.addEventListener('change', loadAvailability);
  }
  document.getElementById('booking-category')?.addEventListener('change', loadAvailability);
  document.getElementById('booking-form')?.addEventListener('submit', handleBookingSubmit);

  setupHeroSlider();
  renderFleetShowcase();
  renderCourses();
  populateBookingCourseSelect();
  renderCart();
  loadAvailability();
  setupExamTabs();
  renderQuiz();
  setupAnimations();
  fetchCourses();
}

document.addEventListener('DOMContentLoaded', init);
