// Helpers
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

function renderNav(){
  const nav = $("#navlinks");
  if(!nav) return;

  const s = getSession();
  // Enlaces comunes
  let links = [
    { href:"events.html", label:"Eventos" },
  ];

  // Merch está en el enunciado, pero si NO vais a crear vista merch, dejadlo como placeholder:
  links.push({ href:"#", label:"Merch (prototipo)" });

  if(!s){
    links.push({ href:"login.html", label:"My Account" });
  } else if(s.role === "client"){
    links.push({ href:"client-dashboard.html", label:"Mi Cuenta" });
    links.push({ href:"tickets.html", label:"Mis Entradas" });
    links.push({ href:"#", label:`👤 ${s.name || "Cliente"}` });
    links.push({ href:"#", label:"Cerrar sesión", action:"logout" });
  } else if(s.role === "provider"){
    links.push({ href:"provider-spaces.html", label:"Espacios" });
    links.push({ href:"#", label:`🏷️ ${s.name || "Proveedor"}` });
    links.push({ href:"#", label:"Cerrar sesión", action:"logout" });
  }

  nav.innerHTML = links.map(l=>{
    const a = document.createElement("a");
    a.href = l.href;
    a.textContent = l.label;
    if(l.action === "logout"){
      a.href="#";
      a.addEventListener("click",(e)=>{
        e.preventDefault();
        clearSession();
        window.location.href = "index.html";
      });
    }
    return a.outerHTML;
  }).join("");

  // Re-atachar eventos en logout (porque outerHTML pierde listeners)
  // Solución simple: re-render con DOM real:
  nav.innerHTML = "";
  links.forEach(l=>{
    const a = document.createElement("a");
    a.href = l.href;
    a.textContent = l.label;
    if(l.action === "logout"){
      a.href="#";
      a.addEventListener("click",(e)=>{
        e.preventDefault();
        clearSession();
        window.location.href = "index.html";
      });
    }
    nav.appendChild(a);
  });
}

// ====== Páginas ======

function pageHome(){
  renderNav();
  // Render eventos destacados
  const wrap = $("#featuredEvents");
  if(!wrap) return;

  wrap.innerHTML = "";
  DB.events.slice(0,3).forEach(ev=>{
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div class="badge">📅 ${formatDate(ev.date)} • 📍 ${ev.city} • 🎤 ${ev.venue}</div>
      <h3 style="margin:10px 0 6px 0">${ev.name}</h3>
      <p class="small">${ev.desc}</p>
      <div class="right">
        <a class="btn secondary" href="event.html?id=${ev.id}">Ver detalle</a>
      </div>
    `;
    wrap.appendChild(div);
  });

  const form = $("#homeSearchForm");
  if(form){
    form.addEventListener("submit",(e)=>{
      e.preventDefault();
      const q = $("#q").value.trim();
      const date = $("#date").value;
      const url = new URL(window.location.origin + window.location.pathname.replace("index.html","events.html"));
      if(q) url.searchParams.set("q", q);
      if(date) url.searchParams.set("date", date);
      window.location.href = url.pathname + url.search;
    });
  }
}

function pageEvents(){
  renderNav();
  const q = (getQueryParam("q") || "").toLowerCase();
  const date = getQueryParam("date") || "";
  const genre = getQueryParam("genre") || "";

  const list = $("#eventList");
  if(!list) return;

  const filtered = DB.events.filter(ev=>{
    const okQ = !q || ev.name.toLowerCase().includes(q);
    const okDate = !date || ev.date === date;
    // El género aquí es simulado; lo dejamos como filtro suave por “contiene” en descripción
    const okGenre = !genre || ev.desc.toLowerCase().includes(genre.toLowerCase());
    return okQ && okDate && okGenre;
  });

  $("#filterQ").value = getQueryParam("q") || "";
  $("#filterDate").value = date;
  $("#filterGenre").value = genre;

  list.innerHTML = "";
  filtered.forEach(ev=>{
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div class="badge">📅 ${formatDate(ev.date)} • 📍 ${ev.city}</div>
      <h3 style="margin:10px 0 6px 0">${ev.name}</h3>
      <p class="small">${ev.desc}</p>
      <div class="right">
        <a class="btn secondary" href="event.html?id=${ev.id}">Ver detalle</a>
      </div>
    `;
    list.appendChild(div);
  });

  $("#filtersForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    const nq = $("#filterQ").value.trim();
    const nd = $("#filterDate").value;
    const ng = $("#filterGenre").value;
    const url = new URL(window.location.href);
    url.searchParams.delete("q");
    url.searchParams.delete("date");
    url.searchParams.delete("genre");
    if(nq) url.searchParams.set("q", nq);
    if(nd) url.searchParams.set("date", nd);
    if(ng) url.searchParams.set("genre", ng);
    window.location.href = url.pathname + url.search;
  });
}

