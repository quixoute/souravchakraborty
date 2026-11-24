(() => {
  const data=window.PORTFOLIO;if(!data)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const grid=document.getElementById('category-grid');
  const card=category=>{const first=category.projects[0]||{};return '<a class="category reveal" href="#'+esc(category.id)+'" data-category="'+esc(category.id)+'"><div class="category-media"><img src="'+esc(first.image||data.site.heroPoster||'31.jpg')+'" alt="'+esc(category.title)+'" loading="lazy"></div><div class="category-meta"><h3>'+esc(category.title)+'</h3><span class="category-count">'+String(category.projects.length).padStart(2,'0')+' PROJECTS</span></div><p>'+esc(category.description)+'</p></a>';};
  grid.innerHTML=data.categories.map(card).join('');document.getElementById('year').textContent=new Date().getFullYear();
  const nav=document.getElementById('nav'),toggle=document.querySelector('.menu-toggle'),menu=document.getElementById('mobile-menu');
  const closeMenu=()=>{menu.classList.remove('open');menu.setAttribute('aria-hidden','true');toggle.setAttribute('aria-expanded','false');document.body.style.overflow='';};
  toggle.addEventListener('click',()=>{menu.classList.add('open');menu.setAttribute('aria-hidden','false');toggle.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';});
  document.querySelector('.menu-close').addEventListener('click',closeMenu);menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));window.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40),{passive:true});
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.12});
  const observe=()=>document.querySelectorAll('.reveal:not(.visible)').forEach(el=>observer.observe(el));observe();
  if(data.site.heroVideo){const hero=document.getElementById('hero-media'),v=document.createElement('video');v.src=data.site.heroVideo;v.autoplay=true;v.muted=true;v.loop=true;v.playsInline=true;v.preload='metadata';v.setAttribute('aria-hidden','true');hero.replaceChildren(v);v.play().catch(()=>{});}

  const form=document.getElementById('enquiry-form');
  if(form)form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const values=Object.fromEntries(new FormData(form));
    const subject='Project enquiry: '+values['Project category'];
    const body=Object.entries(values).filter(([,value])=>String(value).trim()).map(([key,value])=>key+': '+value).join('\\n\\n');
    document.getElementById('form-note').textContent='Opening your email application with the enquiry details. Nothing is sent automatically.';
    window.location.href='mailto:'+encodeURIComponent(data.site.email)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  });

  const renderRoute=()=>{const id=decodeURIComponent(location.hash.slice(1)||'home'),category=data.categories.find(c=>c.id===id);document.getElementById('category-view')?.remove();if(!category)return;
    const section=document.createElement('section');section.id='category-view';section.className='section category-view';
    const items=category.projects.map(p=>'<a class="project-link reveal" href="'+esc(p.href)+'"><div class="category-media"><img src="'+esc(p.image||data.site.heroPoster)+'" alt="'+esc(p.title)+'" loading="lazy"></div><h3>'+esc(p.title)+'</h3><p>'+esc(p.description)+'</p><span class="text-link">VIEW PROJECT ↗</span></a>').join('');
    section.innerHTML='<div class="category-view-head"><button class="back-link" type="button" id="back-work">← BACK TO SELECTED WORK</button><p class="eyebrow" style="margin-top:52px">PORTFOLIO CATEGORY</p><h2 style="font:300 clamp(48px,8vw,100px)/1 var(--serif);margin:18px 0">'+esc(category.title)+'</h2><p style="color:var(--muted);max-width:48ch">'+esc(category.description)+'</p></div><div class="category-view-grid">'+items+'</div>';
    document.querySelector('main').appendChild(section);document.getElementById('back-work').addEventListener('click',()=>{section.remove();history.pushState(null,'','#work');document.getElementById('work').scrollIntoView({behavior:'smooth'});});observe();window.scrollTo({top:section.offsetTop-20,behavior:'smooth'});
  };
  window.addEventListener('hashchange',renderRoute);if(data.categories.some(c=>c.id===decodeURIComponent(location.hash.slice(1))))renderRoute();
})();