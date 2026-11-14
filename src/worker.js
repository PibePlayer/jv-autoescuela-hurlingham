/**
 * Cloudflare Worker para JV Autoescuela (Hurlingham)
 * - Sirve los archivos estáticos compilados en ./dist mediante env.ASSETS
 * - Expone endpoints /api/* listos para:
 *   1. Catálogo de cursos y packs
 *   2. Disponibilidad horaria (preparado para Google Calendar API)
 *   3. Pre-reservas de turnos con link directo a Google Calendar & WhatsApp
 *   4. Pre-checkout de compra online (preparado para Mercado Pago Checkout Pro)
 */

export const COURSES_CATALOG = [
  {
    id: 'auto-manual-5',
    category: 'manual',
    categoryLabel: 'Auto Manual · VW Gol Rojo',
    title: 'Pack Inicial · 5 Clases en Gol Rojo',
    badge: 'Ideal si ya tenés noción',
    classesCount: 5,
    durationMin: 60,
    priceArs: 95000,
    installments: 3,
    highlight: false,
    vehicle: 'Volkswagen Gol Rojo Doble Comando',
    description:
      '5 clases prácticas individuales de 60 minutos en nuestro VW Gol rojo ploteado. Ideal para afianzar embrague, cambios, rotondas y estacionamiento.',
    includes: [
      'Instructor matriculado PBA',
      'VW Gol rojo con doble comando y VTV al día',
      'Práctica real en calles y avenidas de Hurlingham'
    ]
  },
  {
    id: 'auto-manual-10',
    category: 'manual',
    categoryLabel: 'Auto Manual · VW Gol Rojo',
    title: 'Curso Completo · 10 Clases + Simulación',
    badge: 'Más elegido en Hurlingham',
    classesCount: 10,
    durationMin: 60,
    priceArs: 175000,
    installments: 6,
    highlight: true,
    vehicle: 'Volkswagen Gol Rojo Doble Comando',
    description:
      'Nuestro curso estrella para aprender desde cero hasta rendir con total seguridad. Incluye simulacro de examen práctico y maniobras de estacionamiento.',
    includes: [
      'Aprendizaje progresivo desde cero',
      'Estacionamiento paralelo, a 45° y salida en pendiente',
      'Simulacro real de examen práctico en Hurlingham'
    ]
  },
  {
    id: 'auto-manual-15',
    category: 'manual',
    categoryLabel: 'Auto Manual · VW Gol Rojo',
    title: 'Pack Intensivo · 15 Clases Desde Cero',
    badge: 'Cero miedo al volante',
    classesCount: 15,
    durationMin: 60,
    priceArs: 249000,
    installments: 6,
    highlight: false,
    vehicle: 'Volkswagen Gol Rojo Doble Comando',
    description:
      'Pensado para quienes nunca manejaron o sienten nervios al tránsito. Acompañamiento paciente paso a paso hasta salir a avenidas y Acceso Oeste.',
    includes: [
      'Abordaje paciente para principiantes o amaxofobia',
      'Práctica urbana + avenidas de alto flujo (Av. Vergara)',
      'Seguimiento personalizado hasta tu licencia'
    ]
  },
  {
    id: 'auto-automatico-8',
    category: 'automatico',
    categoryLabel: 'Auto Caja Automática',
    title: 'Curso Caja Automática · 8 Clases',
    badge: 'Sin embrague ni tironeos',
    classesCount: 8,
    durationMin: 60,
    priceArs: 165000,
    installments: 6,
    highlight: false,
    vehicle: 'Unidad Automática Doble Comando',
    description:
      'Aprendé en vehículo automático moderno con doble comando. Enfocado en control de trayectoria, frenado suave, espejos y tránsito urbano.',
    includes: [
      'Unidad automática habilitada y asegurada',
      'Ideal para quienes manejan o rinden con caja AT',
      'Estacionamiento y conducción defensiva'
    ]
  },
  {
    id: 'moto-cilindrada',
    category: 'moto',
    categoryLabel: 'Motos · Todas las Cilindradas',
    title: 'Curso Moto · 6 Clases por Cilindrada',
    badge: 'Cat. A1.1 a A1.4 / A2',
    classesCount: 6,
    durationMin: 60,
    priceArs: 115000,
    installments: 3,
    highlight: false,
    vehicle: 'Motos 110cc / 150cc / +250cc',
    description:
      'Entrenamiento específico según la cilindrada de tu licencia. Slalom entre conos, equilibrio a baja velocidad, contramanillar y frenado de emergencia.',
    includes: [
      'Práctica para todas las cilindradas (110cc a +300cc)',
      'Circuito de conos idéntico al examen municipal',
      'Técnicas de frenado y postura segura'
    ]
  },
  {
    id: 'gran-porte-pro',
    category: 'gran-porte',
    categoryLabel: 'Camiones y Colectivos',
    title: 'Capacitación Gran Porte · Camiones y Colectivos',
    badge: 'Licencias Profesionales C / D / E',
    classesCount: 5,
    durationMin: 60,
    priceArs: 210000,
    installments: 6,
    highlight: false,
    vehicle: 'Camión / Colectivo (Gran Porte)',
    description:
      'Preparación especializada para conductores profesionales de carga y pasajeros. Puntos ciegos, radios de giro amplios, retroceso con espejos y maniobras.',
    includes: [
      'Categorías profesionales C1, C2, C3, D1–D3 y E1',
      'Maniobras de precisión, acoplado y retroceso',
      'Preparación integral para examen profesional'
    ]
  },
  {
    id: 'extra-estacionamiento',
    category: 'extras',
    categoryLabel: 'Clases a Medida',
    title: 'Módulo Estacionamiento & Autopista (2 Clases)',
    badge: 'Perfeccionamiento puntual',
    classesCount: 2,
    durationMin: 60,
    priceArs: 42000,
    installments: 3,
    highlight: false,
    vehicle: 'VW Gol Rojo o Automático',
    description:
      '¿Ya sabés circular pero te cuesta estacionar entre dos autos o subir a autopista? En 2 clases intensivas dominás las referencias exactas.',
    includes: [
      'Referencias visuales infalibles para estacionar',
      'Incorporación a autopista y sobrepaso seguro',
      'Corrección de vicios de manejo'
    ]
  },
  {
    id: 'extra-examen-alquiler',
    category: 'extras',
    categoryLabel: 'Examen Práctico',
    title: 'Auto Habilitado para Rendir Examen',
    badge: 'En Hurlingham',
    classesCount: 1,
    durationMin: 90,
    priceArs: 55000,
    installments: 1,
    highlight: false,
    vehicle: 'Unidad JV Habilitada + Acompañamiento',
    description:
      'Vamos con vos a la pista de examen municipal con nuestro vehículo habilitado, VTV, seguro de enseñanza vigente y clase previa de precalentamiento.',
    includes: [
      '30 min de repaso previo antes de ingresar a pista',
      'Vehículo con toda la documentación oficial al día',
      'Acompañamiento de instructor matriculado'
    ]
  }
];

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

