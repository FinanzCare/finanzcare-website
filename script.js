(function(){
  var b=document.querySelector('.burger'),m=document.querySelector('.mnav');
  if(b&&m){b.addEventListener('click',function(){var o=m.hasAttribute('hidden');m[o?'removeAttribute':'setAttribute']('hidden','');b.setAttribute('aria-expanded',o)})}
  // Themen-Menü: Maus = Hover (CSS), Klick/Tastatur = auf/zu, Esc oder Klick daneben schließt
  [].forEach.call(document.querySelectorAll('.nav-group'),function(g){var p=g.querySelector('.nav-parent');
    function zu(){g.classList.remove('open');p.setAttribute('aria-expanded','false')}
    p.addEventListener('click',function(){var o=!g.classList.contains('open');g.classList.toggle('open',o);p.setAttribute('aria-expanded',o)});
    document.addEventListener('click',function(ev){if(!g.contains(ev.target))zu()});
    g.addEventListener('keydown',function(ev){if(ev.key==='Escape'){zu();p.focus()}})});
  // Senden an Apps Script: text/plain statt application/json, damit der Browser keine CORS-Vorabfrage schickt (Apps Script beantwortet sie nicht).
  function senden(ep,d){return fetch(ep,{method:'POST',body:JSON.stringify(d)}).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(t){try{var j=JSON.parse(t);if(j&&j.ok===false)throw 0}catch(x){if(x===0)throw 0}})}
  var mailRe=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // Guide-Formulare
  [].forEach.call(document.querySelectorAll('.gform'),function(g){
    var err=g.querySelector('.err'),btn=g.querySelector('button[type=submit]');
    g.addEventListener('submit',function(ev){ev.preventDefault();var el=g.elements,msg='';
      var wahl=[].filter.call(g.querySelectorAll('input[name=guides]'),function(x){return x.checked}).map(function(x){return x.value});
      if(!wahl.length)msg='Bitte wähle mindestens einen Guide aus.';
      else if(!el.name.value.trim())msg='Bitte gib deinen Namen an.';
      else if(!mailRe.test(el.email.value.trim()))msg='Bitte prüfe deine E-Mail-Adresse.';
      else if(el.handy.value.replace(/\D/g,'').length<8)msg='Bitte gib deine Handynummer an.';
      else if(g.getAttribute('data-anruf-pflicht')==='1'&&!el.einwilligung_anruf.checked)msg='Bitte bestätige, dass wir dich kurz anrufen dürfen.';
      if(msg){err.textContent=msg;err.hidden=false;return}
      err.hidden=true;
      function fertig(){[].forEach.call(g.children,function(c){if(!c.classList.contains('done'))c.hidden=true});g.querySelector('.done').hidden=false;g.querySelector('.done').focus&&g.querySelector('.done').setAttribute('tabindex','-1');g.querySelector('.done').focus()}
      if(el.website.value){fertig();return}
      var ep=g.getAttribute('data-endpoint');
      if(!ep){err.textContent='Entwurf: noch kein Empfänger eingerichtet, es wurde nichts gesendet.';err.hidden=false;return}
      var d={art:'guide',guides:wahl.join(','),name:el.name.value.trim(),email:el.email.value.trim(),handy:el.handy.value.trim(),zeit:el.zeit.value||'egal',
        einwilligung_anruf:el.einwilligung_anruf.checked?'ja':'nein',einwilligung_text:el.einwilligung_anruf.checked?g.querySelector('.consent span').textContent:'',
        einwilligung_version:g.getAttribute('data-version'),seite:location.pathname,website:''};
      btn.disabled=true;btn.textContent='Wird gesendet …';
      senden(ep,d).then(fertig).catch(function(){btn.disabled=false;btn.textContent='Guide kostenlos zuschicken →';err.textContent='Das hat leider nicht geklappt. Bitte versuche es gleich noch einmal.';err.hidden=false})});
  });
  // Check (Eintragen in 5 Schritten)
  var f=document.getElementById('check');if(!f)return;
  var steps=[].slice.call(f.querySelectorAll('.q')),i=0,prev=f.querySelector('[data-prev]'),next=f.querySelector('[data-next]'),send=f.querySelector('[data-send]'),err=f.querySelector('.err'),bar=f.querySelector('.progress i');
  function show(){steps.forEach(function(s,k){s.hidden=k!==i});prev.hidden=i===0;next.hidden=i===steps.length-1;send.hidden=i!==steps.length-1;bar.style.width=((i+1)/steps.length*100)+'%';err.hidden=true}
  function ok(){var s=steps[i],msg='';
    if(i<3&&!s.querySelector('input:checked'))msg='Bitte wähle eine Antwort aus.';
    if(i===3&&!s.querySelector('input:checked'))msg='Bitte wähle mindestens ein Thema aus.';
    if(i===4){var v=f.elements.vorname.value.trim(),t=f.elements.telefon.value.trim(),e=f.elements.email.value.trim();
      if(!v||t.replace(/\D/g,'').length<6||!mailRe.test(e))msg='Bitte Vorname, Telefon und gültige E-Mail angeben.';
      else if(!f.elements.einwilligung.checked)msg='Bitte stimme der Kontaktaufnahme zu.'}
    if(msg){err.textContent=msg;err.hidden=false;return false}return true}
  next.addEventListener('click',function(){if(ok()){i++;show();window.scrollTo({top:f.offsetTop-80})}});
  prev.addEventListener('click',function(){i--;show()});
  f.querySelectorAll('.q:not([data-step="4"]):not([data-step="5"]) input').forEach(function(r){r.addEventListener('change',function(){setTimeout(function(){if(ok()){i++;show()}},180)})});
  f.addEventListener('submit',function(ev){ev.preventDefault();if(!ok())return;
    var d={art:'check'};new FormData(f).forEach(function(v,k){d[k]=d[k]?d[k]+', '+v:v});delete d.einwilligung;
    d.einwilligung_kontakt='ja';d.einwilligung_text=f.querySelector('.consent span').textContent;d.einwilligung_version=f.getAttribute('data-version');d.seite=location.pathname;
    var ep=f.getAttribute('data-endpoint');
    function fertig(){steps.forEach(function(s){s.hidden=true});f.querySelector('.check-nav').hidden=true;f.querySelector('.progress').hidden=true;f.querySelector('.done').hidden=false}
    if(!ep){err.textContent='Entwurf: noch kein Empfänger eingerichtet, es wurde nichts gesendet.';err.hidden=false;return}
    senden(ep,d).then(fertig).catch(function(){err.textContent='Das hat leider nicht geklappt. Bitte versuche es später noch einmal.';err.hidden=false})});
  show();
})();
