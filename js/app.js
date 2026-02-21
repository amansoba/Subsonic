/* =========================================================
   SUBSONIC — Frontend controller (Practice 02)
   - Multi-page navigation (HTML per view)
   - Role-based access: visitor / client / provider
   - Query params: ?id=..., ?eventId=...
   - Tickets persisted (localStorage) via data.js
   - Store + Cart + Orders persisted (localStorage) via data.js
   ========================================================= */

const $ = (sel) => document.querySelector(sel);

function getQueryParam(key){
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}

function formatDate(iso){
  if(!iso) return "";
  const [y,m,d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function money(n){
  return `€${Number(n || 0).toFixed(2)}`;
}

/* -------------------- Session -------------------- */
function getSession(){
  return JSON.parse(localStorage.getItem("subsonic_session") || "null");
}
function setSession(session){
  localStorage.setItem("subsonic_session", JSON.stringify(session));
}
function clearSession(){
  localStorage.removeItem("subsonic_session");
}
function requireRole(allowedRoles){
  const s = getSession();
  if(!s || !allowedRoles.includes(s.role)){
    window.location.href = "login.html";
  }
}

/* -------------------- UI: Navigation -------------------- */
function renderNav(){
  const nav = $("#navlinks");
  if(!nav) return;

  const s = getSession();
  const links = [
    { href: "events.html", label: "Eventos" },
    { href: "store.html", label: "Store" },
    { href: "help.html", label: "Help" },
  ];

  // Badge carrito (si existe localStorage store)
  const cartCount = (window.store?.loadCart?.() || []).reduce((a,i)=>a+(i.qty||0),0);
  links.push({ href: "cart.html", label: `Carrito (${cartCount})` });

  if(!s){
    links.push({ href:"login.html", label:"My Account" });
  } else if(s.role === "client"){
    // OJO: tu archivo real es client_dashboard.html (con guion bajo)
    links.push({ href:"client_dashboard.html", label:"Mi Cuenta" });
    links.push({ href:"tickets.html", label:"Mis Entradas" });
    links.push({ href:"orders.html", label:"Pedidos" });
    links.push({ href:"#", label:`👤 ${s.name || "Cliente"}`, action:"noop" });
    links.push({ href:"#", label:"Cerrar sesión", action:"logout" });
  } else if(s.role === "provider"){
    links.push({ href:"provider-spaces.html", label:"Espacios" });
    links.push({ href:"#", label:`🏷️ ${s.name || "Proveedor"}`, action:"noop" });
    links.push({ href:"#", label:"Cerrar sesión", action:"logout" });
  }

  nav.innerHTML = "";
  links.forEach(l=>{
    const a = document.createElement("a");
    a.href = l.href;
    a.textContent = l.label;

    if(l.action === "logout"){
      a.href = "#";
      a.addEventListener("click",(e)=>{
        e.preventDefault();
        clearSession();
        window.location.href = "index.html";
      });
    }

    nav.appendChild(a);
  });
}

/* =========================================================
Pages
   ========================================================= */

function pageHome(){
  renderNav();

  const featured = $("#featuredEvents");
  if(featured){
    featured.innerHTML = "";
    DB.events.slice(0,3).forEach(ev=>{
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="badge">📅 ${formatDate(ev.date)} • 📍 ${ev.city} • 🎤 ${ev.venue}</div>
        <h3 class="h-title" style="margin:10px 0 6px 0">${ev.name}</h3>
        <p class="small">${ev.desc}</p>
        <div class="right">
          <a class="btn secondary" href="event.html?id=${ev.id}">Ver detalle</a>
        </div>
      `;
      featured.appendChild(card);
    });
  }

  const form = $("#homeSearchForm");
  if(form && !form.dataset.bound){
    form.dataset.bound = "1";
    form.addEventListener("submit",(e)=>{
      e.preventDefault();
      const q = ($("#q")?.value || "").trim();
      const date = $("#date")?.value || "";
      const url = new URL(window.location.origin + "/events.html");
      if(q) url.searchParams.set("q", q);
      if(date) url.searchParams.set("date", date);
      window.location.href = url.pathname + url.search;
    });
  }
}

function pageEvents(){
  renderNav();

  const list = $("#eventList");
  if(!list) return;

  const q = (getQueryParam("q") || "").toLowerCase();
  const date = getQueryParam("date") || "";

  const filtered = DB.events.filter(ev=>{
    const okQ = !q || ev.name.toLowerCase().includes(q);
    const okDate = !date || ev.date === date;
    return okQ && okDate;
  });

  const filterQ = $("#filterQ");
  const filterDate = $("#filterDate");

  if(filterQ) filterQ.value = getQueryParam("q") || "";
  if(filterDate) filterDate.value = date;

  list.innerHTML = "";
  filtered.forEach(ev=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="badge">📅 ${formatDate(ev.date)} • 📍 ${ev.city}</div>
      <h3 class="h-title" style="margin:10px 0 6px 0">${ev.name}</h3>
      <p class="small">${ev.desc}</p>
      <div class="right">
        <a class="btn secondary" href="event.html?id=${ev.id}">Ver detalle</a>
      </div>
    `;
    list.appendChild(card);
  });

  const filtersForm = $("#filtersForm");
  if(filtersForm && !filtersForm.dataset.bound){
    filtersForm.dataset.bound = "1";
    filtersForm.addEventListener("submit",(e)=>{
      e.preventDefault();
      const nq = (filterQ?.value || "").trim();
      const nd = filterDate?.value || "";
      const url = new URL(window.location.href);
      url.searchParams.delete("q");
      url.searchParams.delete("date");
      if(nq) url.searchParams.set("q", nq);
      if(nd) url.searchParams.set("date", nd);
      window.location.href = url.pathname + url.search;
    });
  }
}

function pageEventDetail(){
  renderNav();

  const id = Number(getQueryParam("id"));
  const ev = DB.events.find(e=>e.id === id);
  if(!ev){
    $("#eventDetail").innerHTML = `<div class="card">Evento no encontrado.</div>`;
    return;
  }

  $("#evName").textContent = ev.name;
  $("#evMeta").textContent = `${formatDate(ev.date)} • ${ev.venue} • ${ev.city}`;
  $("#evDesc").textContent = ev.desc;

  const artistWrap = $("#artistList");
  artistWrap.innerHTML = "";
  ev.artists.forEach(aid=>{
    const a = DB.artists.find(x=>x.id === aid);
    if(!a) return;

    const item = document.createElement("div");
    item.className = "card";
    item.innerHTML = `
      <div class="badge">🎧 ${a.genre}</div>
      <h4 class="h-title" style="margin:10px 0 6px 0">${a.name}</h4>
      <p class="small">${a.bio}</p>
      <div class="right">
        <a class="btn secondary" href="artist.html?id=${a.id}&eventId=${ev.id}">Ver artista</a>
      </div>
    `;
    artistWrap.appendChild(item);
  });

  const passWrap = $("#passList");
  passWrap.innerHTML = "";
  ev.passes.forEach(p=>{
    const item = document.createElement("div");
    item.className = "card";
    item.innerHTML = `
      <div class="badge">🎟️ ${p.name} • €${p.price}</div>
      <p class="small" style="margin:10px 0">${p.includes}</p>
      <div class="row" style="justify-content:flex-end; gap:8px">
        <a class="btn" href="pass.html?eventId=${ev.id}&passId=${p.id}">Comprar ahora</a>
        <button class="btn secondary add-to-cart" type="button">Añadir al carrito</button>
      </div>
    `;

    const btn = item.querySelector('.add-to-cart');
    btn.addEventListener('click', ()=>{
      // open modal to choose quantity for event pass
      showPassModal(ev.name, p.name, p.price, { eventId: ev.id, passId: p.id });
    });

    passWrap.appendChild(item);
  });

  $("#spotifyBox").innerHTML = `
    <div class="card">
      <div class="badge">Spotify Player (placeholder)</div>
      <p class="small">Integración API externa en prácticas futuras. En esta práctica es un bloque simulado.</p>
      <button class="btn secondary" type="button" onclick="alert('Preview simulado')">▶ Play</button>
    </div>
  `;
}

function pageArtistDetail(){
  renderNav();

  const id = Number(getQueryParam("id"));
  const eventId = getQueryParam("eventId");

  const a = DB.artists.find(x=>x.id === id);
  if(!a){
    $("#artistDetail").innerHTML = `<div class="card">Artista no encontrado.</div>`;
    return;
  }

  $("#arName").textContent = a.name;
  $("#arGenre").textContent = a.genre;
  $("#arBio").textContent = a.bio;

  const tracks = $("#trackList");
  tracks.innerHTML = "";
  a.topTracks.forEach(t=>{
    const row = document.createElement("div");
    row.className = "card";
    row.innerHTML = `
      <div class="row" style="justify-content:space-between">
        <div>🎵 ${t}</div>
        <button class="btn secondary" type="button">▶ Preview</button>
      </div>
    `;
    row.querySelector("button").addEventListener("click", ()=>alert("Preview simulado"));
    tracks.appendChild(row);
  });

  const back = $("#backToEvent");
  back.href = eventId ? `event.html?id=${eventId}` : "events.html";
}

function pageLogin(){
  renderNav();

  const form = $("#loginForm");
  const toast = $("#loginToast");
  if(!form || form.dataset.bound) return;

  form.dataset.bound = "1";
  form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const email = ($("#email")?.value || "").trim();
    const role = $("#role")?.value || "client";
    const name = email ? email.split("@")[0] : (role === "client" ? "Cliente" : "Proveedor");

    setSession({ email, role, name });

    if(toast){
      toast.style.display = "block";
      toast.textContent = "Sesión iniciada (simulada). Redirigiendo…";
    }

    setTimeout(()=>{
      // OJO: client_dashboard.html (guion bajo)
      window.location.href = (role === "client") ? "client_dashboard.html" : "provider-spaces.html";
    }, 450);
  });

  // Link opcional a recuperar contraseña si existe un anchor con id
  const fp = $("#forgotLink");
  if(fp && !fp.dataset.bound){
    fp.dataset.bound = "1";
    fp.addEventListener("click",(e)=>{
      // si tu login ya tiene href, no hace falta
    });
  }
}

function pageRegister(){
  renderNav();

  const form = $("#registerForm");
  if(!form || form.dataset.bound) return;

  const roleReg = $("#roleReg");
  const providerFields = $("#providerFields");

  if(roleReg && providerFields && !roleReg.dataset.bound){
    roleReg.dataset.bound = "1";
    roleReg.addEventListener("change",(e)=>{
      providerFields.style.display = (e.target.value === "provider") ? "block" : "none";
    });
  }

  form.dataset.bound = "1";
  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    alert("Registro simulado. Ahora inicia sesión.");
    window.location.href = "login.html";
  });
}

