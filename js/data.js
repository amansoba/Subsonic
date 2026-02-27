/* =========================================================
   SUBSONIC — Mock DB + Persistence
   - events / artists / spaces are static mocks
   - tickets are persisted in localStorage so they don't vanish
   - store/cart/orders persisted in localStorage (Practice 02)
   ========================================================= */

window.DB = {
  events: [
    {
      id: 1,
      name: "Subsonic Barcelona",
      date: "2026-07-25",
      venue: "PARC DEL FÒRUM",
      city: "Barcelona",
      region: "España",
      desc: "Noche inaugural con electrónica, visuales y una puesta en escena inspirada en fantasía y luz. Prototipo de detalle de evento.",
      image: "fotos_lugares/Barcelona.jpg",
      artists: [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
      passes: [
        { id: 101, name: "General", price: 50, includes: "Acceso general a escenario principal" },
        { id: 102, name: "VIP", price: 120, includes: "Acceso VIP + zona descanso" },
        { id: 103, name: "Full Experience", price: 200, includes: "VIP + backstage + merchandising pack" },
      ]
    },
    {
      id: 2,
      name: "Subsonic Valencia",
      date: "2026-08-15",
      venue: "CIUTAT DE LES ARTS",
      city: "Valencia",
      region: "España",
      desc: "Sesión nocturna con artistas invitados y estética de ritual lumínico. Prototipo de búsqueda y navegación.",
      image: "fotos_lugares/Valencia.jpg",
      artists: [61,62,63,64,65,66,67,68,69,70,71,72,3,73,74],
      passes: [
        { id: 201, name: "General", price: 45, includes: "Acceso general" },
        { id: 202, name: "VIP", price: 110, includes: "Acceso VIP" },
      ]
    },
    {
      id: 3,
      name: "Subsonic Madrid",
      date: "2026-09-20",
      venue: "IFEMA MADRID",
      city: "Madrid",
      region: "España",
      desc: "Conciertos de rock y pop-rock con show de fuego (simulado). Vista para mostrar artistas y pases.",
      image: "fotos_lugares/Madrid.jpg",
      artists: [46,47,48,49,50,51,52,53,54,55,56,57,58,59,60],
      passes: [
        { id: 301, name: "General", price: 40, includes: "Acceso general" },
        { id: 302, name: "Full Experience", price: 170, includes: "Acceso + pack" },
      ]
    },
    {
      id: 4,
      name: "Subsonic Festival Asia",
      date: "2026-10-10",
      venue: "BANYUWANGI ARENA",
      city: "Banyuwangi",
      region: "Indonesia",
      desc: "La experiencia asiática de Subsonic con artistas de todo el continente. Paisajes exóticos y misticismo antiguo.",
      image: "fotos_lugares/Asia.jpg",
      artists: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
      passes: [
        { id: 401, name: "General", price: 35, includes: "Acceso general" },
        { id: 402, name: "VIP", price: 100, includes: "Acceso VIP" },
      ]
    },
    {
      id: 5,
      name: "Subsonic Festival Brasil",
      date: "2026-11-01",
      venue: "ALLIANZ PARQUE",
      city: "São Paulo",
      region: "Brasil",
      desc: "Celebración sudamericana con ritmo, energía y la pasión que caracteriza a Brasil. Escenarios al aire libre.",
      image: "fotos_lugares/Brasil.jpg",
      artists: [31,32,33,34,35,36,37,38,39,40,41,42,43,44,45],
      passes: [
        { id: 501, name: "General", price: 40, includes: "Acceso general" },
        { id: 502, name: "VIP", price: 115, includes: "Acceso VIP" },
      ]
    },
    {
      id: 6,
      name: "Subsonic Winter Festival",
      date: "2026-12-20",
      venue: "ICE PALACE",
      city: "Innsbruck",
      region: "Austria",
      desc: "Festival invernal bajo las auroras boreales. Arquitectura de hielo, fuego en la nieve y electrónica en la montaña.",
      image: "fotos_lugares/Invierno.jpg",
      artists: [75,76,77,78,79,80,81,82,83,84,85,86,87,88,89],
      passes: [
        { id: 601, name: "General", price: 55, includes: "Acceso general + abrigo térmico" },
        { id: 602, name: "Full Experience", price: 180, includes: "VIP + suite alpina" },
      ]
    }
  ],

  artists: [
    { id: 1, name: "BTS", genre: "K-Pop", bio: "Supergrupo surcoreano multi-platino.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 2, name: "BLACKPINK", genre: "K-Pop", bio: "Cuarteto femenino globalmente reconocido.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 3, name: "Peggy Gou", genre: "Deep House", bio: "DJ y productora surcoreana con influencia house y techno.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 4, name: "Joji", genre: "Alternative R&B", bio: "Cantautor y productor con sonido íntimo y melódico.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 5, name: "Rina Sawayama", genre: "Art Pop", bio: "Artista japonesa-británica que mezcla pop y vanguardia.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 6, name: "NewJeans", genre: "K-Pop", bio: "Grupo juvenil surcoreano de fuerte impacto en streaming.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 7, name: "Fujii Kaze", genre: "J-Pop", bio: "Cantautor japonés con sensibilidad pop y soul.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 8, name: "Higher Brothers", genre: "Hip-hop", bio: "Colectivo chino de hip-hop con alcance internacional.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 9, name: "Yoasobi", genre: "J-Pop", bio: "Dúo japonés conocido por sus canciones basadas en historias.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 10, name: "Stray Kids", genre: "K-Pop", bio: "Grupo surcoreano de fuerte presencia en escena urbana pop.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 11, name: "Atarashii Gakko!", genre: "Dance-Pop", bio: "Banda japonesa enérgica que mezcla pop y performance.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 12, name: "Beabadoobee", genre: "Indie Rock", bio: "Cantautora indie rock con sensibilidad lo-fi.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 13, name: "ZHU", genre: "Electrónica", bio: "Productor y músico electrónico con sonido oscuro y seductor.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 14, name: "Yaeji", genre: "House", bio: "Productora y DJ coreano-estadounidense con mezcla house y rap.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 15, name: "The Rose", genre: "Indie Rock", bio: "Banda surcoreana con sensibilidad rock y melódica.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 16, name: "Rosalía", genre: "Flamenco Urbano", bio: "Artista española fusionando flamenco y sonidos urbanos.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 17, name: "The Strokes", genre: "Indie Rock", bio: "Banda neoyorquina seminal del rock alternativo.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 18, name: "Bad Gyal", genre: "Dancehall", bio: "Artista española con influencias dancehall y dembow.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 19, name: "Tame Impala", genre: "Psicodelia", bio: "Proyecto de Kevin Parker, referente de la psicodelia moderna.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 20, name: "Fred again..", genre: "Electrónica", bio: "Productor británico conocido por su trabajo emotivo y moderno.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 21, name: "Arctic Monkeys", genre: "Rock Alternativo", bio: "Banda británica con una carrera sólida en rock alternativo.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 22, name: "Amaia", genre: "Pop Alternativo", bio: "Cantautora española con estilo íntimo y contemporáneo.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 23, name: "C. Tangana", genre: "Pop Madrileño", bio: "Artista español que mezcla pop, flamenco y urbano.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 24, name: "Dua Lipa", genre: "Pop", bio: "Superestrella pop británica con hits globales.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 25, name: "Justice", genre: "Electro-Rock", bio: "Dúo francés pionero en la electro-dance con estética rock.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 26, name: "Caroline Polachek", genre: "Art Pop", bio: "Compositora y vocalista con enfoque experimental en el pop.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 27, name: "Rigoberta Bandini", genre: "Electropop", bio: "Proyecto pop-electrónico español con letras contemporáneas.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 28, name: "The Blaze", genre: "Ambient House", bio: "Dúo francés conocido por su emotiva electrónica y visuales.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 29, name: "Alizzz", genre: "Indie Pop", bio: "Productor y artista español con sensibilidad pop moderna.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 30, name: "Julieta", genre: "Pop Catalán", bio: "Artista emergente de la escena catalana.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 31, name: "Anitta", genre: "Funk Carioca", bio: "Superestrella brasileña y referente del funk carioca.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 32, name: "Gilberto Gil", genre: "MPB (Música Popular Brasileña)", bio: "Icono de la música brasileña y exministro de cultura.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 33, name: "Ludmilla", genre: "Funk/Pagode", bio: "Artista brasileña con fuerte presencia en funk y pagode.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 34, name: "Pabllo Vittar", genre: "Pop", bio: "Artista drag brasileña con impacto pop y mainstream.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 35, name: "Caetano Veloso", genre: "MPB", bio: "Leyenda de la música popular brasileña.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 36, name: "Ivete Sangalo", genre: "Axé", bio: "Una de las voces más populares del Brasil contemporáneo.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 37, name: "Sepultura", genre: "Groove Metal", bio: "Banda brasileña influyente en metal y fusiones brasileñas.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 38, name: "Jorge Ben Jor", genre: "Samba-Rock", bio: "Compositor y figura central del samba-rock brasileño.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 39, name: "Luedji Luna", genre: "Jazz/Afrobeats", bio: "Cantautora brasileña que mezcla jazz y ritmos africanos.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 40, name: "Baco Exu do Blues", genre: "Hip-hop", bio: "Figura potente del hip-hop brasileño contemporáneo.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 41, name: "Liniker", genre: "Soul/MPB", bio: "Voz soul con raíces en la música popular brasileña.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 42, name: "Vintage Culture", genre: "Tech House", bio: "DJ y productor brasileño reconocido en la escena electrónica.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 43, name: "Gloria Groove", genre: "Rap/Pop", bio: "Artista brasileña versátil entre rap y pop.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 44, name: "Seu Jorge", genre: "Samba", bio: "Cantautor y actor brasileño, referente del samba moderno.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 45, name: "BaianaSystem", genre: "Rock Fusion", bio: "Proyecto brasileño que fusiona electrónica, rock y ritmos locales.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 46, name: "Coldplay", genre: "Pop Rock", bio: "Banda británica de gran éxito global.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 47, name: "Quevedo", genre: "Urbano", bio: "Artista español emergente del urbano.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 48, name: "Harry Styles", genre: "Pop", bio: "Ex-One Direction y estrella pop en solitario.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 49, name: "Vetusta Morla", genre: "Indie Rock", bio: "Banda española reconocida en la escena indie.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 50, name: "Leiva", genre: "Rock", bio: "Cantautor y referente del rock español contemporáneo.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 51, name: "Aitana", genre: "Pop", bio: "Cantante pop española con gran seguimiento.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 52, name: "Imagine Dragons", genre: "Pop Rock", bio: "Banda estadounidense con hits globales de rock-pop.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 53, name: "Karol G", genre: "Reggaeton", bio: "Artista colombiana de reggaeton y pop urbano.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 54, name: "Arde Bogotá", genre: "Rock", bio: "Banda española de rock alternativo emergente.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 55, name: "Lola Índigo", genre: "Pop/Dance", bio: "Artista española con fuertes raíces en el pop-dance.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 56, name: "The Killers", genre: "Indie Rock", bio: "Banda estadounidense icónica del indie rock.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 57, name: "Sen Senra", genre: "Bedroom Pop", bio: "Cantautor gallego con sonido íntimo y contemporáneo.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 58, name: "Natanael Cano", genre: "Corridos Tumbados", bio: "Artista mexicano pionero en corridos tumbados.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 59, name: "Hinds", genre: "Garage Rock", bio: "Banda madrileña con estética garage rock.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 60, name: "Rels B", genre: "Urbano", bio: "Productor y artista urbano español con gran base.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 61, name: "David Guetta", genre: "EDM", bio: "DJ y productor francés de alcance global.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 62, name: "Zoo", genre: "Rap/Ska", bio: "Grupo con mezcla de rap y ska en escena española.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 63, name: "Love of Lesbian", genre: "Indie Pop", bio: "Banda española con larga trayectoria indie-pop.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 64, name: "Calvin Harris", genre: "Dance", bio: "Productor escocés y figura clave del dance comercial.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 65, name: "La Fúmiga", genre: "Pop/Viento", bio: "Banda valenciana con instrumentos de viento y pop festivo.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 66, name: "Dorian", genre: "Indie Electrónico", bio: "Proyecto indie con elementos electrónicos y eclécticos.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 67, name: "Izal", genre: "Indie Pop", bio: "Banda española con presencia masiva en festivales.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 68, name: "Charlotte de Witte", genre: "Techno", bio: "DJ y productora belga referente del techno moderno.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 69, name: "Ginebras", genre: "Indie Pop", bio: "Banda pop emergente de España con sonido fresco.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 70, name: "Maza", genre: "Urbano", bio: "Artista urbano con estilo contemporáneo.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 71, name: "La Casa Azul", genre: "Electropop", bio: "Proyecto pop-electrónico español liderado por Guille Milkyway.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 72, name: "Bizarrap", genre: "Urbano/Producer", bio: "Productor argentino conocido por sus sessions virales.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 73, name: "Los Planetas", genre: "Indie", bio: "Banda española seminal del indie en español.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 74, name: "Sandra Monfort", genre: "Folclore Moderno", bio: "Artista que fusiona folclore con sonidos contemporáneos.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 75, name: "Kygo", genre: "Tropical House", bio: "DJ y productor noruego asociado al tropical house.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 76, name: "Sigur Rós", genre: "Post-rock", bio: "Banda islandesa conocida por paisajes sonoros épicos.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 77, name: "Tiësto", genre: "EDM", bio: "DJ y productor neerlandés leyenda de la música electrónica.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 78, name: "Bon Iver", genre: "Indie Folk", bio: "Proyecto de Justin Vernon, con sensibilidad folk y experimental.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 79, name: "Aurora", genre: "Art Pop", bio: "Cantautora noruega con enfoque onírico y vocal distintiva.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 80, name: "Disclosure", genre: "House", bio: "Dúo británico de house con gran trayectoria en electrónica.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 81, name: "Mumford & Sons", genre: "Folk Rock", bio: "Banda británica de folk rock con himnos acústicos.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 82, name: "Fisher", genre: "Tech House", bio: "DJ australiano conocido por su energía en pista.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 83, name: "James Blake", genre: "Soul Electrónico", bio: "Productor y músico británico con mezcla de soul y electrónica.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 84, name: "Of Monsters and Men", genre: "Indie Folk", bio: "Banda islandesa de folk-pop con coros épicos.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 85, name: "Boris Brejcha", genre: "Minimal Techno", bio: "DJ y productor alemán conocido por su 'high-tech minimal'.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 86, name: "Polo & Pan", genre: "Electropop", bio: "Dúo francés con electrónica melódica y tropical.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 87, name: "Alt-J", genre: "Indie Rock", bio: "Banda británica con sonido experimental en indie rock.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 88, name: "Zedd", genre: "Electropop", bio: "Productor germano-ruso con multitud de hits electropop.", topTracks: [], image: "assets/img/artist_placeholder.jpg" },
    { id: 89, name: "Ben Böhmer", genre: "Melodic House", bio: "Productor alemán destacado en melodic house y progressive.", topTracks: [], image: "assets/img/artist_placeholder.jpg" }
  ],

  spaces: [
    { id: 1, eventId: 1, type: "Food Truck", size: "10x10m", location: "Zona Comida", pricePerDay: 100, status: "Disponible", services: "Electricidad, agua", notes: "Acceso cercano a público" },
    { id: 2, eventId: 1, type: "Merch Stand", size: "5x3m", location: "Zona Merch", pricePerDay: 80, status: "Reservado", services: "Electricidad", notes: "Espacio interior" },
    { id: 3, eventId: 2, type: "Bebidas", size: "6x4m", location: "Zona Chill", pricePerDay: 70, status: "Disponible", services: "Electricidad", notes: "Cerca de baños" },
    { id: 4, eventId: 3, type: "Food Truck", size: "12x8m", location: "Entrada Norte", pricePerDay: 120, status: "Disponible", services: "Electricidad, agua", notes: "Zona tránsito" },
  ],

  tickets: [],

  // Store products (mock)
  products: [
    {
      id: 1,
      name: "Subsonic Cap — Black Classic",
      price: 34,
      category: "Nuevo",
      gender: "Hombre",
      sizes: ["One Size"],
      desc: "Gorra ajustable con bordado Subsonic en negro clásico. Algodón premium con cierre de velcro. Festival essential.",
      images: ["fotos_store/g1.jpg"]
    },
    {
      id: 2,
      name: "Subsonic Cap — Gold Edition",
      price: 39,
      category: "Nuevo",
      gender: "Mujer",
      sizes: ["One Size"],
      desc: "Gorra premium con logo dorado bordado. Colores vibrantes festival edition. Visera estructura reforzada.",
      images: ["fotos_store/g2.jpg"]
    },
    {
      id: 3,
      name: "Subsonic Cap — Neon Pulse",
      price: 39,
      category: "Nuevo",
      gender: "Unisex",
      sizes: ["One Size"],
      desc: "Gorra con detalles neón fluorescentes. Diseño statement para festivales nocturnos. Reflective technology.",
      images: ["fotos_store/g3.jpg"]
    },
    {
      id: 4,
      name: "Subsonic Cap — White Signature",
      price: 34,
      category: "Nuevo",
      gender: "Unisex",
      sizes: ["One Size"],
      desc: "Gorra blanca clean con logo bordado sutil. Versatile para cualquier estación. Ajuste flexible.",
      images: ["fotos_store/g4.jpg"]
    },
    {
      id: 5,
      name: "Subsonic Hoodie — Neon Nights",
      price: 69,
      category: "Nuevo",
      gender: "Unisex",
      sizes: ["XS","S","M","L","XL"],
      desc: "Sudadera premium con detalles neón bordados. Tejido suave con capucha cómoda y bolsillos laterales. Festival edition.",
      images: ["fotos_store/s1.jpg"]
    },
    {
      id: 6,
      name: "Subsonic Tee — Electric Dawn",
      price: 29,
      category: "Nuevo",
      gender: "Hombre",
      sizes: ["S","M","L","XL"],
      desc: "Camiseta de algodón 100% con impresión frontal degradada. Corte clásico con acabado sostenible.",
      images: ["fotos_store/s2.jpg"]
    },
    {
      id: 7,
      name: "Subsonic Hoodie — Mystic Vibes",
      price: 65,
      category: "Nuevo",
      gender: "Mujer",
      sizes: ["XS","S","M","L"],
      desc: "Sudadera ajustada con estampado místico full print. Capucha con cordones pulsera. Material premium stretchy.",
      images: ["fotos_store/s3.jpg"]
    },
    {
      id: 8,
      name: "Subsonic Tee — Sonic Waves",
      price: 25,
      category: "Nuevo",
      gender: "Unisex",
      sizes: ["S","M","L","XL"],
      desc: "Camiseta oversize con patrón técnico wavefront. Tejido orgánico transpirable para clima cálido.",
      images: ["fotos_store/s4.jpg"]
    },
    {
      id: 9,
      name: "Subsonic Hoodie — Purple Daze",
      price: 69,
      category: "Nuevo",
      gender: "Unisex",
      sizes: ["XS","S","M","L","XL"],
      desc: "Sudadera con capucha y estampado degradado púrpura. Bolsillos kangaroo amplios. Cordones reflectantes.",
      images: ["fotos_store/s5.jpg"]
    },
    {
      id: 10,
      name: "Subsonic Tee — Neon Dreams",
      price: 29,
      category: "Nuevo",
      gender: "Mujer",
      sizes: ["XS","S","M","L"],
      desc: "Camiseta ajustada mujer con diseño neon exclusivo. Corte femenino con ribete de contraste.",
      images: ["fotos_store/s6.jpg"]
    }
  ]
};

/* -------------------- Tickets persistence -------------------- */
const TICKETS_KEY = "subsonic_tickets";

function loadTickets(){
  try{
    const raw = localStorage.getItem(TICKETS_KEY);
    DB.tickets = raw ? JSON.parse(raw) : [];
  }catch(e){
    DB.tickets = [];
  }
}

function saveTickets(){
  try{
    localStorage.setItem(TICKETS_KEY, JSON.stringify(DB.tickets || []));
  }catch(e){
    // ignore
  }
}

function resetTickets(){
  DB.tickets = [];
  saveTickets();
}

window.loadTickets = loadTickets;
window.saveTickets = saveTickets;
window.resetTickets = resetTickets;

/* -------------------- Store persistence -------------------- */
const CART_KEY = "subsonic_cart";
const ORDERS_KEY = "subsonic_orders";

function loadCart(){
  try{
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  }catch{
    return [];
  }
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart || []));
}
function loadOrders(){
  try{
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  }catch{
    return [];
  }
}
function saveOrders(orders){
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders || []));
}

