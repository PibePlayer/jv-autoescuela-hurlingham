export const HERO_SLIDES = [
  {
    eyebrow: 'Autoescuela N° 1 de Hurlingham · Habilitada PBA',
    title: 'Aprendé a manejar de verdad en Hurlingham.',
    lead: 'Clases individuales con instructores matriculados en nuestro VW Gol rojo con doble pedalera. Hacemos la diferencia desde el primer día.',
    ctaPrimary: { label: 'Elegir Curso', href: '#cursos' },
    ctaSecondary: { label: 'Reservar Turno', href: '#turnero' },
    image: '/images/gol-rojo-real.png',
    captionTitle: 'Flota Real JV Autoescuela · Hurlingham',
    captionSub: 'VW Gol Rojo Doble Pedalera · 11-6817-2577'
  },
  {
    eyebrow: 'Todas las Categorías en Hurlingham',
    title: 'Auto manual, automático, motos y gran porte.',
    lead: 'Capacitación real para autos (caja manual o automática), motos en todas las cilindradas, camiones y colectivos profesionales.',
    ctaPrimary: { label: 'Ver Categorías', href: '#categorias' },
    ctaSecondary: { label: 'Consultar por WhatsApp', href: 'https://wa.me/5491168172577', external: true },
    image: '/images/auto-automatico-jv.jpg',
    captionTitle: 'Todas las Licencias · Cat. A, B, C, D y E',
    captionSub: 'Preparación práctica y teórica PBA'
  },
  {
    eyebrow: 'Calidad Profesional vs. Improvisación',
    title: 'Hacemos la diferencia en cada clase.',
    lead: 'Unidades con VTV y seguro de enseñanza al día, clases personalizadas de 45 minutos (individuales o packs de 4, 6 y 10 clases) por Av. Vergara y seguimiento paciente.',
    ctaPrimary: { label: 'Por qué elegir JV', href: '#calidad' },
    ctaSecondary: { label: 'Sacar Turno Online', href: '#turnero' },
    image: '/images/motos-jv.jpg',
    captionTitle: '4.8 ★ en Google (+256 reseñas reales)',
    captionSub: 'Av. Gobernador Vergara 3855, Hurlingham'
  }
];

export const FLEET_CATEGORIES = [
  {
    id: 'manual',
    tabLabel: 'Auto Manual · Gol Rojo',
    license: 'Categoría B1 · Caja Manual',
    title: 'Auto Caja Manual en nuestro VW Gol Rojo',
    image: '/images/gol-rojo-real.png',
    imageAlt: 'Volkswagen Gol rojo real ploteado JV Autoescuela Hurlingham',
    summary:
      'Nuestro clásico VW Gol rojo ploteado con doble pedalera certificado. Aprendés embrague, cambios, arranque en pendiente y estacionamiento real por las calles y avenidas de Hurlingham.',
    bullets: [
      'Doble pedalera, VTV y seguro de enseñanza al día',
      'Clases individuales de 45 min o cursos de 4, 6 y 10 clases',
      'Opción de unidad habilitada para el día del examen práctico'
    ]
  },
  {
    id: 'automatico',
    tabLabel: 'Auto Caja Automática',
    license: 'Categoría B1 · Caja Automática',
    title: 'Auto Caja Automática · Conducción Fluida',
    image: '/images/auto-automatico-jv.jpg',
    imageAlt: 'Auto caja automática JV Autoescuela Hurlingham',
    summary:
      'Enseñanza en vehículo moderno automático con doble pedalera. Ideal si tu auto es automático o querés concentrarte 100% en el tránsito, espejos y estacionamiento sin estrés.',
    bullets: [
      'Unidad automática habilitada con mantenimiento riguroso',
      'Clases personalizadas de 45 min (individuales o packs de 4, 6 o 10)',
      'Estacionamiento paralelo, a 45° y salida a autopista'
    ]
  },
  {
    id: 'moto',
    tabLabel: 'Motos · Todas CC',
    license: 'Categorías A1.1 a A1.4 / A2',
    title: 'Motos en Todas las Cilindradas',
    image: '/images/motos-jv.jpg',
    imageAlt: 'Entrenamiento en moto con conos JV Autoescuela',
    summary:
      'Entrenamiento específico según la cilindrada de tu licencia: desde 110cc y 150cc hasta motos medianas y de alta cilindrada (+300cc).',
    bullets: [
      'Circuito de conos (slalom), equilibrio a baja velocidad y ocho',
      'Frenado de emergencia progresivo, postura y mirada',
      'Clases de 45 min individuales o cursos de 4, 6 y 10 clases'
    ]
  },
  {
    id: 'gran-porte',
    tabLabel: 'Camiones y Colectivos',
    license: 'Profesional C1–C3 · D1–D3 · E1',
    title: 'Vehículos de Gran Porte · Camiones y Colectivos',
    image: '/images/gran-porte-jv.jpg',
    imageAlt: 'Camión y colectivo de gran porte JV Autoescuela',
    summary:
      'Capacitación técnica para licencias profesionales de transporte de cargas y pasajeros. Dominá maniobras de precisión con seguridad.',
    bullets: [
      'Radios de giro amplios, gálibo y control de puntos ciegos',
      'Retroceso guiado con espejos gran angular y acoplado',
      'Clases personalizadas de 45 min para examen y salida laboral'
    ]
  }
];