function pageClientDashboard(){
  renderNav();
  requireRole(["client"]);

  const s = getSession();
  $("#helloClient").textContent = `Bienvenido, ${s.name}`;

  const myTickets = DB.tickets.filter(t=>t.userEmail === s.email);
  $("#ticketsCount").textContent = String(myTickets.length);

  // pedidos (si existe panel)
  const myOrders = (window.store?.loadOrders?.() || []).filter(o=>o.userEmail===s.email);
  const ordersCount = $("#ordersCount");
  if(ordersCount) ordersCount.textContent = String(myOrders.length);
}

function pagePass(){
  renderNav();
  requireRole(["client"]);

  const eventId = Number(getQueryParam("eventId"));
  const passId = Number(getQueryParam("passId"));

  const ev = DB.events.find(e=>e.id === eventId);
  if(!ev){
    $("#passBox").innerHTML = `<div class="card">Evento no encontrado.</div>`;
    return;
  }

  const pass = ev.passes.find(p=>p.id === passId) || ev.passes[0];
  $("#pEvent").textContent = ev.name;
  $("#pPass").textContent = `${pass.name} (€${pass.price})`;
  $("#pIncludes").textContent = pass.includes;

  const btn = $("#confirmPurchase");
  if(btn && !btn.dataset.bound){
    btn.dataset.bound = "1";
    btn.addEventListener("click", ()=>{
      const s = getSession();
      const id = Date.now();
      const code = `SUB-${eventId}-${pass.id}-${String(id).slice(-4)}`;

      DB.tickets.push({
        id,
        userEmail: s.email,
        eventId,
        passName: pass.name,
        purchaseDate: new Date().toISOString().slice(0,10),
        status: "Activa",
        code
      });

      window.saveTickets?.();
      window.location.href = `purchase-success.html?id=${id}`;
    });
  }

  $("#backEvent").href = `event.html?id=${eventId}`;
}