// API global
window.store = {
  loadCart, saveCart,
  loadOrders, saveOrders
};

/* -------------------- DB persistence -------------------- */
const DB_KEY = 'subsonic_db';

function saveDB(){
  try{
    const payload = {
      events: DB.events || [],
      artists: DB.artists || [],
      spaces: DB.spaces || [],
      products: DB.products || []
    };
    localStorage.setItem(DB_KEY, JSON.stringify(payload));
  }catch(e){
    // ignore
  }
}

function loadDB(){
  try{
    const raw = localStorage.getItem(DB_KEY);
    if(!raw) return;
    const saved = JSON.parse(raw);
    if(saved.events) DB.events = saved.events;
    if(saved.artists) DB.artists = saved.artists;
    if(saved.spaces) DB.spaces = saved.spaces;
    if(saved.products) DB.products = saved.products;
  }catch(e){
    // ignore and keep defaults
  }
}

window.saveDB = saveDB;
window.loadDB = loadDB;

/* -------------------- Initialize -------------------- */
// ⚠️ RESET PRODUCTS IN STORAGE (clean slate for new gorras)
try {
  const stored = localStorage.getItem(DB_KEY);
  if(stored) {
    const data = JSON.parse(stored);
    // Replace products with current DB.products (gorras only)
    data.products = DB.products;
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  }
} catch(e) {
  // ignore
}

// Load persisted DB first (if any), then tickets
loadDB();
loadTickets();