function pageEventDetail(){
  renderNav();
  const id = Number(getQueryParam("id"));
  const ev = DB.events.find(e=>e.id===id);
  if(!ev){
    $("#eventDetail").innerHTML = `<div class="card">Evento no encontrado.</div>`;
    return;
  }

  $("#evName").textContent = ev.name;
  $("#evMeta").textContent = `${formatDate(ev.date)} • ${ev.venue} • ${ev.city}`;
  $("#evDesc").textContent = ev.desc;

  // Artists
  const aWrap = $("#artistList");
  aWrap.innerHTML = "";
  ev.artists.forEach(aid=>{
    const a = DB.artists.find(x=>x.id===aid);
    if(!a) return;
    const item = document.createElement("div");
    item.className = "card";
    item.style.padding = "12px";
    item.innerHTML = `
      <div class="badge">🎧 ${a.genre}</div>
      <h4 style="margin:8px 0 6px 0">${a.name}</h4>
      <p class="small">${a.bio}</p>
      <div class="right">
        <a class="btn secondary" href="artist.html?id=${a.id}&eventId=${ev.id}">Ver artista</a>
      </div>
    `;
    aWrap.appendChild(item);
  });

  // Passes
  const pWrap = $("#passList");
  pWrap.innerHTML = "";
  ev.passes.forEach(p=>{
    const item = document.createElement("div");
    item.className = "card";
    item.style.padding = "12px";
    item.innerHTML = `
      <div class="badge">🎟️ ${p.name} • €${p.price}</div>
      <p class="small" style="margin:8px 0">${p.includes}</p>
      <div class="right">
        <a class="btn" href="pass.html?eventId=${ev.id}&passId=${p.id}">Comprar</a>
      </div>
    `;
    pWrap.appendChild(item);
  });

  // Spotify placeholder
  $("#spotifyBox").innerHTML = `
    <div class="card">
      <div class="badge">Spotify Player (placeholder)</div>
      <p class="small">En práctica futura se integrará API externa. En esta práctica es un componente simulado.</p>
      <button class="btn secondary" type="button" onclick="alert('Preview simulado')">▶ Play</button>
    </div>
  `;
}

function pageArtistDetail(){
  renderNav();
  const id = Number(getQueryParam("id"));
  const eventId = getQueryParam("eventId");
  const a = DB.artists.find(x=>x.id===id);
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
    row.style.padding = "12px";
    row.innerHTML = `
      <div class="row" style="align-items:center;justify-content:space-between">
        <div>🎵 ${t}</div>
        <button class="btn secondary" type="button">▶ Preview</button>
      </div>
    `;
    row.querySelector("button").addEventListener("click", ()=>alert("Preview simulado"));
    tracks.appendChild(row);
  });

  const back = $("#backToEvent");
  if(eventId){
    back.href = `event.html?id=${eventId}`;
  } else {
    back.href = "events.html";
  }
}

