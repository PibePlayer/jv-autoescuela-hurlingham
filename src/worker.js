/**
 * Cloudflare Worker para JV Autoescuela (Hurlingham)
 * - Sirve los archivos estáticos compilados en ./dist mediante env.ASSETS
 * - Expone endpoints /api/* preparados para:
 *   1. Catálogo de cursos (sin precios hardcodeados; listos para definir o conectar a D1)
 *   2. Disponibilidad horaria (preparado para Google Calendar API)
 *   3. Pre-reservas de turnos con link directo a Google Calendar & WhatsApp
 *   4. Solicitud de presupuesto / compra online (preparado para Mercado Pago Checkout Pro)
 */

export const COURSES_CATALOG = [
  {
    id: 'auto-manual-1',
    category: 'manual',
    categoryLabel: 'Auto Manual · VW Gol Rojo',
    title: 'Clase Individual · 45 min',
    badge: 'Personalizada',
    classesCount: 1,
    durationMin: 45,
    metaLabel: '1 clase personalizada · 45 min · VW Gol Rojo',
    highlight: false,
    vehicle: 'VW Gol Rojo Doble Pedalera',
    description: 'Clase puntual de 45 minutos adaptada a lo que necesitás reforzar: estacionamiento, rotondas, autopista o evaluación.'
  },
  {
    id: 'auto-manual-4',
    category: 'manual',
    categoryLabel: 'Auto Manual · VW Gol Rojo',
    title: 'Curso de 4 Clases',
    badge: 'Ya sabés manejar · Pre-examen',
    classesCount: 4,
    durationMin: 45,
    metaLabel: '4 clases · 45 min c/u · VW Gol Rojo',
    highlight: false,
    vehicle: 'VW Gol Rojo Doble Pedalera',
    description: 'Para quienes ya saben manejar pero necesitan afianzar maniobras puntuales, estacionamiento o ganar seguridad para rendir.'
  },
  {
    id: 'auto-manual-6',
    category: 'manual',
    categoryLabel: 'Auto Manual · VW Gol Rojo',
    title: 'Curso de 6 Clases',
    badge: 'Conocimientos básicos',
    classesCount: 6,
    durationMin: 45,
    metaLabel: '6 clases · 45 min c/u · VW Gol Rojo',
    highlight: false,
    vehicle: 'VW Gol Rojo Doble Pedalera',
    description: 'Para quienes tuvieron poca experiencia o conocen lo básico y buscan soltarse con seguridad en el tránsito real.'
  },
  {
    id: 'auto-manual-10',
    category: 'manual',
    categoryLabel: 'Auto Manual · VW Gol Rojo',
    title: 'Curso de 10 Clases',
    badge: 'Empezando desde 0 · Más elegido',
    classesCount: 10,
    durationMin: 45,
    metaLabel: '10 clases · 45 min c/u · VW Gol Rojo',
    highlight: true,
    vehicle: 'VW Gol Rojo Doble Pedalera',
    description: 'Ideal para empezar desde cero: aprendés paso a paso desde el primer arranque hasta dominar la calle y rendir el examen.'
  },
  {
    id: 'auto-automatico',
    category: 'automatico',
    categoryLabel: 'Auto Caja Automática',
    title: 'Auto Automático · A Medida',
    badge: 'Individual o 4 / 6 / 10 clases',
    classesCount: 6,
    durationMin: 45,
    metaLabel: 'Individual o 4, 6 o 10 clases · 45 min · Automático',
    highlight: false,
    vehicle: 'Unidad Automática Doble Pedalera',
    description: 'Clases individuales o packs de 4, 6 y 10 clases de 45 minutos en vehículo automático con doble pedalera.'
  },
  {
    id: 'moto-cilindrada',
    category: 'moto',
    categoryLabel: 'Motos · Todas las Cilindradas',
    title: 'Moto por Cilindrada',
    badge: 'Individual o 4 / 6 / 10 clases',
    classesCount: 4,
    durationMin: 45,
    metaLabel: 'Individual o 4, 6 o 10 clases · 45 min · Todas las CC',
    highlight: false,
    vehicle: 'Motos según cilindrada (A1 / A2)',
    description: 'Clases personalizadas de 45 minutos o packs de 4, 6 y 10 clases: conos, equilibrio, frenado y pista oficial.'
  },
  {
    id: 'gran-porte-pro',
    category: 'gran-porte',
    categoryLabel: 'Camiones y Colectivos',
    title: 'Vehículos de Gran Porte',
    badge: 'Individual o 4 / 6 / 10 clases',
    classesCount: 4,
    durationMin: 45,
    metaLabel: 'Individual o 4, 6 o 10 clases · 45 min · Cat. C / D / E',
    highlight: false,
    vehicle: 'Camión / Colectivo (Gran Porte)',
    description: 'Práctica personalizada de 45 minutos para licencias profesionales: radios de giro, espejos y retroceso.'
  },
  {
    id: 'extra-examen-alquiler',
    category: 'extras',
    categoryLabel: 'Examen Práctico',
    title: 'Auto Habilitado para Examen',
    badge: 'Pista Hurlingham',
    classesCount: 1,
    durationMin: 45,
    metaLabel: 'Unidad habilitada + repaso 45 min',
    highlight: false,
    vehicle: 'Unidad JV Habilitada + Repaso 45 min',
    description: 'Alquiler de unidad habilitada con VTV y seguro de enseñanza al día + clase previa de repaso de 45 minutos.'
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
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return null;
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return dt.getUTCDay();
}

function buildSlotsForDate(dateStr) {
  const day = getDayOfWeekArgentina(dateStr);
  if (day === null) return { closed: true, reason: 'Fecha inválida', slots: [] };
  if (day === 0) {
    return {
      closed: true,
      reason: 'Los domingos permanecemos cerrados. Atendemos de Lunes a Sábados.',
      slots: []
    };
  }

  const hours =
    day === 6
      ? ['09:00', '09:45', '10:30', '11:15', '12:00']
      : ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  const slots = hours.map((time) => ({
    time,
    available: true,
    status: 'to_confirm'
  }));

  return {
    closed: false,
    requiresConfirmation: true,
    classDurationMin: 45,
    dayType: day === 6 ? 'Sábado (9 a 13 hs)' : 'Lunes a Viernes (8 a 18 hs)',
    slots
  };
}

function buildGoogleCalendarLink({ title, date, time, durationMin = 45, details, location }) {
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
          courses: COURSES_CATALOG
        });
      }

      if (pathname === '/api/availability' && request.method === 'GET') {
        const date = searchParams.get('date');
        const category = searchParams.get('category') || 'manual';
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return jsonResponse({ ok: false, error: 'Parámetro date requerido (YYYY-MM-DD).' }, 400);
        }

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
            `Nivel: ${experience || 'No especificado'}`,
            notes ? `Notas: ${notes}` : ''
          ]
            .filter(Boolean)
            .join('\n');

          const googleCalendarUrl = buildGoogleCalendarLink({
            title: calendarTitle,
            date,
            time,
            durationMin: 45,
            details: calendarDetails,
            location: address
          });

          const waMessage = [
            `Hola JV Autoescuela Hurlingham! Quiero confirmar disponibilidad para esta pre-reserva:`,
            `• Código: ${bookingCode}`,
            `• Nombre: ${name}`,
            `• Zona: ${neighborhood || 'Hurlingham'}`,
            `• Vehículo: ${vehicleLabel}`,
            course ? `• Modalidad elegida: ${course.title}` : null,
            `• Fecha y hora preferida: ${date} a las ${time} hs (clase de 45 min)`,
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
              durationMin: 45,
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
            return jsonResponse({ ok: false, error: 'Tu selección está vacía.' }, 400);
          }

          const resolvedItems = [];
          for (const item of items) {
            const catalogItem = COURSES_CATALOG.find((c) => c.id === item.id);
            if (!catalogItem) continue;
            const qty = Math.max(1, Math.min(10, Number(item.qty) || 1));
            resolvedItems.push({
              id: catalogItem.id,
              title: catalogItem.title,
              vehicle: catalogItem.vehicle,
              qty
            });
          }

          if (resolvedItems.length === 0) {
            return jsonResponse({ ok: false, error: 'No se encontraron cursos válidos.' }, 400);
          }

          const orderCode = `SOL-${Date.now().toString().slice(-6)}`;
          const waNumber = env.SCHOOL_WHATSAPP || '5491168172577';
          const summaryLines = resolvedItems.map((it) => `- ${it.qty}x ${it.title} (${it.vehicle})`);
          const waText = [
            `Hola JV Autoescuela Hurlingham! Quiero consultar el valor y disponibilidad (${orderCode}):`,
            ...summaryLines,
            `Forma de pago preferida: ${
              paymentMethod === 'transferencia' ? 'Transferencia / Efectivo' : 'Cuotas / Tarjeta'
            }`,
            customer.name ? `Nombre: ${customer.name}` : null,
            '¿Me pasan el valor actualizado y opciones de horario?'
          ]
            .filter(Boolean)
            .join('\n');

          return jsonResponse({
            ok: true,
            order: {
              code: orderCode,
              mode: env.MP_ACCESS_TOKEN ? 'mercadopago-live' : 'quote-whatsapp',
              items: resolvedItems,
              paymentMethod,
              whatsappUrl: `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`
            }
          });
        } catch {
          return jsonResponse({ ok: false, error: 'Error procesando la solicitud.' }, 400);
        }
      }

      return jsonResponse({ ok: false, error: 'Endpoint no encontrado.' }, 404);
    }

    return env.ASSETS.fetch(request);
  }
};