export const FALLBACK_COURSES = [
  {
    id: 'auto-manual-1',
    category: 'manual',
    categoryLabel: 'Auto Manual · VW Gol Rojo',
    title: 'Clase Individual / Personalizada',
    badge: '45 min · A tu ritmo',
    classesCount: 1,
    durationMin: 45,
    metaLabel: '1 clase personalizada · 45 min · VW Gol Rojo',
    highlight: false,
    vehicle: 'VW Gol Rojo Doble Pedalera',
    description: 'Clase puntual de 45 minutos adaptada a lo que necesitás reforzar: estacionamiento, embrague o tránsito en Hurlingham.'
  },
  {
    id: 'auto-manual-4',
    category: 'manual',
    categoryLabel: 'Auto Manual · VW Gol Rojo',
    title: 'Curso Inicial · 4 Clases',
    badge: '4 clases de 45 min',
    classesCount: 4,
    durationMin: 45,
    metaLabel: '4 clases · 45 min c/u · VW Gol Rojo',
    highlight: false,
    vehicle: 'VW Gol Rojo Doble Pedalera',
    description: '4 clases individuales de 45 minutos para afianzar embrague, cambios, rotondas y maniobras clave.'
  },
  {
    id: 'auto-manual-6',
    category: 'manual',
    categoryLabel: 'Auto Manual · VW Gol Rojo',
    title: 'Curso Intermedio · 6 Clases',
    badge: '6 clases de 45 min',
    classesCount: 6,
    durationMin: 45,
    metaLabel: '6 clases · 45 min c/u · VW Gol Rojo',
    highlight: false,
    vehicle: 'VW Gol Rojo Doble Pedalera',
    description: '6 clases prácticas de 45 minutos por Av. Vergara, avenidas, estacionamiento y preparación para rendir.'
  },
  {
    id: 'auto-manual-10',
    category: 'manual',
    categoryLabel: 'Auto Manual · VW Gol Rojo',
    title: 'Curso Completo · 10 Clases',
    badge: 'Más elegido en Hurlingham',
    classesCount: 10,
    durationMin: 45,
    metaLabel: '10 clases · 45 min c/u · VW Gol Rojo',
    highlight: true,
    vehicle: 'VW Gol Rojo Doble Pedalera',
    description: '10 clases individuales de 45 minutos desde cero hasta dominar el tránsito real y el examen práctico.'
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
    description: 'Clases individuales personalizadas o cursos de 4, 6 o 10 clases de 45 minutos en unidad automática con doble pedalera.'
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
    description: 'Clases personalizadas de 45 minutos o cursos de 4, 6 o 10 clases: conos, equilibrio, frenado y pista.'
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
    description: 'Clases personalizadas de 45 minutos para licencias profesionales: radios de giro, espejos y retroceso.'
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
    description: 'Unidad habilitada con VTV y seguro de enseñanza al día + clase previa personalizada de 45 minutos.'
  }
];

export const QUIZ_QUESTIONS = [
  {
    question: 'En una esquina sin semáforo en Provincia de Buenos Aires, ¿quién tiene prioridad de paso?',
    options: [
      'El vehículo de mayor tamaño',
      'El conductor que se aproxima por la derecha',
      'El que circula más rápido'
    ],
    correctIndex: 1,
    explanation: 'Según la Ley de Tránsito (Art. 41), se debe ceder el paso al vehículo que cruza desde la derecha.'
  },
  {
    question: 'Al aproximarse a una rotonda, ¿qué vehículo tiene la prioridad de paso?',
    options: [
      'El que intenta ingresar desde la avenida',
      'El que ya circula dentro de la rotonda',
      'El que ingresa por la derecha'
    ],
    correctIndex: 1,
    explanation: 'En rotondas tiene prioridad absoluta quien ya circula dentro sobre el que intenta ingresar.'
  },
  {
    question: '¿Cuál es la velocidad máxima permitida en avenidas urbanas (salvo señalización)?',
    options: ['40 km/h', '60 km/h', '80 km/h'],
    correctIndex: 1,
    explanation: 'En zona urbana la máxima general es 40 km/h en calles y 60 km/h en avenidas.'
  },
  {
    question: 'En Provincia de Buenos Aires, respecto al alcohol al volante rige:',
    options: [
      'Tolerancia hasta 0,5 g/l',
      'Alcohol Cero (0,0 g/l) para todas las categorías',
      'Tolerancia de 0,2 g/l solo para autos'
    ],
    correctIndex: 1,
    explanation: 'La Ley de Alcohol Cero en PBA establece tolerancia 0,0 g/l para todo conductor.'
  },
  {
    question: 'Cuando un peatón cruza por la senda peatonal sin semáforo, ¿cómo debés proceder?',
    options: [
      'Tocar bocina y pasar rápido',
      'Detener la marcha y cederle el paso siempre',
      'Avanzar si hay lugar detrás'
    ],
    correctIndex: 1,
    explanation: 'El peatón tiene prioridad absoluta en la senda peatonal y en esquinas sin semáforo.'
  },
  {
    question: 'En camiones o colectivos (gran porte), ¿por qué se abre el ángulo antes de girar a la derecha?',
    options: [
      'Para girar a mayor velocidad',
      'Por el radio de giro y para evitar que el eje trasero invada la vereda',
      'No hace falta abrir el giro'
    ],
    correctIndex: 1,
    explanation: 'El eje trasero describe un radio más cerrado, por lo que requiere apertura controlada y chequeo de espejos.'
  }
];
