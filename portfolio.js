(() => {
 const data=window.PORTFOLIO;if(!data)return;
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
 const nav=$("#nav"),menu=$("#mobile-menu"),toggle=$(".menu-toggle");
 const closeMenu=()=>{menu.classList.remove("open");menu.setAttribute("aria-hidden","true");toggle.setAttribute("aria-expanded","false");document.body.style.overflow=""};
 toggle.addEventListener("click",()=>{menu.classList.add("open");menu.setAttribute("aria-hidden","false");toggle.setAttribute("aria-expanded","true");document.body.style.overflow="hidden"});
 $(".menu-close").addEventListener("click",closeMenu);$$("a",menu).forEach(a=>a.addEventListener("click",closeMenu));addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu()});
 addEventListener("scroll",()=>nav.classList.toggle("scrolled",scrollY>24),{passive:true});
 $("#year").textContent=new Date().getFullYear();
 const media=$("#showreel-media"),title=$("#active-title"),desc=$("#active-description"),kicker=$("#active-kicker"),counter=$("#showreel-counter"),buttons=$$(".recent-item");
 let activeKey="ai",cycle={wedding:0,prewedding:0},currentVideo=null,muted=true;
 const setMedia=(key,indexAdvance=false)=>{
  const item=data.showreel[key];if(!item)return;
  if(indexAdvance&&item.videos)cycle[key]=(cycle[key]+1)%item.videos.length;
  activeKey=key;const entry=item.videos?item.videos[cycle[key]]:null;
  title.innerHTML=item.title;desc.textContent=entry?entry.title:item.description;kicker.textContent=entry?"NOW PLAYING · "+(key==="wedding"?"WEDDINGS":"PRE-WEDDINGS"):"SELECTED WORK";
  counter.textContent=String(["ai","wedding","prewedding","short"].indexOf(key)+1).padStart(2,"0")+" / 04";
  buttons.forEach(b=>b.classList.toggle("active",b.dataset.showreel===key));
  const next=document.createElement(item.type==="youtube"?"iframe":"video");
  if(item.type==="youtube"){
   next.src="https://www.youtube-nocookie.com/embed/"+entry.id+"?autoplay=1&mute=1&controls=0&loop=1&playlist="+entry.id+"&playsinline=1&rel=0&modestbranding=1";
   next.title=entry.title;next.allow="autoplay; encrypted-media; picture-in-picture";next.setAttribute("allowfullscreen","");
  }else{
   next.src=item.src;next.autoplay=true;next.muted=true;next.loop=true;next.playsInline=true;next.preload="auto";next.controls=false;
   if(key==="ai")next.poster="31.jpg";
   next.addEventListener("canplay",()=>next.play().catch(()=>{}),{once:true});
  }
  next.className="showreel-video";next.setAttribute("aria-hidden","true");
  const old=currentVideo||$("#hero-video");next.style.opacity="0";media.appendChild(next);
  requestAnimationFrame(()=>{next.style.opacity="1";old.style.opacity="0";});
  setTimeout(()=>{if(old!==next&&old.parentNode)old.remove()},reduced?0:850);
  currentVideo=next;const sound=$("#sound-toggle");sound.textContent="SOUND OFF";sound.setAttribute("aria-label","Turn video sound on");muted=true;
 };
 buttons.forEach(b=>b.addEventListener("click",()=>setMedia(b.dataset.showreel,b.dataset.showreel===activeKey)));
 $("#sound-toggle").addEventListener("click",()=>{
  if(!currentVideo)return;
  if(currentVideo.tagName==="VIDEO"){muted=!muted;currentVideo.muted=muted;$("#sound-toggle").textContent=muted?"SOUND OFF":"SOUND ON";}
  else{$("#sound-toggle").textContent="VIDEO MUTED";$("#sound-toggle").setAttribute("aria-label","YouTube preview is muted");}
 });
 const route=$("#route-view"),mainSections=[$("#home"),$("#about"),$("#contact")];
 const imageCard=p=>'<a class="work-card" href="'+esc(p.href)+'"><div class="work-card-media">'+(p.videoSrc?'<video src="'+esc(p.videoSrc)+'" muted autoplay loop playsinline preload="metadata"></video>':p.image?'<img src="'+esc(p.image)+'" alt="'+esc(p.title)+'" loading="lazy">':'<div class="work-card-placeholder"></div>')+'<span class="card-open">VIEW ↗</span></div><div class="work-card-meta"><h3>'+esc(p.title)+'</h3><span>'+(p.count?esc(p.count):"VIEW PROJECT ↗")+'</span></div><p>'+esc(p.description)+'</p></a>';
 const showCategory=id=>{
  const cat=data.categories.find(x=>x.id===id);if(!cat)return false;
  mainSections.forEach(s=>s.hidden=true);route.hidden=false;route.innerHTML='<div class="route-inner"><a class="route-back" href="#home">← BACK TO HOME</a><header class="route-heading"><p class="eyebrow">SELECTED WORK / '+esc(cat.title.toUpperCase())+'</p><h1>'+esc(cat.title)+'.</h1><p>'+esc(cat.description)+'</p></header><div class="work-grid">'+cat.projects.map(imageCard).join("")+'</div></div>';
  scrollTo({top:0,behavior:reduced?"auto":"smooth"});return true;
 };
 const showProject=id=>{
  if(id!=="light-and-shadow")return false;
  mainSections.forEach(s=>s.hidden=true);route.hidden=false;route.innerHTML='<div class="route-inner project-detail"><a class="route-back" href="#work/short-films">← BACK TO SHORT FILMS</a><p class="eyebrow">SHORT FILM</p><h1>Light &amp; Shadow.</h1><div class="detail-video"><video src="short-film.webm" controls autoplay muted playsinline preload="metadata"></video></div></div>';
  scrollTo({top:0,behavior:reduced?"auto":"smooth"});return true;
 };
 const renderRoute=()=>{
  const parts=decodeURIComponent(location.hash.slice(1)).split("/");
  if(parts[0]==="work"&&parts[1]){showCategory(parts[1]);return}
  if(parts[0]==="project"&&parts[1]){showProject(parts[1]);return}
  route.hidden=true;route.innerHTML="";mainSections.forEach(s=>s.hidden=false);
  if(parts[0]==="about"||parts[0]==="contact")setTimeout(()=>$(parts[0]==="about"?"#about":"#contact").scrollIntoView({behavior:reduced?"auto":"smooth"}),0);
  else if(parts[0]==="work")setTimeout(()=>$("#nav").scrollIntoView(),0);
 };
 addEventListener("hashchange",renderRoute);renderRoute();
 const form=$("#enquiry-form");
 if(form)form.addEventListener("submit",async e=>{
  e.preventDefault();if(!form.reportValidity())return;
  const note=$("#form-note"),button=$('[type="submit"]',form);
  if(form.elements._gotcha?.value)return;
  form.classList.remove("is-error","is-success");form.classList.add("is-submitting");button.textContent="SENDING…";note.textContent="Sending your enquiry securely…";
  try{const res=await fetch(form.action,{method:"POST",body:new FormData(form),headers:{Accept:"application/json"}});if(!res.ok)throw Error("Submission failed");form.classList.remove("is-submitting");form.classList.add("is-success");note.textContent="Thank you — your enquiry has been sent.";button.textContent="ENQUIRY SENT ✓";form.reset()}
  catch(err){form.classList.remove("is-submitting");form.classList.add("is-error");note.textContent="Something went wrong. Please try again or email me directly.";button.textContent="TRY AGAIN ↗"}
 });
})();