function getDayOfWeekArgentina(dateStr) {
  // dateStr format: YYYY-MM-DD
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return null;
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return dt.getUTCDay(); // 0 = Domingo, 6 = Sábado
}

function buildSlotsForDate(dateStr) {
  const day = getDayOfWeekArgentina(dateStr);
  if (day === null) return { closed: true, reason: 'Fecha inválida', slots: [] };
  if (day === 0) {
    return {
      closed: true,
      reason: 'Los domingos la autoescuela permanece cerrada. Atendemos de Lunes a Sábados.',
      slots: []
    };
  }

  // Lunes a Viernes: 08:00 a 18:00 (último turno 17:00)
  // Sábados: 09:00 a 13:00 (último turno 12:00)
  const hours =
    day === 6
      ? ['09:00', '10:00', '11:00', '12:00']
      : ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  // Simulación determinística de ocupación hasta conectar Google Calendar API real
  const seed = dateStr.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const slots = hours.map((time, idx) => {
    const busy = (seed + idx * 3) % 7 === 0;
    return {
      time,
      available: !busy,
      instructor: idx % 2 === 0 ? 'Instructor Titular (VW Gol Rojo / Flota)' : 'Equipo JV Hurlingham'
    };
  });

  return {
    closed: false,
    dayType: day === 6 ? 'Sábado (9 a 13 hs)' : 'Lunes a Viernes (8 a 18 hs)',
    slots
  };
}