function pagePurchaseSuccess(){
  renderNav();
  requireRole(["client"]);

  const id = Number(getQueryParam("id"));
  const s = getSession();
  const t = DB.tickets.find(x=>x.id === id && x.userEmail === s.email);

  if(!t){
    $("#successBox").innerHTML = `<div class="card">Compra no encontrada.</div>`;
    return;
  }

  const ev = DB.events.find(e=>e.id === t.eventId);
  $("#sEvent").textContent = ev ? ev.name : `Evento #${t.eventId}`;
  $("#sPass").textContent = t.passName;
  $("#sCode").textContent = t.code;

  $("#goTickets").href = "tickets.html";
  $("#goEvents").href = "events.html";
}

function pageTickets(){
  renderNav();
  requireRole(["client"]);

  const s = getSession();
  const tbody = $("#ticketsTableBody");
  if(!tbody) return;

  const mine = DB.tickets.filter(t=>t.userEmail === s.email);
  tbody.innerHTML = "";

  mine.forEach(t=>{
    const ev = DB.events.find(e=>e.id === t.eventId);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ev ? ev.name : t.eventId}</td>
      <td>${t.passName}</td>
      <td>${formatDate(t.purchaseDate)}</td>
      <td>${t.status}</td>
      <td><a class="btn secondary" href="ticket.html?id=${t.id}">Ver detalle</a></td>
    `;
    tbody.appendChild(tr);
  });
}

function pageTicketDetail(){
  renderNav();
  requireRole(["client"]);

  const s = getSession();
  const id = Number(getQueryParam("id"));
  const t = DB.tickets.find(x=>x.id === id && x.userEmail === s.email);

  if(!t){
    $("#ticketBox").innerHTML = `<div class="card">Entrada no encontrada.</div>`;
    return;
  }

  const ev = DB.events.find(e=>e.id === t.eventId);
  $("#tEvent").textContent = ev ? ev.name : `Evento #${t.eventId}`;
  $("#tPass").textContent = t.passName;
  $("#tDate").textContent = formatDate(t.purchaseDate);
  $("#tStatus").textContent = t.status;
  $("#tCode").textContent = t.code;

  const btn = $("#cancelTicket");
  const toast = $("#ticketToast");
  if(btn) btn.disabled = (t.status !== "Activa");

  if(btn && !btn.dataset.bound){
    btn.dataset.bound = "1";
    btn.addEventListener("click", ()=>{
      if(btn.disabled) return;
      if(confirm("¿Solicitar cancelación? (simulado)")){
        t.status = "Cancelada";
        $("#tStatus").textContent = t.status;
        btn.disabled = true;
        window.saveTickets?.();

        if(toast){
          toast.style.display = "block";
          toast.textContent = "Cancelación registrada (simulada).";
        }
      }
    });
  }

  // Add to cart from pass page
  const addToCartBtn = $("#addToCartBtn");
  if(addToCartBtn && !addToCartBtn.dataset.bound){
    addToCartBtn.dataset.bound = '1';
    addToCartBtn.addEventListener('click', ()=>{
      showPassModal(ev.name, pass.name, pass.price, { eventId: ev.id, passId: pass.id });
    });
  }

  $("#backTickets").href = "tickets.html";
}

function pageProfile(){
  renderNav();
  requireRole(["client"]);

  const s = getSession();
  $("#pName").value = s.name || "";
  $("#pEmail").value = s.email || "";

  const form = $("#profileForm");
  if(form && !form.dataset.bound){
    form.dataset.bound = "1";
    form.addEventListener("submit",(e)=>{
      e.preventDefault();
      s.name = ($("#pName").value || "").trim() || s.name;
      setSession(s);
      alert("Cambios guardados (simulado).");
      window.location.href = "client_dashboard.html";
    });
  }

  $("#backDash").href = "client_dashboard.html";
}

function pageProviderSpaces(){
  renderNav();
  requireRole(["provider"]);

  const s = getSession();
  $("#helloProvider").textContent = `Panel Proveedor: ${s.name}`;

  const form = $("#spaceFiltersForm");
  const list = $("#spacesList");
  const sel = $("#spEvent");

  if(sel && !sel.dataset.filled){
    sel.dataset.filled = "1";
    DB.events.forEach(ev=>{
      const opt = document.createElement("option");
      opt.value = ev.id;
      opt.textContent = ev.name;
      sel.appendChild(opt);
    });
  }

  function render(){
    const type = $("#spType").value;
    const status = $("#spStatus").value;
    const eventId = Number($("#spEvent").value) || 0;

    const filtered = DB.spaces.filter(sp=>{
      const okType = !type || sp.type === type;
      const okStatus = !status || sp.status === status;
      const okEvent = !eventId || sp.eventId === eventId;
      return okType && okStatus && okEvent;
    });

    list.innerHTML = "";
    filtered.forEach(sp=>{
      const ev = DB.events.find(e=>e.id === sp.eventId);
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="badge">🏷️ ${sp.type} • 📏 ${sp.size} • €${sp.pricePerDay}/día</div>
        <h3 class="h-title" style="margin:10px 0 6px 0">${sp.location}</h3>
        <p class="small">
          Evento: <strong>${ev ? ev.name : "—"}</strong><br/>
          Estado: <strong style="color:${sp.status==="Disponible" ? "var(--ok)" : "var(--warn)"}">${sp.status}</strong><br/>
          Servicios: ${sp.services}
        </p>
        <div class="right">
          <a class="btn secondary" href="space.html?id=${sp.id}">Ver ficha</a>
        </div>
      `;
      list.appendChild(card);
    });
  }

  if(form && !form.dataset.bound){
    form.dataset.bound = "1";
    form.addEventListener("submit",(e)=>{
      e.preventDefault();
      render();
    });
  }

  render();
}

function pageSpaceDetail(){
  renderNav();
  requireRole(["provider"]);

  const id = Number(getQueryParam("id"));
  const sp = DB.spaces.find(x=>x.id === id);

  if(!sp){
    $("#spaceBox").innerHTML = `<div class="card">Espacio no encontrado.</div>`;
    return;
  }

  const ev = DB.events.find(e=>e.id === sp.eventId);

  $("#spTitle").textContent = `${sp.type} — ${sp.location}`;
  $("#spMeta").textContent = `${ev ? ev.name : "Evento"} • ${sp.size} • €${sp.pricePerDay}/día`;
  $("#spServices").textContent = sp.services;
  $("#spNotes").textContent = sp.notes;
  $("#spStatus").textContent = sp.status;

  const btn = $("#goRequest");
  btn.href = `space-request.html?id=${sp.id}`;
  btn.textContent = sp.status === "Disponible" ? "Solicitar alquiler" : "No disponible";
  btn.style.pointerEvents = sp.status === "Disponible" ? "auto" : "none";
  btn.classList.toggle("secondary", sp.status !== "Disponible");

  $("#backSpaces").href = "provider-spaces.html";
}

function pageSpaceRequest(){
  renderNav();
  requireRole(["provider"]);

  const id = Number(getQueryParam("id"));
  const sp = DB.spaces.find(x=>x.id === id);

  if(!sp){
    $("#reqBox").innerHTML = `<div class="card">Espacio no encontrado.</div>`;
    return;
  }

  $("#reqSpace").textContent = `${sp.type} — ${sp.location} (${sp.size})`;
  $("#reqPrice").textContent = `€${sp.pricePerDay}/día`;

  const form = $("#requestForm");
  if(form && !form.dataset.bound){
    form.dataset.bound = "1";
    form.addEventListener("submit",(e)=>{
      e.preventDefault();
      alert("Solicitud enviada (simulada).");
      window.location.href = "provider-spaces.html";
    });
  }

  $("#backSpace").href = `space.html?id=${sp.id}`;
}

/* ============================
   STORE / CART / ORDERS / HELP
   ============================ */

function pageStore(){
  renderNav();

  const grid = $("#productGrid");
  if(!grid) return;

  const cat = getQueryParam("cat") || "";
  const filtered = DB.products.filter(p => !cat || p.category === cat || p.gender === cat);

  grid.innerHTML = "";
  filtered.forEach(p=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="badge">${p.category} • ${p.gender}</div>
      <h3 class="h-title" style="margin:10px 0 6px 0">${p.name}</h3>
      <p class="small">${p.desc}</p>
      <div class="row" style="justify-content:space-between; margin-top:10px">
        <strong>${money(p.price)}</strong>
        <a class="btn secondary" href="product.html?id=${p.id}">Ver</a>
      </div>
    `;
    grid.appendChild(card);
  });

  const chips = document.querySelectorAll("[data-cat]");
  chips.forEach(ch=>{
    if(ch.dataset.bound) return;
    ch.dataset.bound = "1";
    ch.addEventListener("click", ()=>{
      const v = ch.getAttribute("data-cat");
      window.location.href = v ? `store.html?cat=${encodeURIComponent(v)}` : "store.html";
    });
  });

  const cart = window.store?.loadCart?.() || [];
  const badge = $("#cartCount");
  if(badge) badge.textContent = String(cart.reduce((a,i)=>a+(i.qty||0),0));
}

function pageProduct(){
  renderNav();

  const id = Number(getQueryParam("id"));
  const p = DB.products.find(x=>x.id===id);
  if(!p){
    $("#productBox").innerHTML = `<div class="card">Producto no encontrado.</div>`;
    return;
  }

  $("#prName").textContent = p.name;
  $("#prDesc").textContent = p.desc;
  $("#prPrice").textContent = money(p.price);

  const main = $("#prMainImg");
  const thumbs = $("#prThumbs");
  if(main) main.src = p.images[0];

  if(thumbs){
    thumbs.innerHTML = "";
    p.images.forEach(src=>{
      const b = document.createElement("button");
      b.type="button";
      b.className="btn secondary";
      b.style.padding="8px 10px";
      b.textContent="Ver";
      b.addEventListener("click", ()=> { if(main) main.src = src; });
      thumbs.appendChild(b);
    });
  }

  const sel = $("#prSize");
  if(sel){
    sel.innerHTML = "";
    p.sizes.forEach(s=>{
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      sel.appendChild(opt);
    });
  }

  const btn = $("#addToCart");
  if(btn && !btn.dataset.bound){
    btn.dataset.bound="1";
    btn.addEventListener("click", ()=>{
      const size = $("#prSize")?.value || "M";
      const qty = Number($("#prQty")?.value) || 1;

      const cart = window.store.loadCart();
      const key = `${p.id}_${size}`;
      const item = cart.find(x=>x.key===key);

      if(item) item.qty += qty;
      else cart.push({ key, productId:p.id, size, qty });

      window.store.saveCart(cart);
      showToastMini("Producto añadido al carrito");
      setTimeout(()=> window.location.href = "cart.html", 700);
    });
  }
}

function pageCart(){
  renderNav();

  const wrap = $("#cartList");
  const totalEl = $("#cartTotal");
  if(!wrap || !totalEl) return;

  const cart = window.store.loadCart();
  wrap.innerHTML = "";

  let total = 0;

  cart.forEach((it, idx)=>{
    // Support product items and ticket items
    if(it.type === 'ticket'){
      const ev = it.eventId ? DB.events.find(x=>x.id===Number(it.eventId)) : null;
      const pass = ev && it.passId ? ev.passes.find(p=>p.id===Number(it.passId)) : null;
      const price = (it.price != null) ? it.price : (pass ? pass.price : 0);
      const sub = price * (it.qty||0);
      total += sub;

      const eventTitle = ev ? ev.name : (it.eventName || 'Evento');
      const passTitle = pass ? pass.name : (it.passName || 'Entrada');

      const row = document.createElement('div');
      row.className = 'card';
      row.innerHTML = `
        <div class="row" style="justify-content:space-between">
          <div>
            <div class="badge">🎟️ ${passTitle}</div>
            <h3 class="h-title" style="margin:8px 0 4px 0">${eventTitle}</h3>
            <p class="small">${money(price)} • Cantidad: ${it.qty}</p>
          </div>
          <div class="right">
            <strong>${money(sub)}</strong>
            <button class="btn danger" type="button">Quitar</button>
          </div>
        </div>
      `;
      row.querySelector('button').addEventListener('click', ()=>{
        cart.splice(idx,1);
        window.store.saveCart(cart);
        pageCart();
      });
      wrap.appendChild(row);
    } else if(it.productId){
      const p = DB.products.find(x=>x.id===it.productId);
      if(!p) return;
      const sub = p.price * (it.qty||0);
      total += sub;

      const row = document.createElement('div');
      row.className='card';
      row.innerHTML = `
        <div class="row" style="justify-content:space-between">
          <div>
            <div class="badge">Talla: ${it.size || '-'}</div>
            <h3 class="h-title" style="margin:8px 0 4px 0">${p.name}</h3>
            <p class="small">${money(p.price)} • Cantidad: ${it.qty}</p>
          </div>
          <div class="right">
            <strong>${money(sub)}</strong>
            <button class="btn danger" type="button">Quitar</button>
          </div>
        </div>
      `;
      row.querySelector('button').addEventListener('click', ()=>{
        cart.splice(idx,1);
        window.store.saveCart(cart);
        pageCart();
      });
      wrap.appendChild(row);
    }
  });

  totalEl.textContent = money(total);

  const checkout = $("#checkout");
  if(checkout && !checkout.dataset.bound){
    checkout.dataset.bound="1";
    checkout.addEventListener("click", ()=>{
      const s = getSession();
      if(!s || s.role !== "client"){
        alert("Necesitas iniciar sesión como Cliente para comprar.");
        window.location.href = "login.html";
        return;
      }
      if(cart.length === 0){
        alert("Carrito vacío.");
        return;
      }
      // Simulate a minimal payment step
      const proceed = confirm(`Total a pagar: ${money(total)}\n\nSimular pago con tarjeta?`);
      if(!proceed) return;

      // Process cart: create tickets for ticket items, and an order for product items
      const orders = window.store.loadOrders();
      const productsForOrder = cart.filter(i=>i.productId);
      const ticketsForCart = cart.filter(i=>i.type==='ticket');

      const createdOrderIds = [];
      const createdTicketIds = [];

      if(productsForOrder.length){
        const oid = Date.now();
        orders.push({
          id: oid,
          userEmail: s.email,
          date: new Date().toISOString().slice(0,10),
          eta: new Date(Date.now()+ 7*24*3600*1000).toISOString().slice(0,10),
          status: "En preparación",
          items: productsForOrder
        });
        createdOrderIds.push(oid);
      }

      // Create tickets entries for each ticket item
      ticketsForCart.forEach(ti=>{
        const ev = ti.eventId ? DB.events.find(e=>e.id === Number(ti.eventId)) : null;
        const pass = (ev && ti.passId) ? ev.passes.find(p=>p.id === Number(ti.passId)) : null;
        for(let i=0;i<(ti.qty||1);i++){
          const id = Date.now() + Math.floor(Math.random()*1000) + i;
          const code = `SUB-${ti.eventId || 'X'}-${ti.passId || 'X'}-${String(id).slice(-6)}`;
          DB.tickets.push({
            id,
            userEmail: s.email,
            eventId: ti.eventId ? Number(ti.eventId) : null,
            eventName: ev ? ev.name : (ti.eventName || null),
            passName: pass ? pass.name : (ti.passName || 'Entrada'),
            purchaseDate: new Date().toISOString().slice(0,10),
            status: "Activa",
            code
          });
          createdTicketIds.push(id);
        }
      });

      // Persist
      window.store.saveOrders(orders);
      window.store.saveCart([]);
      window.saveTickets?.();

      // Save a purchase summary for the UI
      const lastPurchase = {
        id: Date.now(),
        userEmail: s.email,
        date: new Date().toISOString().slice(0,10),
        total: total,
        orders: createdOrderIds,
        tickets: createdTicketIds
      };
      try{ localStorage.setItem('subsonic_last_purchase', JSON.stringify(lastPurchase)); }catch(e){}

      alert('Pago simulado: entradas y pedidos procesados.');
      window.location.href = `purchase-summary.html?id=${lastPurchase.id}`;
    });
  }
}

function pageOrders(){
  renderNav();
  requireRole(["client"]);

  const s = getSession();
  const list = $("#ordersList");
  if(!list) return;

  const orders = window.store.loadOrders().filter(o=>o.userEmail===s.email);

  list.innerHTML = "";
  if(orders.length === 0){
    list.innerHTML = `<div class="card">No hay pedidos todavía.</div>`;
    return;
  }

  orders.forEach(o=>{
    const card = document.createElement("div");
    card.className="card";
    card.innerHTML = `
      <div class="badge">📦 Pedido #${o.id}</div>
      <h3 class="h-title" style="margin:10px 0 6px 0">Estado: ${o.status}</h3>
      <p class="small">Fecha: ${formatDate(o.date)} • Entrega estimada: ${formatDate(o.eta)}</p>
      <div class="right">
        <button class="btn secondary" type="button">Reclamar</button>
      </div>
    `;
    card.querySelector("button").addEventListener("click", ()=>{
      alert("Reclamación enviada (simulada).");
    });
    list.appendChild(card);
  });
}

function pageHelp(){
  renderNav();

  const form = $("#helpForm");
  if(form && !form.dataset.bound){
    form.dataset.bound="1";
    form.addEventListener("submit",(e)=>{
      e.preventDefault();
      alert("Mensaje enviado (simulado). Te responderemos por email.");
      form.reset();
    });
  }
}

function pageForgotPassword(){
  renderNav();

  const form = $("#forgotForm");
  if(!form || form.dataset.bound) return;

  form.dataset.bound="1";
  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    alert("Si el correo existe, recibirás instrucciones (simulado).");
    window.location.href = "login.html";
  });
}

