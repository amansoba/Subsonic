// Datos MOCK para Práctica 02 (sin backend)
window.DB = {
  events: [
    {
      id: 1,
      name: "Subsonic Festival 2026 - Opening Night",
      date: "2026-07-25",
      venue: "Main Stage",
      city: "Barcelona",
      desc: "Noche inaugural con una escaleta orientada a electrónica y visuales. Prototipo de detalle de evento.",
      image: "assets/img/event1.jpg",
      artists: [1,2,3],
      passes: [
        { id: 101, name: "General", price: 50, includes: "Acceso general a escenario principal" },
        { id: 102, name: "VIP", price: 120, includes: "Acceso VIP + zona descanso" },
        { id: 103, name: "Full Experience", price: 200, includes: "VIP + backstage + merchandising pack" },
      ]
    },
    {
      id: 2,
      name: "Electro Night",
      date: "2026-07-26",
      venue: "Sunset Stage",
      city: "Barcelona",
      desc: "Sesión nocturna con artistas invitados. Prototipo de búsqueda y navegación.",
      image: "assets/img/event1.jpg",
      artists: [2,4],
      passes: [
        { id: 201, name: "General", price: 45, includes: "Acceso general" },
        { id: 202, name: "VIP", price: 110, includes: "Acceso VIP" },
      ]
    },
    {
      id: 3,
      name: "Rock Arena",
      date: "2026-07-27",
      venue: "Rock Arena",
      city: "Barcelona",
      desc: "Conciertos de rock y pop-rock. Vista pensada para mostrar artistas y pases.",
      image: "assets/img/event1.jpg",
      artists: [3,5],
      passes: [
        { id: 301, name: "General", price: 40, includes: "Acceso general" },
        { id: 302, name: "Full Experience", price: 170, includes: "Acceso + pack" },
      ]
    }
  ],

  artists: [
    { id: 1, name: "DJ Nova", genre: "Techno / House", bio: "Artista electrónico con sets energéticos.", topTracks: ["Electric Dreams", "Night Power", "Wake Up", "Bassline"], image: "assets/img/artist1.jpg" },
    { id: 2, name: "Synth Wave", genre: "EDM", bio: "Sonido synth y festivalero.", topTracks: ["Neon Run", "Pulse", "Afterglow"], image: "assets/img/artist1.jpg" },
    { id: 3, name: "Beat Killer", genre: "Rock / Fusion", bio: "Banda con directos potentes y mezcla de estilos.", topTracks: ["Rift", "Thunder", "Crowd"], image: "assets/img/artist1.jpg" },
    { id: 4, name: "Charlotte de Witte (demo)", genre: "Techno", bio: "Referencia del techno moderno (placeholder).", topTracks: ["Track A", "Track B"], image: "assets/img/artist1.jpg" },
    { id: 5, name: "Martin Garrix (demo)", genre: "EDM", bio: "Artista popular (placeholder).", topTracks: ["Track X", "Track Y"], image: "assets/img/artist1.jpg" },
  ],

  spaces: [
    { id: 1, eventId: 1, type: "Food Truck", size: "10x10m", location: "Zona Comida", pricePerDay: 100, status: "Disponible", services: "Electricidad, agua", notes: "Acceso cercano a público" },
    { id: 2, eventId: 1, type: "Merch Stand", size: "5x3m", location: "Zona Merch", pricePerDay: 80, status: "Reservado", services: "Electricidad", notes: "Espacio interior" },
    { id: 3, eventId: 2, type: "Bebidas", size: "6x4m", location: "Zona Chill", pricePerDay: 70, status: "Disponible", services: "Electricidad", notes: "Cerca de baños" },
    { id: 4, eventId: 3, type: "Food Truck", size: "12x8m", location: "Entrada Norte", pricePerDay: 120, status: "Disponible", services: "Electricidad, agua", notes: "Zona tránsito" },
  ],

  // Entradas simuladas por usuario (se generan al “comprar”)
  tickets: [
    // { id, userEmail, eventId, passName, purchaseDate, status, code }
  ],
};