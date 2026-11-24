(() => {
 const data=window.PORTFOLIO;if(!data)return;
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
 const nav=$("#nav"),menu=$("#mobile-menu"),toggle=$(".menu-toggle");
 const workWrap=$(".nav-work"),workTrigger=$(".nav-work-trigger");
 const closeWork=()=>{workWrap?.classList.remove("is-open");workTrigger?.setAttribute("aria-expanded","false")};
 workTrigger?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();const open=!workWrap.classList.contains("is-open");workWrap.classList.toggle("is-open",open);workTrigger.setAttribute("aria-expanded",String(open))});
 document.addEventListener("click",e=>{if(workWrap&&!workWrap.contains(e.target))closeWork()});
 $(".work-dropdown a").forEach(a=>a.addEventListener("click",closeWork));
 const closeMenu=()=>{menu.classList.remove("open");menu.setAttribute("aria-hidden","true");toggle.setAttribute("aria-expanded","false");document.body.style.overflow=""};
 toggle.addEventListener("click",()=>{menu.classList.add("open");menu.setAttribute("aria-hidden","false");toggle.setAttribute("aria-expanded","true");document.body.style.overflow="hidden"});
 $(".menu-close").addEventListener("click",closeMenu);$$("a",menu).forEach(a=>a.addEventListener("click",closeMenu));addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu()});
 addEventListener("scroll",()=>nav.classList.toggle("scrolled",scrollY>24),{passive:true});
 $("#year").textContent=new Date().getFullYear();
 const media=$("#showreel-media"),title=$("#active-title"),desc=$("#active-description"),kicker=$("#active-kicker"),counter=$("#showreel-counter"),buttons=$$(".recent-item");
 let activeKey="ai",cycle={wedding:0,prewedding:0},currentVideo=$("#hero-video"),muted=true,mediaRequest=0;
 const setMedia=(key)=>{
  const item=data.showreel[key];if(!item)return;
  // First selection starts at item zero; each repeat click advances to the next film.
  if(key===activeKey&&item.videos?.length)cycle[key]=(cycle[key]+1)%item.videos.length;
  else if(item.videos?.length)cycle[key]=0;
  activeKey=key;
  const entry=item.videos?item.videos[cycle[key]]:null;
  title.innerHTML=item.title;
  desc.textContent=item.description;
  kicker.textContent="SELECTED WORK";
  counter.textContent=String(["ai","wedding","prewedding","short"].indexOf(key)+1).padStart(2,"0")+" / 04";
  buttons.forEach(b=>{const active=b.dataset.showreel===key;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active))});
  const request=++mediaRequest;
  let next;
  if(item.type==="youtube"){
   next=document.createElement("iframe");
   next.src="https://www.youtube-nocookie.com/embed/"+entry.id+"?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1";
   next.title=entry.title+" — "+(key==="wedding"?"Wedding teaser":"Pre-wedding teaser");
   next.allow="autoplay; encrypted-media; picture-in-picture; fullscreen";
   next.referrerPolicy="strict-origin-when-cross-origin";
   next.setAttribute("allowfullscreen","");
   next.loading="eager";
  }else{
   next=document.createElement("video");
   next.src=item.src;next.autoplay=true;next.muted=true;next.loop=true;next.playsInline=true;next.preload="auto";next.controls=false;
   if(key==="ai")next.poster="31.jpg";
   next.addEventListener("loadeddata",()=>{if(request===mediaRequest)next.play().catch(()=>{})},{once:true});
   next.addEventListener("error",()=>{if(request===mediaRequest)desc.textContent="Video could not be loaded. Please refresh the page."},{once:true});
  }
  next.className="showreel-video";next.setAttribute("aria-hidden","true");next.style.pointerEvents="none";next.style.opacity="0";
  const old=currentVideo;
  media.appendChild(next);
  requestAnimationFrame(()=>{if(request!==mediaRequest)return;next.style.opacity="1";if(old)old.style.opacity="0"});
  setTimeout(()=>{if(request===mediaRequest&&old&&old!==next&&old.parentNode)old.remove()},reduced?0:850);
  currentVideo=next;
  const sound=$("#sound-toggle");sound.textContent="SOUND OFF";sound.setAttribute("aria-label","Turn video sound on");muted=true;
 };
 // Bind every Recent Works row directly to the hero video selector.
 buttons.forEach(button=>{
  button.type="button";
  button.addEventListener("click",event=>{
   event.preventDefault();
   event.stopPropagation();
   setMedia(button.dataset.showreel);
  });
 });
 $("#sound-toggle").addEventListener("click",()=>{
  if(!currentVideo)return;
  if(currentVideo.tagName==="VIDEO"){muted=!muted;currentVideo.muted=muted;$("#sound-toggle").textContent=muted?"SOUND OFF":"SOUND ON";}
  else{$("#sound-toggle").textContent="VIDEO MUTED";$("#sound-toggle").setAttribute("aria-label","YouTube preview is muted");}
 });
 const route=$("#route-view"),mainSections=[$("#home"),$("#way-of-seeing"),$("#feature"),$("#about"),$("#contact")];
 const imageCard=(p,catId)=>{
  const slug=p.title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
  const target=p.videoId?"#film/"+catId+"/"+slug:p.href;
  return '<a class="work-card" href="'+esc(target)+'"><div class="work-card-media">'+(p.videoSrc?'<video src="'+esc(p.videoSrc)+'" muted autoplay loop playsinline preload="metadata"></video>':p.image?'<img src="'+esc(p.image)+'" alt="'+esc(p.title)+'" loading="lazy">':'<div class="work-card-placeholder"></div>')+'<span class="card-open">VIEW ↗</span></div><div class="work-card-meta"><h3>'+esc(p.title)+'</h3><span>'+(p.count?esc(p.count):"VIEW PROJECT ↗")+'</span></div><p>'+esc(p.description)+'</p></a>';
 };
 const showCategory=id=>{
  const cat=data.categories.find(x=>x.id===id);if(!cat)return false;
  mainSections.forEach(s=>s.hidden=true);route.hidden=false;route.innerHTML='<div class="route-inner"><a class="route-back" href="#home">← BACK TO HOME</a><header class="route-heading"><p class="eyebrow">SELECTED WORK / '+esc(cat.title.toUpperCase())+'</p><h1>'+esc(cat.title)+'.</h1><p>'+esc(cat.description)+'</p></header><div class="work-grid">'+cat.projects.map(p=>imageCard(p,cat.id)).join("")+'</div></div>';
  scrollTo({top:0,behavior:reduced?"auto":"smooth"});return true;
 };

 const showFilm=(categoryId,slug)=>{
  const cat=data.categories.find(x=>x.id===categoryId);if(!cat)return false;
  const project=cat.projects.find(p=>p.title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")===slug);
  if(!project||(!project.videoId&&!project.videoSrc))return false;
  mainSections.forEach(s=>s.hidden=true);route.hidden=false;
  const player=project.videoSrc
   ? '<video class="film-detail-player" src="'+esc(project.videoSrc)+'" controls autoplay muted playsinline preload="metadata"></video>'
   : '<iframe class="film-detail-player" src="https://www.youtube-nocookie.com/embed/'+esc(project.videoId)+'?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1" title="'+esc(project.title)+'" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
  route.innerHTML='<div class="route-inner film-detail"><a class="route-back" href="#work/'+esc(categoryId)+'">← BACK TO '+esc(cat.title.toUpperCase())+'</a><header class="route-heading"><p class="eyebrow">'+esc(cat.title.toUpperCase())+' / FILM</p><h1>'+esc(project.title)+'.</h1><p>'+esc(project.description||"")+'</p></header><div class="film-detail-frame">'+player+'</div></div>';
  scrollTo({top:0,behavior:reduced?"auto":"smooth"});return true;
 };
 const showGallery=id=>{
  const map={dreamer:{title:"Dreamer",dir:"Dreamer",prefix:"Dreamer-",ext:"jpg",count:15},untitled:{title:"Untitled",dir:"Untitled",prefix:"",ext:"webp",count:52},ubereats:{title:"Uber Eats",dir:"ubereats",prefix:"",ext:"webp",count:12},tri:{title:"Tri",dir:"Tri",prefix:"",ext:"webp",count:14}};
  const g=map[id];if(!g)return false;
  mainSections.forEach(s=>s.hidden=true);route.hidden=false;
  const cards=Array.from({length:g.count},(_,i)=>{const n=i+1;const src=g.dir+"/"+g.prefix+n+"."+g.ext;return '<figure class="photo-gallery-item"><img src="'+esc(src)+'" alt="'+esc(g.title)+' — photograph '+n+'" loading="lazy"><figcaption>'+String(n).padStart(2,"0")+'</figcaption></figure>'}).join("");
  route.innerHTML='<div class="route-inner photo-gallery"><a class="route-back" href="#work/photography">← BACK TO PHOTOGRAPHY</a><header class="route-heading"><p class="eyebrow">PHOTOGRAPHIC SERIES</p><h1>'+esc(g.title)+'.</h1></header><div class="photo-gallery-grid">'+cards+'</div></div>';
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
  if(parts[0]==="gallery"&&parts[1]){showGallery(parts[1]);return}
  if(parts[0]==="film"&&parts[1]&&parts[2]){showFilm(parts[1],parts[2]);return}
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