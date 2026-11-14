export const FLEET_CATEGORIES = [
  {
    id: 'manual',
    tabLabel: 'Auto Manual · Gol Rojo',
    license: 'Categoría B1 · Caja Manual',
    title: 'Auto Caja Manual en nuestro VW Gol Rojo',
    image: '/images/gol-rojo-jv.jpg',
    imageAlt: 'Volkswagen Gol rojo ploteado JV Autoescuela Hurlingham',
    summary:
      'Nuestro clásico VW Gol rojo ploteado con doble comando certificado. Aprendés embrague, cambios, arranque en pendiente y estacionamiento real por las calles y avenidas de Hurlingham.',
    bullets: [
      'Doble comando, VTV y seguro de enseñanza al día',
      'Práctica real en Av. Vergara, Villa Tesei, Morris y Hurlingham Centro',
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
      'Enseñanza en vehículo moderno automático con doble comando. Ideal si tu auto es automático o querés concentrarte 100% en el tránsito, espejos y estacionamiento sin estrés.',
    bullets: [
      'Unidad automática habilitada con mantenimiento riguroso',
      'Ideal para superar miedos al tránsito y ganar confianza rápida',
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
      'Preparación exacta para la pista práctica oficial'
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
      'Preparación enfocada en examen profesional y salida laboral'
    ]
  }
];

export const FALLBACK_COURSES = [
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
