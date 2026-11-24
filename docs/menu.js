(function(){
  var side=document.getElementById('side'), scrim=document.getElementById('scrim'), menu=document.getElementById('menubtn');
  if(!side||!scrim||!menu) return;
  function openMenu(){ side.classList.add('open'); scrim.classList.add('open'); menu.setAttribute('aria-expanded','true'); document.body.classList.add('menu-open'); var f1=side.querySelector('a'); if(f1) setTimeout(function(){ f1.focus(); },50); }
  function closeMenu(){ var was=side.classList.contains('open'); side.classList.remove('open'); scrim.classList.remove('open'); menu.setAttribute('aria-expanded','false'); document.body.classList.remove('menu-open'); if(was && side.contains(document.activeElement)) menu.focus(); }
  menu.addEventListener('click',function(){ side.classList.contains('open')?closeMenu():openMenu(); });
  scrim.addEventListener('click',closeMenu);
  side.addEventListener('click',function(e){ if(e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeMenu(); });
})();