function pageLogin(){
  renderNav();
  const form = $("#loginForm");
  const toast = $("#loginToast");
  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const email = $("#email").value.trim();
    const role = $("#role").value;
    const name = email.split("@")[0] || (role==="client" ? "Cliente" : "Proveedor");

    // Sesión simulada
    setSession({ email, role, name });

    toast.style.display="block";
    toast.textContent = "Sesión iniciada (simulada). Redirigiendo...";

    setTimeout(()=>{
      window.location.href = (role==="client") ? "client-dashboard.html" : "provider-spaces.html";
    }, 700);
  });
}

function pageRegister(){
  renderNav();
  const form = $("#registerForm");
  const providerBox = $("#providerFields");
  $("#roleReg").addEventListener("change",(e)=>{
    providerBox.style.display = (e.target.value==="provider") ? "block" : "none";
  });

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
  $("#helloClient").textContent = `Hola, ${s.name}`;

  // Resumen
  const myTickets = DB.tickets.filter(t=>t.userEmail===s.email);
  $("#ticketsCount").textContent = String(myTickets.length);
}

function pagePass(){
  renderNav();
  requireRole(["client"]);

  const eventId = Number(getQueryParam("eventId"));
  const passId = Number(getQueryParam("passId"));

  const ev = DB.events.find(e=>e.id===eventId);
  if(!ev){
    $("#passBox").innerHTML = `<div class="card">Evento no encontrado.</div>`;
    return;
  }

  const pass = ev.passes.find(p=>p.id===passId) || ev.passes[0];
  $("#pEvent").textContent = ev.name;
  $("#pPass").textContent = `${pass.name} (€${pass.price})`;
  $("#pIncludes").textContent = pass.includes;

  $("#confirmPurchase").addEventListener("click", ()=>{
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

    window.location.href = `purchase-success.html?id=${id}`;
  });
  $("#backEvent").href = `event.html?id=${eventId}`;
}

function pagePurchaseSuccess(){
  renderNav();
  requireRole(["client"]);
  const id = Number(getQueryParam("id"));
  const s = getSession();
  const t = DB.tickets.find(x=>x.id===id && x.userEmail===s.email);
  if(!t){
    $("#successBox").innerHTML = `<div class="card">Compra no encontrada.</div>`;
    return;
  }
  const ev = DB.events.find(e=>e.id===t.eventId);
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
  const list = $("#ticketsTableBody");
  const mine = DB.tickets.filter(t=>t.userEmail===s.email);

  list.innerHTML = "";
  mine.forEach(t=>{
    const ev = DB.events.find(e=>e.id===t.eventId);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ev ? ev.name : t.eventId}</td>
      <td>${t.passName}</td>
      <td>${formatDate(t.purchaseDate)}</td>
      <td>${t.status}</td>
      <td><a class="btn secondary" href="ticket.html?id=${t.id}">Ver detalle</a></td>
    `;
    list.appendChild(tr);
  });
}

function pageTicketDetail(){
  renderNav();
  requireRole(["client"]);
  const s = getSession();
  const id = Number(getQueryParam("id"));
  const t = DB.tickets.find(x=>x.id===id && x.userEmail===s.email);
  if(!t){
    $("#ticketBox").innerHTML = `<div class="card">Entrada no encontrada.</div>`;
    return;
  }
  const ev = DB.events.find(e=>e.id===t.eventId);
  $("#tEvent").textContent = ev ? ev.name : `Evento #${t.eventId}`;
  $("#tPass").textContent = t.passName;
  $("#tDate").textContent = formatDate(t.purchaseDate);
  $("#tStatus").textContent = t.status;
  $("#tCode").textContent = t.code;

  const btn = $("#cancelTicket");
  const toast = $("#ticketToast");
  btn.disabled = (t.status !== "Activa");
  btn.addEventListener("click", ()=>{
    if(confirm("¿Solicitar cancelación? (simulado)")){
      t.status = "Cancelada";
      $("#tStatus").textContent = t.status;
      btn.disabled = true;
      toast.style.display="block";
      toast.textContent="Cancelación registrada (simulada).";
    }
  });

  $("#backTickets").href = "tickets.html";
}

function pageProfile(){
  renderNav();
  requireRole(["client"]);
  const s = getSession();
  $("#pName").value = s.name || "";
  $("#pEmail").value = s.email || "";
  $("#profileForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    s.name = $("#pName").value.trim() || s.name;
    setSession(s);
    alert("Cambios guardados (simulado).");
    window.location.href = "client-dashboard.html";
  });
  $("#backDash").href = "client-dashboard.html";
}