function buildGoogleCalendarLink({ title, date, time, durationMin = 60, details, location }) {
  const [y, m, d] = date.split('-');
  const [hh, mm] = time.split(':').map(Number);
  const startStr = `${y}${m}${d}T${String(hh).padStart(2, '0')}${String(mm).padStart(2, '0')}00`;
  const endHour = hh + Math.floor((mm + durationMin) / 60);
  const endMin = (mm + durationMin) % 60;
  const endStr = `${y}${m}${d}T${String(endHour).padStart(2, '0')}${String(endMin).padStart(2, '0')}00`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startStr}/${endStr}`,
    ctz: 'America/Argentina/Buenos_Aires',
    details,
    location
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    if (pathname.startsWith('/api/')) {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        });
      }

      if (pathname === '/api/health' && request.method === 'GET') {
        return jsonResponse({
          ok: true,
          school: env.SCHOOL_NAME || 'JV Autoescuela',
          city: env.SCHOOL_CITY || 'Hurlingham, Buenos Aires',
          integrations: {
            googleCalendarApi: Boolean(env.GOOGLE_CALENDAR_ID && env.GOOGLE_PRIVATE_KEY),
            mercadoPago: Boolean(env.MP_ACCESS_TOKEN),
            d1Database: Boolean(env.DB)
          }
        });
      }

      if (pathname === '/api/courses' && request.method === 'GET') {
        return jsonResponse({
          ok: true,
          currency: 'ARS',
          courses: COURSES_CATALOG
        });
      }

      if (pathname === '/api/availability' && request.method === 'GET') {
        const date = searchParams.get('date');
        const category = searchParams.get('category') || 'manual';
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return jsonResponse({ ok: false, error: 'Parámetro date requerido (YYYY-MM-DD).' }, 400);
        }

        // Nota de arquitectura futura:
        // Si env.GOOGLE_CALENDAR_ID y env.GOOGLE_PRIVATE_KEY están configurados,
        // aquí se consultará Google Calendar FreeBusy API antes de devolver los slots.
        const availability = buildSlotsForDate(date);
        return jsonResponse({
          ok: true,
          date,
          category,
          source: env.GOOGLE_CALENDAR_ID ? 'google-calendar' : 'schedule-rules',
          ...availability
        });
      }

      if (pathname === '/api/bookings' && request.method === 'POST') {
        try {
          const body = await request.json();
          const { name, phone, neighborhood, category, courseId, date, time, experience, notes } = body;

          if (!name || !phone || !date || !time || !category) {
            return jsonResponse(
              { ok: false, error: 'Completá nombre, WhatsApp, vehículo, fecha y horario.' },
              400
            );
          }

          const course = COURSES_CATALOG.find((c) => c.id === courseId) || null;
          const bookingCode = `JV-${date.replaceAll('-', '').slice(2)}-${Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase()}`;

          const categoryNames = {
            manual: 'Auto Manual (VW Gol Rojo)',
            automatico: 'Auto Caja Automática',
            moto: 'Moto (Indicar cilindrada)',
            'gran-porte': 'Gran Porte (Camión / Colectivo)'
          };

          const vehicleLabel = categoryNames[category] || category;
          const address = env.SCHOOL_ADDRESS || 'Av. Gobernador Vergara 3855, Hurlingham';
          const waNumber = env.SCHOOL_WHATSAPP || '5491168172577';

          const calendarTitle = `Clase JV Autoescuela · ${vehicleLabel}`;
          const calendarDetails = [
            `Código de pre-reserva: ${bookingCode}`,
            `Alumno: ${name}`,
            `WhatsApp: ${phone}`,
            `Zona: ${neighborhood || 'Hurlingham'}`,
            course ? `Curso: ${course.title}` : `Modalidad: ${vehicleLabel}`,
            `Experiencia: ${experience || 'No especificada'}`,
            notes ? `Observaciones: ${notes}` : ''
          ]
            .filter(Boolean)
            .join('\n');

          const googleCalendarUrl = buildGoogleCalendarLink({
            title: calendarTitle,
            date,
            time,
            durationMin: 60,
            details: calendarDetails,
            location: address
          });

          const waMessage = [
            `Hola JV Autoescuela! Quiero confirmar mi pre-reserva de turno:`,
            `• Código: ${bookingCode}`,
            `• Nombre: ${name}`,
            `• Zona: ${neighborhood || 'Hurlingham'}`,
            `• Vehículo / Categoría: ${vehicleLabel}`,
            course ? `• Pack / Curso: ${course.title}` : null,
            `• Fecha y hora solicitada: ${date} a las ${time} hs`,
            `• Nivel: ${experience || 'A definir'}`,
            notes ? `• Nota: ${notes}` : null
          ]
            .filter(Boolean)
            .join('\n');

          const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

          return jsonResponse({
            ok: true,
            booking: {
              code: bookingCode,
              status: 'pending_confirmation',
              name,
              phone,
              neighborhood: neighborhood || 'Hurlingham',
              vehicleLabel,
              courseTitle: course ? course.title : null,
              date,
              time,
              googleCalendarUrl,
              whatsappUrl
            }
          });
        } catch {
          return jsonResponse({ ok: false, error: 'JSON inválido en la solicitud.' }, 400);
        }
      }

      if (pathname === '/api/checkout' && request.method === 'POST') {
        try {
          const body = await request.json();
          const { items = [], paymentMethod = 'transferencia', customer = {} } = body;

          if (!Array.isArray(items) || items.length === 0) {
            return jsonResponse({ ok: false, error: 'Tu carrito está vacío.' }, 400);
          }

          let subtotal = 0;
          const resolvedItems = [];

          for (const item of items) {
            const catalogItem = COURSES_CATALOG.find((c) => c.id === item.id);
            if (!catalogItem) continue;
            const qty = Math.max(1, Math.min(10, Number(item.qty) || 1));
            subtotal += catalogItem.priceArs * qty;
            resolvedItems.push({
              id: catalogItem.id,
              title: catalogItem.title,
              qty,
              unitPrice: catalogItem.priceArs,
              lineTotal: catalogItem.priceArs * qty
            });
          }

          if (resolvedItems.length === 0) {
            return jsonResponse({ ok: false, error: 'No se encontraron cursos válidos.' }, 400);
          }

          const discountRate = paymentMethod === 'transferencia' ? 0.1 : 0;
          const discountAmount = Math.round(subtotal * discountRate);
          const total = subtotal - discountAmount;
          const orderCode = `ORD-${Date.now().toString().slice(-6)}`;
          const waNumber = env.SCHOOL_WHATSAPP || '5491168172577';

          const summaryLines = resolvedItems.map(
            (it) => `- ${it.qty}x ${it.title} ($${it.lineTotal.toLocaleString('es-AR')})`
          );
          const waText = [
            `Hola JV Autoescuela! Armé mi pedido online (${orderCode}):`,
            ...summaryLines,
            `Medio de pago elegido: ${
              paymentMethod === 'transferencia' ? 'Transferencia / Efectivo (10% OFF)' : 'Cuotas con Tarjeta / Mercado Pago'
            }`,
            `Total estimado: $${total.toLocaleString('es-AR')}`,
            customer.name ? `Alumno: ${customer.name}` : null,
            customer.phone ? `Tel: ${customer.phone}` : null,
            `Quiero coordinar el pago y mi primer turno!`
          ]
            .filter(Boolean)
            .join('\n');

          return jsonResponse({
            ok: true,
            order: {
              code: orderCode,
              mode: env.MP_ACCESS_TOKEN ? 'mercadopago-live' : 'whatsapp-reservation',
              items: resolvedItems,
              subtotal,
              discountAmount,
              total,
              paymentMethod,
              whatsappUrl: `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`
            }
          });
        } catch {
          return jsonResponse({ ok: false, error: 'Error procesando el pedido.' }, 400);
        }
      }

      return jsonResponse({ ok: false, error: 'Endpoint no encontrado.' }, 404);
    }

    // Sirve la SPA estática desde ./dist mediante Workers Static Assets
    return env.ASSETS.fetch(request);
  }
};
