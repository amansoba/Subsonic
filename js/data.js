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
      artists: [1,2,3],
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
      artists: [2,4],
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
      artists: [3,5],
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
      artists: [1,2,4],
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
      artists: [2,3,5],
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
      artists: [1,4,5],
      passes: [
        { id: 601, name: "General", price: 55, includes: "Acceso general + abrigo térmico" },
        { id: 602, name: "Full Experience", price: 180, includes: "VIP + suite alpina" },
      ]
    }
  ],

  artists: [
    { id: 1, name: "DJ Nova", genre: "Techno / House", bio: "Sets rápidos, pegada fuerte y subidas de energía pensadas para mainstage.", topTracks: ["Electric Dreams", "Night Power", "Wake Up", "Bassline"], image: "assets/img/artist1.jpg" },
    { id: 2, name: "Synth Wave", genre: "EDM", bio: "Hook melódico, drops limpios y estética synth. Perfecto para atardecer.", topTracks: ["Neon Run", "Pulse", "Afterglow"], image: "assets/img/artist2.jpg" },
    { id: 3, name: "Beat Killer", genre: "Rock / Fusion", bio: "Banda potente, mezcla de estilos y directo de festival.", topTracks: ["Rift", "Thunder", "Crowd"], image: "assets/img/artist1.jpg" },
    { id: 4, name: "Charlotte de Witte (demo)", genre: "Techno", bio: "Referencia del techno moderno (placeholder).", topTracks: ["Track A", "Track B"], image: "assets/img/artist2.jpg" },
    { id: 5, name: "Martin Garrix (demo)", genre: "EDM", bio: "Artista popular (placeholder).", topTracks: ["Track X", "Track Y"], image: "assets/img/artist1.jpg" },
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
      name: "Subsonic Hoodie — Black Gold",
      price: 69,
      category: "Nuevo",
      gender: "Unisex",
      sizes: ["XS","S","M","L","XL"],
      desc: "Sudadera premium con bordado dorado y acabado festival edition (mock).",
      images: ["assets/img/event1.jpg","assets/img/event2.jpg","assets/img/event3.jpg"]
    },
    {
      id: 2,
      name: "Subsonic T-Shirt — White Glow",
      price: 29,
      category: "Nuevo",
      gender: "Hombre",
      sizes: ["S","M","L","XL"],
      desc: "Camiseta blanca con impresión glow (mock).",
      images: ["assets/img/event2.jpg","assets/img/event3.jpg","assets/img/event1.jpg"]
    },
    {
      id: 3,
      name: "Subsonic Top — Neon Rose",
      price: 25,
      category: "Nuevo",
      gender: "Mujer",
      sizes: ["XS","S","M","L"],
      desc: "Top con estética neon y tejido ligero (mock).",
      images: ["assets/img/event3.jpg","assets/img/event1.jpg","assets/img/event2.jpg"]
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
// Load persisted DB first (if any), then tickets
loadDB();
loadTickets();

// --- Auto-generate demo products from fotos_store if not already generated ---
;(function generateDemoProducts(){
  try{
    const already = (DB.products||[]).some(p=>p.meta && p.meta.generatedFromFotos);
    if(already) return; // avoid duplicating on subsequent loads

    // List of demo images inside the workspace folder 'fotos_store'
    const fotos = [
      "fotos_store/s1.jpg",
      "fotos_store/s2.jpg",
      "fotos_store/s3.jpg",
      "fotos_store/s4.jpg",
      "fotos_store/s5.jpg",
      "fotos_store/s6.jpg",
    ];

    const nextId = (() => {
      const all = (DB.products||[]).map(p=>p.id||0).concat((DB.events||[]).map(e=>e.id||0));
      return all.length ? Math.max(...all)+1 : 1;
    })();

    const genders = ["Unisex","Hombre","Mujer"];
    const sizes = ["XS","S","M","L","XL"];

    fotos.forEach((img, idx)=>{
      const id = nextId + idx;
      DB.products.push({
        id,
        name: `Demo Tee ${idx+1}`,
        price: 19 + (idx*5),
        category: "Ropa",
        gender: genders[idx % genders.length],
        sizes,
        desc: "Prenda demo generada automáticamente para la tienda. Ajusta título, descripción y precio desde el administrador.",
        images: [img],
        meta: { generatedFromFotos: true }
      });
    });

    // persist the new products so they survive reloads
    saveDB();
  }catch(e){
    // ignore generation errors in constrained environments
    console.warn('Demo product generation failed', e);
  }
})();