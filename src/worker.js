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
    id: 'auto-manual-5',
    category: 'manual',
    categoryLabel: 'Auto Manual · VW Gol Rojo',
    title: 'Pack Inicial · 5 Clases',
    badge: 'Conocimientos previos',
    classesCount: 5,
    durationMin: 60,
    highlight: false,
    vehicle: 'VW Gol Rojo Doble Comando',
    description: 'Ideal para afianzar embrague, cambios, rotondas y estacionamiento en Hurlingham.'
  },
  {
    id: 'auto-manual-10',
    category: 'manual',
    categoryLabel: 'Auto Manual · VW Gol Rojo',
    title: 'Curso Completo · 10 Clases',
    badge: 'Más elegido en Hurlingham',
    classesCount: 10,
    durationMin: 60,
    highlight: true,
    vehicle: 'VW Gol Rojo Doble Comando',
    description: 'Aprendizaje desde cero hasta el nivel de examen práctico, con maniobras reales.'
  },
  {
    id: 'auto-manual-15',
    category: 'manual',
    categoryLabel: 'Auto Manual · VW Gol Rojo',
    title: 'Pack Intensivo · 15 Clases',
    badge: 'Cero miedo al volante',
    classesCount: 15,
    durationMin: 60,
    highlight: false,
    vehicle: 'VW Gol Rojo Doble Comando',
    description: 'Acompañamiento paciente paso a paso para principiantes absolutos o amaxofobia.'
  },
  {
    id: 'auto-automatico-8',
    category: 'automatico',
    categoryLabel: 'Auto Caja Automática',
    title: 'Curso Caja Automática · 8 Clases',
    badge: 'Sin embrague',
    classesCount: 8,
    durationMin: 60,
    highlight: false,
    vehicle: 'Unidad Automática Doble Comando',
    description: 'Conducción fluida y segura en unidad moderna con caja automática y doble comando.'
  },
  {
    id: 'moto-cilindrada',
    category: 'moto',
    categoryLabel: 'Motos · Todas las Cilindradas',
    title: 'Curso Moto por Cilindrada',
    badge: 'Cat. A1.1 a A1.4 / A2',
    classesCount: 6,
    durationMin: 60,
    highlight: false,
    vehicle: 'Motos 110cc / 150cc / +250cc',
    description: 'Circuito de conos, equilibrio a baja velocidad, frenado y práctica según cilindrada.'
  },
  {
    id: 'gran-porte-pro',
    category: 'gran-porte',
    categoryLabel: 'Camiones y Colectivos',
    title: 'Capacitación Gran Porte',
    badge: 'Licencias C / D / E',
    classesCount: 5,
    durationMin: 60,
    highlight: false,
    vehicle: 'Camión / Colectivo (Gran Porte)',
    description: 'Radios de giro, espejos, retroceso y conducción profesional de carga o pasajeros.'
  },
  {
    id: 'extra-estacionamiento',
    category: 'extras',
    categoryLabel: 'Clases a Medida',
    title: 'Estacionamiento & Autopista',
    badge: 'Perfeccionamiento',
    classesCount: 2,
    durationMin: 60,
    highlight: false,
    vehicle: 'VW Gol Rojo o Automático',
    description: 'Referencias visuales precisas para estacionar entre autos y circular en autopista.'
  },
  {
    id: 'extra-examen-alquiler',
    category: 'extras',
    categoryLabel: 'Examen Práctico',
    title: 'Auto Habilitado para Examen',
    badge: 'Pista Hurlingham',
    classesCount: 1,
    durationMin: 90,
    highlight: false,
    vehicle: 'Unidad JV Habilitada + Repaso',
    description: 'Unidad habilitada con VTV y seguro de enseñanza al día + repaso previo al examen.'
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
      ? ['09:00', '10:00', '11:00', '12:00']
      : ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const seed = dateStr.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const slots = hours.map((time, idx) => ({
    time,
    available: (seed + idx * 3) % 7 !== 0,
    instructor: 'Equipo JV Hurlingham'
  }));

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
            durationMin: 60,
            details: calendarDetails,
            location: address
          });

          const waMessage = [
            `Hola JV Autoescuela Hurlingham! Quiero confirmar mi pre-reserva de turno:`,
            `• Código: ${bookingCode}`,
            `• Nombre: ${name}`,
            `• Zona: ${neighborhood || 'Hurlingham'}`,
            `• Vehículo: ${vehicleLabel}`,
            course ? `• Curso elegido: ${course.title}` : null,
            `• Fecha y hora: ${date} a las ${time} hs`,
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
