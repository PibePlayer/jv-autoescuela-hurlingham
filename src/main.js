import { FALLBACK_COURSES, QUIZ_QUESTIONS } from './scripts/data.js';

const WHATSAPP_NUMBER = '5491168172577';

const state = {
  courses: [...FALLBACK_COURSES],
  activeFilter: 'all',
  cart: loadCart(),
  paymentMethod: 'transferencia',
  selectedSlot: null,
  quizIndex: 0,
  quizScore: 0,
  quizAnswered: false
};

function loadCart() {
  try {
    const raw = localStorage.getItem('jv_cart_v1');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem('jv_cart_v1', JSON.stringify(state.cart));
  } catch {
    // ignore storage errors
  }
}

function formatArs(amount) {
  return `$${Number(amount).toLocaleString('es-AR')}`;
}

async function fetchCourses() {
  try {
    const res = await fetch('/api/courses');
    if (!res.ok) return;
    const data = await res.json();
    if (data?.ok && Array.isArray(data.courses) && data.courses.length > 0) {
      state.courses = data.courses;
    }
  } catch {
    // Fallback local ya cargado
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
    .map((course) => {
      const cashPrice = Math.round(course.priceArs * 0.9);
      const installmentNote =
        course.installments > 1
          ? `o ${course.installments} cuotas de ${formatArs(Math.round(course.priceArs / course.installments))}`
          : 'Pago único / transferencia';

      return `
        <article class="course-card ${course.highlight ? 'is-featured' : ''}">
          <div class="course-top">
            <span class="course-cat">${course.categoryLabel}</span>
            <span class="course-badge">${course.badge}</span>
          </div>
          <h3>${course.title}</h3>
          <p class="course-desc">${course.description}</p>
          <ul class="course-includes">
            ${course.includes.map((inc) => `<li>${inc}</li>`).join('')}
          </ul>
          <div class="course-pricing">
            <div class="price-row">
              <span class="price-value">${formatArs(cashPrice)}</span>
              <span style="font-size: 0.78rem; color: var(--jv-muted);">Contado / Transf.</span>
            </div>
            <div class="price-note">Lista: ${formatArs(course.priceArs)} · ${installmentNote}</div>
            <div class="course-btns">
              <button type="button" class="btn btn-primary btn-sm" data-add-cart="${course.id}">
                + Al Carrito
              </button>
              <button
                type="button"
                class="btn btn-outline btn-sm"
                data-select-booking="${course.id}"
                data-select-cat="${course.category}"
              >
                Sacar Turno
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  grid.querySelectorAll('[data-add-cart]').forEach((btn) => {
    btn.addEventListener('click', () => {
      addToCart(btn.getAttribute('data-add-cart'));
      openCartDrawer();
    });
  });

  grid.querySelectorAll('[data-select-booking]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const courseId = btn.getAttribute('data-select-booking');
      const cat = btn.getAttribute('data-select-cat');
      jumpToBooking(cat, courseId);
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
    opt.textContent = `${c.title} (${formatArs(Math.round(c.priceArs * 0.9))} trans.)`;
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
   CARRITO DE COMPRA ONLINE
   ========================================================================== */
function addToCart(courseId) {
  const existing = state.cart.find((item) => item.id === courseId);
  if (existing) {
    existing.qty = Math.min(10, existing.qty + 1);
  } else {
    state.cart.push({ id: courseId, qty: 1 });
  }
  saveCart();
  renderCart();
}

function updateCartQty(courseId, delta) {
  const item = state.cart.find((i) => i.id === courseId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter((i) => i.id !== courseId);
  }
  saveCart();
  renderCart();
}

function renderCart() {
  const countEl = document.getElementById('cart-count');
  const container = document.getElementById('cart-items-container');
  const footer = document.getElementById('cart-footer');
  if (!countEl || !container || !footer) return;

  const totalItems = state.cart.reduce((sum, i) => sum + i.qty, 0);
  countEl.textContent = String(totalItems);

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 36px 12px; color: var(--jv-muted);">
        <p style="font-weight: 700; color: var(--jv-asphalt); margin-bottom: 6px;">Tu carrito está vacío</p>
        <p style="font-size: 0.9rem; margin: 0 0 18px;">
          Elegí un pack de clases de auto manual, automático, moto o gran porte para calcular tu presupuesto online.
        </p>
        <a href="#cursos" class="btn btn-primary btn-sm" id="cart-browse-link">Ver Cursos</a>
      </div>
    `;
    footer.innerHTML = '';
    document.getElementById('cart-browse-link')?.addEventListener('click', closeCartDrawer);
    return;
  }

  let subtotal = 0;
  container.innerHTML = state.cart
    .map((cartItem) => {
      const course = state.courses.find((c) => c.id === cartItem.id);
      if (!course) return '';
      const lineTotal = course.priceArs * cartItem.qty;
      subtotal += lineTotal;
      return `
        <div class="cart-item">
          <div>
            <div class="cart-item-title">${course.title}</div>
            <div class="cart-item-meta">${course.vehicle} · ${formatArs(course.priceArs)} c/u</div>
            <div class="qty-controls">
              <button type="button" class="qty-btn" data-qty-minus="${course.id}" aria-label="Quitar uno">-</button>
              <span style="font-weight: 700; font-size: 0.9rem;">${cartItem.qty}</span>
              <button type="button" class="qty-btn" data-qty-plus="${course.id}" aria-label="Agregar uno">+</button>
            </div>
          </div>
          <div style="font-weight: 800;">${formatArs(lineTotal)}</div>
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

  const isTransfer = state.paymentMethod === 'transferencia';
  const discount = isTransfer ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  footer.innerHTML = `
    <div style="margin-bottom: 12px;">
      <label for="cart-payment-method" style="display: block; font-size: 0.82rem; font-weight: 700; margin-bottom: 5px;">
        Medio de pago
      </label>
      <select id="cart-payment-method" style="width: 100%; padding: 9px 11px; border-radius: 8px; border: 1px solid var(--jv-border);">
        <option value="transferencia" ${isTransfer ? 'selected' : ''}>Transferencia / Efectivo (10% OFF)</option>
        <option value="tarjeta" ${!isTransfer ? 'selected' : ''}>Tarjeta de Crédito / Mercado Pago (Cuotas)</option>
      </select>
    </div>
    <div class="summary-line"><span>Subtotal lista</span><span>${formatArs(subtotal)}</span></div>
    ${
      discount > 0
        ? `<div class="summary-line" style="color: var(--jv-green); font-weight: 600;"><span>Descuento transferencia (10%)</span><span>-${formatArs(discount)}</span></div>`
        : ''
    }
    <div class="summary-line summary-total"><span>Total estimado</span><span>${formatArs(total)}</span></div>
    <button type="button" class="btn btn-primary" style="width: 100%;" id="checkout-submit-btn">
      Finalizar Pedido Online / WhatsApp
    </button>
    <p style="font-size: 0.76rem; color: var(--jv-muted); text-align: center; margin: 8px 0 0;">
      Próximamente pago directo con Mercado Pago Checkout Pro integrado.
    </p>
  `;

  document.getElementById('cart-payment-method')?.addEventListener('change', (e) => {
    state.paymentMethod = e.target.value;
    renderCart();
  });

  document.getElementById('checkout-submit-btn')?.addEventListener('click', handleCheckout);
}

async function handleCheckout() {
  const btn = document.getElementById('checkout-submit-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Generando pedido...';
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
    // Fallback offline/static
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Finalizar Pedido Online / WhatsApp';
    }
  }

  // Fallback si corre sin Worker backend
  const lines = state.cart.map((it) => {
    const c = state.courses.find((x) => x.id === it.id);
    return `- ${it.qty}x ${c ? c.title : it.id}`;
  });
  const msg = `Hola JV Autoescuela! Quiero consultar/reservar mi pedido:\n${lines.join('\n')}`;
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
  if (now.getDay() === 0) {
    now.setDate(now.getDate() + 1);
  }
  return now.toISOString().split('T')[0];
}

function computeLocalSlots(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const day = dt.getUTCDay();
  if (day === 0) {
    return {
      closed: true,
      reason: 'Los domingos la autoescuela permanece cerrada. Atendemos de Lunes a Sábados.',
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
    if (res.ok) {
      data = await res.json();
    }
  } catch {
    data = null;
  }

  if (!data || !data.ok) {
    data = computeLocalSlots(date);
  }

  if (data.closed) {
    grid.innerHTML = '';
    helper.textContent = data.reason || 'Día cerrado.';
    return;
  }

  helper.textContent = `Horario de atención: ${data.dayType}. Elegí una franja de 60 minutos.`;
  grid.innerHTML = data.slots
    .map(
      (s) => `
      <button
        type="button"
        class="slot-btn"
        data-slot="${s.time}"
        ${s.available ? '' : 'disabled title="Horario ocupado"'}
      >
        ${s.time} hs
      </button>
    `
    )
    .join('');

  const firstAvailable = data.slots.find((s) => s.available);
  if (firstAvailable) {
    selectSlot(firstAvailable.time);
  }

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
      submitBtn.textContent = 'Confirmar Pre-Reserva y Generar Calendario';
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
    const waText = `Hola JV Autoescuela! Soy ${payload.name} (${payload.neighborhood}). Quiero reservar clase de ${payload.category} para el ${payload.date} a las ${payload.time} hs.`;
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
        Guardalo en tu Google Calendar y envianos el resumen por WhatsApp para confirmarlo en agenda.
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
   MINI SIMULADOR TEÓRICO PBA
   ========================================================================== */
function renderQuiz() {
  const progress = document.getElementById('quiz-progress');
  const body = document.getElementById('quiz-body');
  if (!progress || !body) return;

  if (state.quizIndex >= QUIZ_QUESTIONS.length) {
    progress.textContent = 'Resultado final';
    const pct = Math.round((state.quizScore / QUIZ_QUESTIONS.length) * 100);
    body.innerHTML = `
      <h3 class="quiz-question">Completaste el test: ${state.quizScore} de ${QUIZ_QUESTIONS.length} correctas (${pct}%)</h3>
      <p style="color: var(--jv-slate); font-size: 0.94rem;">
        ${
          pct >= 75
            ? '¡Excelente base teórica! En JV Autoescuela terminamos de pulir el examen práctico con vos en Hurlingham.'
            : 'Repasá las prioridades y velocidades máximas. Con nuestras clases te damos todo el material oficial para aprobar.'
        }
      </p>
      <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px;">
        <button type="button" class="btn btn-primary btn-sm" id="quiz-restart-btn">Volver a intentar</button>
        <a href="#turnero" class="btn btn-outline btn-sm">Practicar manejo real</a>
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
      ${q.options
        .map(
          (opt, idx) => `
          <button type="button" class="quiz-option" data-opt-idx="${idx}">${opt}</button>
        `
        )
        .join('')}
    </div>
    <div class="quiz-feedback" id="quiz-feedback" hidden></div>
    <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
      <button type="button" class="btn btn-dark btn-sm" id="quiz-next-btn" hidden>
        ${state.quizIndex + 1 === QUIZ_QUESTIONS.length ? 'Ver resultado' : 'Siguiente pregunta →'}
      </button>
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
   INICIALIZACIÓN GENERAL
   ========================================================================== */
function init() {
  // Menú móvil
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

  // Filtros de cursos
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeFilter = btn.getAttribute('data-category') || 'all';
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.toggle('is-active', b === btn));
      renderCourses();
    });
  });

  // Botones desde tarjetas de flota
  document.querySelectorAll('[data-filter-jump]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter-jump');
      state.activeFilter = cat;
      document.querySelectorAll('.filter-btn').forEach((b) => {
        b.classList.toggle('is-active', b.getAttribute('data-category') === cat);
      });
      renderCourses();
      document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-book-category]').forEach((btn) => {
    btn.addEventListener('click', () => {
      jumpToBooking(btn.getAttribute('data-book-category'));
    });
  });

  // Carrito drawer
  document.getElementById('open-cart-btn')?.addEventListener('click', openCartDrawer);
  document.getElementById('close-cart-btn')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cart-backdrop')?.addEventListener('click', closeCartDrawer);

  // Turnero
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const minDate = getNextValidDateString();
    dateInput.min = new Date().toISOString().split('T')[0];
    dateInput.value = minDate;
    dateInput.addEventListener('change', loadAvailability);
  }
  document.getElementById('booking-category')?.addEventListener('change', loadAvailability);
  document.getElementById('booking-form')?.addEventListener('submit', handleBookingSubmit);

  renderCourses();
  populateBookingCourseSelect();
  renderCart();
  loadAvailability();
  renderQuiz();
  fetchCourses();
}

document.addEventListener('DOMContentLoaded', init);
