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
 $$(".work-dropdown a").forEach(a=>a.addEventListener("click",closeWork));
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
 // Expose the selector for the explicit onclick attributes in index.html.
 window.selectShowreel=setMedia;
 $("#sound-toggle").addEventListener("click",()=>{
  if(!currentVideo)return;
  muted=!muted;
  if(currentVideo.tagName==="VIDEO"){
   currentVideo.muted=muted;
   if(!muted){const playPromise=currentVideo.play();if(playPromise&&playPromise.catch)playPromise.catch(()=>{});}
  }else if(currentVideo.tagName==="IFRAME"){
   // YouTube embeds start muted; use the IFrame API postMessage command on this user gesture.
   currentVideo.contentWindow?.postMessage(JSON.stringify({event:"command",func:muted?"mute":"unMute",args:[]}),"*");
   currentVideo.contentWindow?.postMessage(JSON.stringify({event:"command",func:"setVolume",args:[100]}),"*");
  }
  const button=$("#sound-toggle");
  button.textContent=muted?"SOUND OFF":"SOUND ON";
  button.setAttribute("aria-label",muted?"Turn video sound on":"Turn video sound off");
 });
 const route=$("#route-view"),mainSections=[$("#home"),$("#way-of-seeing"),$("#feature"),$("#about"),$("#contact")];
 const imageCard=(p,catId,index)=>{
  const slug=p.title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
  const target=p.href||(p.videoId?"#film/"+catId+"/"+slug:"#work/"+catId);
  let mediaHtml;
  if(p.videoSrc){
   mediaHtml='<video class="category-tile-media" data-src="'+esc(p.videoSrc)+'" muted loop playsinline preload="none"></video>';
  }else if(p.videoId){
   mediaHtml='<iframe class="category-tile-media" data-video-id="'+esc(p.videoId)+'" title="'+esc(p.title)+'" allow="autoplay; encrypted-media; picture-in-picture" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
  }else{
   mediaHtml='<img class="category-tile-media" src="'+esc(p.image||"")+'" alt="" loading="lazy">';
  }
  return '<a class="category-tile" data-category-tile href="'+esc(target)+'">'+mediaHtml+'<span class="category-tile-title">'+esc(p.title)+'</span></a>';
 };
 const photoSeries={
  tri:{title:"Tri",description:"A photographic series.",directory:"Tri",prefix:"",extension:"webp",count:14},
  dreamer:{title:"Dreamer",description:"A photographic series.",directory:"Dreamer",prefix:"Dreamer-",extension:"jpg",count:15},
  untitled:{title:"Untitled",description:"A photographic collection.",directory:"Untitled",prefix:"",extension:"webp",count:52},
  ubereats:{title:"Uber Eats",description:"A visual project.",directory:"ubereats",prefix:"",extension:"webp",count:12}
 };
 const photoSrc=(series,index)=>series.directory+"/"+series.prefix+(index+1)+"."+series.extension;
 const showPhotographyIndex=()=>{
  const sections=Object.entries(photoSeries).map(([id,series],seriesIndex)=>{
   const previewCount=Math.min(series.count,4);
   const previews=Array.from({length:previewCount},(_,i)=>'<a class="photo-index-item" href="#gallery/'+id+'" aria-label="Open '+esc(series.title)+' photo series"><img src="'+esc(photoSrc(series,i))+'" alt="'+esc(series.title)+' — photograph '+(i+1)+'" loading="lazy"><span class="photo-index-number">'+String(i+1).padStart(2,"0")+'</span></a>').join("");
   return '<section class="photo-series" id="photo-series-'+id+'"><header class="photo-series-heading"><div><p class="photo-overline">SERIES '+String(seriesIndex+1).padStart(2,"0")+'</p><h2>'+esc(series.title)+'</h2><p>'+esc(series.description)+'</p></div><a class="photo-series-link" href="#gallery/'+id+'">VIEW SERIES <span>↗</span></a></header><div class="photo-index-grid">'+previews+'</div></section>';
  }).join("");
  mainSections.forEach(s=>s.hidden=true);route.hidden=false;route.classList.add("photography-route");
  route.innerHTML='<div class="photo-gallery-site"><header class="photo-site-header"><a href="#home" class="photo-site-mark">SC.</a><span class="photo-site-current">PHOTOGRAPHY</span><nav><a href="#work/photography">GALLERY</a><a href="#about">ABOUT</a><a href="#contact">CONTACT</a></nav></header><div class="photo-site-intro"><p class="photo-overline">PERSONAL WORK / INDIA</p><h1>Photography<span>.</span></h1><p>Selected photographic series and visual studies.</p></div><main class="photo-series-list">'+sections+'</main><footer class="photo-site-footer"><span>SOURAV CHAKRABORTY</span><span>PHOTOGRAPHY / INDIA</span></footer></div>';
  scrollTo({top:0,behavior:reduced?"auto":"smooth"});return true;
 };
 const showCategory=id=>{
  if(id==="photography")return showPhotographyIndex();
  route.classList.remove("photography-route");
  const cat=data.categories.find(x=>x.id===id);if(!cat)return false;
  const first=cat.projects[0]||{};
  const feature=first.videoSrc
   ?'<video class="category-feature__video" src="'+esc(first.videoSrc)+'" autoplay muted loop playsinline></video>'
   :first.videoId
    ?'<iframe class="category-feature__video" src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(first.videoId)+'?autoplay=1&mute=1&controls=0&loop=1&playlist='+encodeURIComponent(first.videoId)+'&playsinline=1&rel=0&modestbranding=1" title="'+esc(first.title)+'" allow="autoplay; encrypted-media; picture-in-picture" loading="eager"></iframe>'
    :first.image?'<img class="category-feature__video" src="'+esc(first.image)+'" alt="">':'';
  mainSections.forEach(s=>s.hidden=true);route.hidden=false;
  const remaining=cat.projects.slice(1);
  route.innerHTML='<div class="category-showcase-page"><section class="category-feature">'+feature+'</section><div class="category-project-grid">'+remaining.map((p,i)=>imageCard(p,cat.id,i)).join("")+'</div></div>';
  initCategoryTilePlayback();
  scrollTo({top:0,behavior:reduced?"auto":"smooth"});return true;
 };
 const initCategoryTilePlayback=()=>{
  const tiles=$$("[data-category-tile]");
  if(!("IntersectionObserver" in window)){
   tiles.forEach(tile=>loadCategoryTile(tile,true));return;
  }
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>loadCategoryTile(entry.target,entry.isIntersecting&&entry.intersectionRatio>.12));
  },{rootMargin:"180px 0px",threshold:[0,.12,.5]});
  tiles.forEach(tile=>observer.observe(tile));
 };
 const loadCategoryTile=(tile,visible)=>{
  const frame=$("iframe[data-video-id]",tile);
  const video=$("video[data-src]",tile);
  if(frame){
   const id=frame.dataset.videoId;
   if(visible&&!frame.src)frame.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(id)+"?autoplay=1&mute=1&controls=0&loop=1&playlist="+encodeURIComponent(id)+"&playsinline=1&rel=0&modestbranding=1";
   else if(!visible&&frame.src){frame.src="about:blank";frame.removeAttribute("src");}
  }
  if(video){
   if(visible&&!video.src){video.src=video.dataset.src;video.load();video.play().catch(()=>{});}
   else if(!visible&&video.src){video.pause();video.removeAttribute("src");video.load();}
  }
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
  const g=photoSeries[id];if(!g)return false;
  mainSections.forEach(s=>s.hidden=true);route.hidden=false;route.classList.add("photography-route");
  const cards=Array.from({length:g.count},(_,i)=>'<figure class="photo-artwork"><img src="'+esc(photoSrc(g,i))+'" alt="'+esc(g.title)+' — photograph '+(i+1)+'" loading="lazy"><figcaption><span>'+String(i+1).padStart(2,"0")+'</span><span>'+esc(g.title)+'</span></figcaption></figure>').join("");
  route.innerHTML='<div class="photo-gallery-site"><header class="photo-site-header"><a href="#home" class="photo-site-mark">SC.</a><span class="photo-site-current">PHOTOGRAPHY</span><nav><a href="#work/photography">GALLERY</a><a href="#about">ABOUT</a><a href="#contact">CONTACT</a></nav></header><main class="photo-series-detail"><a class="photo-back-link" href="#work/photography">← ALL PHOTOGRAPHY</a><header class="photo-detail-heading"><p class="photo-overline">PHOTOGRAPHIC SERIES</p><h1>'+esc(g.title)+'<span>.</span></h1><p>'+esc(g.description)+'</p><span class="photo-count">'+String(g.count).padStart(2,"0")+' PHOTOGRAPHS</span></header><div class="photo-artwork-grid">'+cards+'</div></main><footer class="photo-site-footer"><span>SOURAV CHAKRABORTY</span><span>PHOTOGRAPHY / INDIA</span></footer></div>';
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