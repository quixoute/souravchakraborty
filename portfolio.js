(() => {
 const data=window.PORTFOLIO;if(!data)return;
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const grid=document.getElementById('category-grid');
 const card=category=>{const p=category.projects[0]||{};const media=p.videoId?'<iframe src="https://www.youtube-nocookie.com/embed/'+esc(p.videoId)+'?autoplay=1&mute=1&loop=1&playlist='+esc(p.videoId)+'&controls=0&modestbranding=1&playsinline=1&rel=0" title="'+esc(p.title)+' video thumbnail" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" tabindex="-1"></iframe>':'<img src="'+esc(p.image||data.site.heroPoster)+'" alt="'+esc(category.title)+'" loading="lazy">';return '<a class="category reveal" href="#'+esc(category.id)+'" data-category="'+esc(category.id)+'"><div class="category-media">'+media+'</div><div class="category-meta"><h3>'+esc(category.title)+'</h3><span class="category-count">'+String(category.projects.length).padStart(2,'0')+' PROJECTS</span></div><p>'+esc(category.description)+'</p></a>';};
 grid.innerHTML=data.categories.map(card).join('');document.getElementById('year').textContent=new Date().getFullYear();
 const nav=document.getElementById('nav'),toggle=document.querySelector('.menu-toggle'),menu=document.getElementById('mobile-menu');
 const closeMenu=()=>{menu.classList.remove('open');menu.setAttribute('aria-hidden','true');toggle.setAttribute('aria-expanded','false');document.body.style.overflow='';};
 toggle.addEventListener('click',()=>{menu.classList.add('open');menu.setAttribute('aria-hidden','false');toggle.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';});
 document.querySelector('.menu-close').addEventListener('click',closeMenu);menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));window.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
 const heroCopy=document.querySelector('.hero-copy');
 const motionTargets=[
  ...document.querySelectorAll('.intro .eyebrow,.intro-line,.section-head,.category,.feature-copy,.about-copy,.capabilities>div,.contact-heading,.enquiry-form')
 ];
 let ticking=false;
 const updateScrollMotion=()=>{
  const vh=window.innerHeight||1;
  const sy=window.scrollY||0;
  nav.classList.toggle('scrolled',sy>40);
  if(!reduced&&heroCopy){
   const p=clamp(sy/(vh*.9),0,1.25);
   heroCopy.style.transform='translate3d(0,'+(-p*210)+'px,0)';
   heroCopy.style.opacity=String(clamp(1-p*1.12,0,1));
  }
  if(!reduced){
   motionTargets.forEach((el,i)=>{
    const r=el.getBoundingClientRect();
    const center=r.top+r.height*.5;
    const distance=(center-vh*.52)/vh;
    const entering=clamp((vh-r.top)/(vh*.72),0,1);
    const leaving=clamp((r.bottom+vh*.12)/(vh*.72),0,1);
    const visibility=Math.min(entering,leaving);
    const drift=clamp(-distance*42,-42,42);
    const intro=el.classList.contains('intro-line')||el.closest('.intro');
    const fromBelow=intro?((1-entering)*58 - (1-leaving)*24):drift;
    const opacity=intro?clamp(visibility*1.35,0,1):clamp(visibility*1.6,0,1);
    el.style.transform='translate3d(0,'+fromBelow.toFixed(1)+'px,0)';
    el.style.opacity=String(opacity);
   });
  }
  ticking=false;
 };
 const requestScrollUpdate=()=>{if(!ticking){requestAnimationFrame(updateScrollMotion);ticking=true;}};
 window.addEventListener('scroll',requestScrollUpdate,{passive:true});
 window.addEventListener('resize',requestScrollUpdate,{passive:true});
 updateScrollMotion();
 const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('visible','is-visible');}
  else if(!reduced)e.target.classList.remove('visible');
 }),{threshold:0,rootMargin:'8% 0px 8% 0px'});
 document.querySelectorAll('.reveal,.intro').forEach(el=>revealObserver.observe(el));
 const form=document.getElementById('enquiry-form');
 if(form)form.addEventListener('submit',async event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const note=document.getElementById('form-note'),button=form.querySelector('[type="submit"]');
  if(form.elements._gotcha?.value)return;
  form.classList.remove('is-error','is-success');form.classList.add('is-submitting');button.textContent='SENDING…';note.textContent='Sending your enquiry securely…';
  try{const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
   if(!response.ok)throw new Error('Form submission failed');
   form.classList.remove('is-submitting');form.classList.add('is-success');note.textContent='Thank you — your enquiry has been sent. I’ll be in touch soon.';button.textContent='ENQUIRY SENT ✓';form.reset();
  }catch(error){form.classList.remove('is-submitting');form.classList.add('is-error');note.textContent='Something went wrong. Please try again, or email me directly.';button.textContent='TRY AGAIN ↗';}
 });
 const renderRoute=()=>{const id=decodeURIComponent(location.hash.slice(1)||'home'),category=data.categories.find(c=>c.id===id);document.getElementById('category-view')?.remove();if(!category)return;
  const section=document.createElement('section');section.id='category-view';section.className='section category-view';
  const items=category.projects.map(p=>{const media=p.videoId?'<iframe src="https://www.youtube-nocookie.com/embed/'+esc(p.videoId)+'?autoplay=1&mute=1&loop=1&playlist='+esc(p.videoId)+'&controls=0&modestbranding=1&playsinline=1" title="'+esc(p.title)+' video thumbnail" loading="lazy" allow="autoplay; encrypted-media" tabindex="-1"></iframe>':'<img src="'+esc(p.image||data.site.heroPoster)+'" alt="'+esc(p.title)+'" loading="lazy">';return '<a class="project-link reveal" href="'+esc(p.href)+'"><div class="category-media">'+media+'</div><h3>'+esc(p.title)+'</h3><p>'+esc(p.description)+'</p><span class="text-link">VIEW PROJECT ↗</span></a>';}).join('');
  section.innerHTML='<div class="category-view-head"><button class="back-link" type="button" id="back-work">← BACK TO SELECTED WORK</button><p class="eyebrow" style="margin-top:52px">PORTFOLIO CATEGORY</p><h2 style="font:300 clamp(48px,8vw,100px)/1 var(--serif);margin:18px 0">'+esc(category.title)+'</h2><p style="color:var(--muted);max-width:48ch">'+esc(category.description)+'</p></div><div class="category-view-grid">'+items+'</div>';
  document.querySelector('main').appendChild(section);document.getElementById('back-work').addEventListener('click',()=>{section.remove();history.pushState(null,'','#work');document.getElementById('work').scrollIntoView({behavior:'smooth'});});section.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));window.scrollTo({top:section.offsetTop-20,behavior:'smooth'});
 };
 window.addEventListener('hashchange',renderRoute);if(data.categories.some(c=>c.id===decodeURIComponent(location.hash.slice(1))))renderRoute();
})();