function pageProviderSpaces(){
  renderNav();
  requireRole(["provider"]);

  // filtro simple
  const form = $("#spaceFiltersForm");
  const list = $("#spacesList");
  const s = getSession();

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
      const ev = DB.events.find(e=>e.id===sp.eventId);
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <div class="badge">🏷️ ${sp.type} • 📏 ${sp.size} • €${sp.pricePerDay}/día</div>
        <h3 style="margin:10px 0 6px 0">${sp.location} (${ev ? ev.name : "Evento"})</h3>
        <p class="small">Estado: <strong style="color:${sp.status==="Disponible" ? "var(--ok)" : "var(--warn)"}">${sp.status}</strong> • Servicios: ${sp.services}</p>
        <div class="right">
          <a class="btn secondary" href="space.html?id=${sp.id}">Ver ficha</a>
        </div>
      `;
      list.appendChild(div);
    });

    $("#helloProvider").textContent = `Panel Proveedor: ${s.name}`;
  }

  // llenar select evento
  const sel = $("#spEvent");
  if(sel && sel.options.length <= 1){
    DB.events.forEach(ev=>{
      const opt = document.createElement("option");
      opt.value = ev.id;
      opt.textContent = ev.name;
      sel.appendChild(opt);
    });
  }

  form.addEventListener("submit",(e)=>{e.preventDefault(); render();});
  render();
}

function pageSpaceDetail(){
  renderNav();
  requireRole(["provider"]);
  const id = Number(getQueryParam("id"));
  const sp = DB.spaces.find(x=>x.id===id);
  if(!sp){
    $("#spaceBox").innerHTML = `<div class="card">Espacio no encontrado.</div>`;
    return;
  }
  const ev = DB.events.find(e=>e.id===sp.eventId);

  $("#spTitle").textContent = `${sp.type} — ${sp.location}`;
  $("#spMeta").textContent = `${ev ? ev.name : "Evento"} • ${sp.size} • €${sp.pricePerDay}/día`;
  $("#spServices").textContent = sp.services;
  $("#spNotes").textContent = sp.notes;
  $("#spStatus").textContent = sp.status;

  const btn = $("#goRequest");
  btn.href = `space-request.html?id=${sp.id}`;
  btn.classList.toggle("secondary", sp.status !== "Disponible");
  btn.textContent = (sp.status === "Disponible") ? "Solicitar alquiler" : "No disponible (simulado)";
  btn.style.pointerEvents = (sp.status === "Disponible") ? "auto" : "none";

  $("#backSpaces").href = "provider-spaces.html";
}

function pageSpaceRequest(){
  renderNav();
  requireRole(["provider"]);
  const id = Number(getQueryParam("id"));
  const sp = DB.spaces.find(x=>x.id===id);
  if(!sp){
    $("#reqBox").innerHTML = `<div class="card">Espacio no encontrado.</div>`;
    return;
  }
  $("#reqSpace").textContent = `${sp.type} — ${sp.location} (${sp.size})`;
  $("#reqPrice").textContent = `€${sp.pricePerDay}/día`;

  $("#requestForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    alert("Solicitud enviada (simulada).");
    window.location.href = "provider-spaces.html";
  });

  $("#backSpace").href = `space.html?id=${sp.id}`;
}

// Bootstrap por página
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
    clientDash: pageClientDashboard,
    pass: pagePass,
    purchaseSuccess: pagePurchaseSuccess,
    tickets: pageTickets,
    ticket: pageTicketDetail,
    profile: pageProfile,
    providerSpaces: pageProviderSpaces,
    space: pageSpaceDetail,
    spaceRequest: pageSpaceRequest,
  };
  if(routes[page]) routes[page]();
});