/* -------------------- Bootstrap per page -------------------- */
document.addEventListener("DOMContentLoaded", ()=>{
  renderNav();

  const page = document.body.dataset.page;

  const routes = {
    home: pageHome,
    events: pageEvents,
    event: pageEventDetail,
    artist: pageArtistDetail,
    login: pageLogin,
    register: pageRegister,

    // OJO: tu HTML es client_dashboard.html
    clientDash: pageClientDashboard,
    profile: pageProfile,
    pass: pagePass,
    purchaseSuccess: pagePurchaseSuccess,
    purchaseSummary: pagePurchaseSummary,
    tickets: pageTickets,
    ticket: pageTicketDetail,

    providerSpaces: pageProviderSpaces,
    space: pageSpaceDetail,
    spaceRequest: pageSpaceRequest,

    // Store pages
    store: pageStore,
    product: pageProduct,
    cart: pageCart,
    orders: pageOrders,
    help: pageHelp,
    forgot: pageForgotPassword,
  };

  routes[page]?.();
});

/* =========================================================
   Parallax & Hero effects for home page
   ========================================================= */
function initHeroParallax() {
  const heroBg = document.querySelector('.heroTL-bg');
  const heroOverlay = document.querySelector('.heroTL-overlay');
  
  if(!heroBg || !heroOverlay) return;
  
  let scrollPos = 0;
  let ticking = false;
  
  function updateParallax() {
    scrollPos = window.pageYOffset;
    
    // Parallax effect - move background slower than scroll
    if(scrollPos < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrollPos * 0.5}px)`;
    }
    
    // Fade overlay content on scroll
    const fadeStart = window.innerHeight * 0.5;
    const fadeEnd = window.innerHeight * 0.9;
    
    if(scrollPos < fadeStart) {
      heroOverlay.style.opacity = 1;
    } else if(scrollPos > fadeEnd) {
      heroOverlay.style.opacity = 0;
    } else {
      const fadeProgress = (scrollPos - fadeStart) / (fadeEnd - fadeStart);
      heroOverlay.style.opacity = 1 - fadeProgress;
    }
    
    ticking = false;
  }
  
  function onScroll() {
    if(!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', onScroll, { passive: true });
  updateParallax(); // Initial call
}

// Initialize parallax when DOM is ready
if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroParallax);
} else {
  initHeroParallax();
}

/* -------------------- Cart helpers for tickets -------------------- */
function addTicketToCart(eventId, passId, qty){
  const cart = window.store.loadCart();
  // Backwards compatible: if eventId is an object (opts), normalize
  if(typeof eventId === 'object' && eventId !== null){
    const opts = eventId;
    const key = opts.key || `ticket_${opts.eventId || opts.eventName}_${opts.passId || opts.passName}`;
    const existing = cart.find(i=>i.key===key && i.type==='ticket');
    if(existing){ existing.qty = (existing.qty||0) + (opts.qty||1); }
    else cart.push({ key, type:'ticket', eventId: opts.eventId || null, eventName: opts.eventName || null, passId: opts.passId || null, passName: opts.passName || null, price: opts.price || null, qty: opts.qty || 1 });
    window.store.saveCart(cart);
    return;
  }

  const key = `ticket_${eventId}_${passId}`;
  const existing = cart.find(i=>i.key===key && i.type==='ticket');
  if(existing){
    existing.qty = (existing.qty || 0) + (qty || 1);
  } else {
    cart.push({ key, type: 'ticket', eventId: eventId || null, passId: passId || null, qty: qty || 1 });
  }
  window.store.saveCart(cart);
}

function addFestivalPassToCart(eventName, passName, price, qty){
  const opts = { eventId: null, eventName: eventName, passId: null, passName: passName, price: price || 0, qty: qty || 1 };
  addTicketToCart(opts);
  renderNav();
}

/* -------------------- UI: Toast & Modal -------------------- */
function showToastMini(msg, timeout = 2200){
  let t = document.querySelector('.toast-mini');
  if(!t){
    t = document.createElement('div');
    t.className = 'toast-mini';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(()=> t.classList.add('show'));
  if(t._hideTimer) clearTimeout(t._hideTimer);
  t._hideTimer = setTimeout(()=>{
    t.classList.remove('show');
  }, timeout);
}

function showPassModal(eventName, passName, price, meta){
  // meta optional { eventId, passId }
  // create overlay
  let ov = document.querySelector('.modal-overlay');
  if(ov) ov.remove();
  ov = document.createElement('div');
  ov.className = 'modal-overlay';

  const card = document.createElement('div');
  card.className = 'modal-card';
  card.innerHTML = `
    <h3 class="modal-title">${eventName} — ${passName}</h3>
    <div class="modal-note">Precio unitario: ${money(price)}</div>
    <div class="modal-row">
      <label style="margin-right:8px">Cantidad:</label>
      <input class="modal-qty field" type="number" min="1" value="1" />
      <div style="flex:1"></div>
      <button class="btn secondary" id="modalCancel">Cancelar</button>
      <button class="btn" id="modalConfirm">Añadir</button>
    </div>
  `;

  ov.appendChild(card);
  document.body.appendChild(ov);

  const qtyInput = card.querySelector('.modal-qty');
  const cancel = card.querySelector('#modalCancel');
  const confirm = card.querySelector('#modalConfirm');

  function cleanup(){
    ov.remove();
  }

  cancel.addEventListener('click', cleanup);
  ov.addEventListener('click', (e)=>{ if(e.target === ov) cleanup(); });

  confirm.addEventListener('click', ()=>{
    const qty = Math.max(1, Number(qtyInput.value) || 1);
    if(meta && (meta.eventId || meta.passId)){
      addTicketToCart({ eventId: meta.eventId || null, passId: meta.passId || null, qty, price: price, eventName, passName });
    } else {
      addFestivalPassToCart(eventName, passName, price, qty);
    }
    showToastMini(`${qty} × ${passName} añadido${qty>1? 's':''} al carrito`);
    cleanup();
  });
}

function pagePurchaseSummary(){
  renderNav();
  requireRole(["client"]);

  const url = new URL(window.location.href);
  const id = url.searchParams.get('id');
  const raw = localStorage.getItem('subsonic_last_purchase');
  if(!raw){
    document.getElementById('summaryContent').innerHTML = `<div class="card">Resumen no encontrado.</div>`;
    return;
  }

  let summary = null;
  try{ summary = JSON.parse(raw); }catch(e){ summary = null; }
  if(!summary || String(summary.id) !== String(id)){
    document.getElementById('summaryContent').innerHTML = `<div class="card">Resumen no coincide o ha caducado.</div>`;
    return;
  }

  const s = getSession();
  if(!s || s.email !== summary.userEmail){
    document.getElementById('summaryContent').innerHTML = `<div class="card">No autorizado para ver este resumen.</div>`;
    return;
  }

  // Render tickets
  const ticketsHtml = [];
  summary.tickets.forEach(tid=>{
    const t = DB.tickets.find(x=>x.id===tid);
    if(!t) return;
    const ev = t.eventId ? DB.events.find(e=>e.id===t.eventId) : null;
    const title = ev ? ev.name : (t.eventName || 'Evento');
    ticketsHtml.push(`
      <div class="card">
        <div class="badge">🎫 ${title}</div>
        <h4 class="h-title">${t.passName}</h4>
        <p class="small">Código: <strong>${t.code}</strong> — Fecha compra: ${formatDate(t.purchaseDate)}</p>
      </div>
    `);
  });

  // Render orders (products)
  const orders = window.store.loadOrders() || [];
  const myOrders = orders.filter(o=> summary.orders.includes(o.id));
  const ordersHtml = myOrders.map(o=>{
    const items = (o.items||[]).map(it=>{
      const prod = DB.products.find(p=>p.id===it.productId);
      return `<div class="small">• ${prod ? prod.name : 'Producto'} x ${it.qty}</div>`;
    }).join('');
    return `
      <div class="card">
        <div class="badge">📦 Pedido #${o.id}</div>
        <p class="small">Fecha: ${formatDate(o.date)} • ETA: ${formatDate(o.eta)}</p>
        ${items}
      </div>
    `;
  }).join('');

  const totalHtml = `<div class="row" style="justify-content:space-between"><strong>Total pagado:</strong><strong>${money(summary.total)}</strong></div>`;

  document.getElementById('summaryContent').innerHTML = `
    <h3 class="h-title">Entradas</h3>
    ${ticketsHtml.join('') || '<div class="card">No hay entradas en esta compra.</div>'}
    <div class="hr"></div>
    <h3 class="h-title">Pedidos</h3>
    ${ordersHtml || '<div class="card">No hay pedidos de productos en esta compra.</div>'}
    <div class="hr"></div>
    ${totalHtml}
  `;

}