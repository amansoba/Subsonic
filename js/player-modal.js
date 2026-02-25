/* Player modal logic — lightweight, no audio yet.
   - Opens on click of any `.artist-card` element
   - Reads `data-artist` and `data-track` when available
   - Loads cover from `fotos_artistas/<slug>.jpg`, falls back to placeholder
   - Exposes play/pause UI toggles (no audio connected)
   - Easy place to hook Spotify API later
*/
(function(){
  function slugify(name){
    return String(name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g,'_')
      .replace(/^_|_$/g,'');
  }
  function init(){
    // Open artist modal implementation (for markup used in festival-barcelona)
    function openArtistModalFor(card){
    const modal = document.getElementById('artistModal');
    if(!modal) return false;
    const img = modal.querySelector('#artistModalImg');
    const title = modal.querySelector('#artistModalTitle');
    const stage = modal.querySelector('#artistModalStage');
    const trackTitle = modal.querySelector('#artistModalTrackTitle');
    const trackArtist = modal.querySelector('#artistModalTrackArtist');

    const artistName = card.dataset.artist || card.querySelector('.artist-name')?.textContent?.trim() || card.textContent.trim().slice(0,40) || 'Artist';
    const stageName = card.dataset.stage || card.querySelector('.artist-stage')?.textContent?.trim() || '';
    const track = card.dataset.track || 'Live Set';

    title && (title.textContent = artistName);
    stage && (stage.textContent = stageName);
    trackTitle && (trackTitle.textContent = track);
    trackArtist && (trackArtist.textContent = artistName);

    if(img){
      img.src = `fotos_artistas/${slugify(artistName)}.jpg`;
      img.onerror = function(){ this.onerror=null; this.src = 'fotos_artistas/placeholder.jpg'; };
    }

    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    return true;
    }

    function closeArtistModal(){
    const modal = document.getElementById('artistModal');
    if(!modal) return;
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  // Fallback: legacy playerOverlay (kept for backward compatibility)
  function openLegacyPlayerFor(card){
    const overlay = document.getElementById('playerOverlay');
    if(!overlay) return false;
    const playerArtist = document.getElementById('playerArtist');
    const playerTrack = document.getElementById('playerTrack');
    const playerCover = document.getElementById('playerCover');
    const artist = card.dataset.artist || card.querySelector('.artist-name')?.textContent?.trim() || 'Artist';
    const track = card.dataset.track || 'Live Set';
    playerArtist && (playerArtist.textContent = artist);
    playerTrack && (playerTrack.textContent = track);
    if(playerCover){ playerCover.src = `fotos_artistas/${slugify(artist)}.jpg`; playerCover.onerror = function(){ this.onerror=null; this.src='fotos_artistas/placeholder.jpg'; }; }
    overlay.style.display = 'flex'; overlay.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
    return true;
  }

    // Click delegation: open artist modal if present, otherwise fallback to legacy
    document.addEventListener('click', function(e){
      const card = e.target.closest('.artist-card');
      if(!card) return;
      // try artist modal first
      if(document.getElementById('artistModal')){
        openArtistModalFor(card);
      } else {
        openLegacyPlayerFor(card);
      }
    });

    // Close handlers for artist modal
    document.addEventListener('click', function(e){
      const modal = document.getElementById('artistModal');
      if(!modal) return;
      if(e.target.closest('.artist-modal-close')){ closeArtistModal(); }
      if(e.target.classList && e.target.classList.contains('artist-modal-overlay')){ closeArtistModal(); }
    });

    document.addEventListener('keydown', function(e){ if(e.key === 'Escape'){ closeArtistModal(); const overlay = document.getElementById('playerOverlay'); if(overlay) { overlay.style.display='none'; overlay.setAttribute('aria-hidden','true'); document.body.style.overflow=''; } } });

    // Play / Pause toggles for both modals (UI only)
    document.addEventListener('click', function(e){
      if(e.target.closest('#artistModalBtnPlay')){
        const play = document.getElementById('artistModalBtnPlay');
        const pause = document.getElementById('artistModalBtnPause');
        if(play) play.style.display='none'; if(pause) pause.style.display='inline-block';
      }
      if(e.target.closest('#artistModalBtnPause')){
        const play = document.getElementById('artistModalBtnPlay');
        const pause = document.getElementById('artistModalBtnPause');
        if(pause) pause.style.display='none'; if(play) play.style.display='inline-block';
      }

      // legacy ids
      if(e.target.closest('#playerPlay')){ const p=document.getElementById('playerPlay'), q=document.getElementById('playerPause'); if(p) p.style.display='none'; if(q) q.style.display='inline-block'; }
      if(e.target.closest('#playerPause')){ const p=document.getElementById('playerPlay'), q=document.getElementById('playerPause'); if(q) q.style.display='none'; if(p) p.style.display='inline-block'; }
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
