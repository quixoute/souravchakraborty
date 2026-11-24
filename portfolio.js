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
 const photoEntries=(ids)=>{
  const entries=[];
  ids.forEach(id=>{
   const g=photoSeries[id];
   if(ids.length>1){
    entries.push({id,series:g,index:0,src:photoSrc(g,0),number:1,isProject:true});
   }else{
    for(let i=0;i<g.count;i++)entries.push({id,series:g,index:i,src:photoSrc(g,i),number:i+1,isProject:false});
   }
  });
  return entries;
 };
 const renderFloatingCanvas=(ids,heading)=>{
  const entries=photoEntries(ids);
  const projectIndex=ids.length>1,cols=projectIndex?2:11,cellW=projectIndex?700:274,cellH=projectIndex?600:242,canvasW=projectIndex?1750:cols*cellW+220,canvasH=projectIndex?1320:Math.ceil(entries.length/cols)*cellH+260;
  const items=entries.map((item,i)=>{
   const col=i%cols,row=Math.floor(i/cols);
   const seed=(i*9301+49297)%233280,rand=seed/233280;
   const seed2=(i*7919+12345)%2147483647,rand2=(seed2%10000)/10000;
   const projectIndex=ids.length>1;
   const projectPositions=[
    {left:130,top:130,width:300},
    {left:1120,top:180,width:330},
    {left:430,top:760,width:320},
    {left:1280,top:790,width:310}
   ];
   const position=projectIndex?projectPositions[i]:null;
   const width=projectIndex?position.width:Math.round(132+rand*104);
   const left=projectIndex?position.left:90+col*cellW+Math.round(rand2*52);
   const top=projectIndex?position.top:70+row*cellH+Math.round(((i*37)%83));
   const caption=projectIndex?esc(item.series.title)+' <small>'+String(item.series.count).padStart(2,"0")+' PHOTOGRAPHS</small>':String(item.number).padStart(2,"0")+' / '+esc(item.series.title);
   return projectIndex
    ?'<a class="floating-photo floating-project" href="#gallery/'+item.id+'" aria-label="Open '+esc(item.series.title)+' project" style="left:'+left+'px;top:'+top+'px;width:'+width+'px"><img src="'+esc(item.src)+'" alt="'+esc(item.series.title)+' project cover" loading="lazy"><span class="floating-photo-caption">'+caption+'</span></a>'
    :'<button class="floating-photo" type="button" data-photo-src="'+esc(item.src)+'" data-photo-title="'+esc(item.series.title)+'" data-photo-index="'+item.index+'" aria-label="View '+esc(item.series.title)+' photograph '+item.number+'" style="left:'+left+'px;top:'+top+'px;width:'+width+'px"><img src="'+esc(item.src)+'" alt="'+esc(item.series.title)+' — photograph '+item.number+'" loading="lazy"><span class="floating-photo-caption">'+caption+'</span></button>';
  }).join("");
  const labels='';
  return '<div class="floating-gallery-shell"><div class="floating-gallery-top"><a href="#home" class="floating-gallery-mark">SC.</a><nav><a href="#work/photography">GALLERY</a><a href="#about">ABOUT</a><a href="#contact">CONTACT</a></nav></div><div class="floating-gallery-heading">'+heading+'</div><div class="floating-gallery-canvas" style="width:'+canvasW+'px;height:'+canvasH+'px">'+items+labels+'</div><div class="floating-gallery-hint">DRAG TO EXPLORE</div><div class="photo-lightbox" hidden><button type="button" class="photo-lightbox-close" aria-label="Close image">×</button><button type="button" class="photo-lightbox-prev" aria-label="Previous image">‹</button><img class="photo-lightbox-image" alt=""><button type="button" class="photo-lightbox-next" aria-label="Next image">›</button><div class="photo-lightbox-caption"></div></div></div>';
 };
 const bindFloatingGallery=()=>{
  const shell=$(".floating-gallery-shell",route);if(!shell)return;
  const canvas=$(".floating-gallery-canvas",shell),lightbox=$(".photo-lightbox",shell),image=$(".photo-lightbox-image",shell),caption=$(".photo-lightbox-caption",shell);
  const photos=$$("[data-photo-src]",canvas);let current=0;
  const open=i=>{current=(i+photos.length)%photos.length;const p=photos[current];image.src=p.dataset.photoSrc;caption.textContent=(p.dataset.photoTitle||"Photography")+" · "+String(Number(p.dataset.photoIndex)+1).padStart(2,"0");lightbox.hidden=false};
  const close=()=>{lightbox.hidden=true;image.removeAttribute("src")};
  photos.forEach((p,i)=>p.addEventListener("click",()=>open(i)));
  $(".photo-lightbox-close",shell).addEventListener("click",close);
  $(".photo-lightbox-prev",shell).addEventListener("click",()=>open(current-1));
  $(".photo-lightbox-next",shell).addEventListener("click",()=>open(current+1));
  lightbox.addEventListener("click",e=>{if(e.target===lightbox)close()});
  document.addEventListener("keydown",e=>{if(lightbox.hidden)return;if(e.key==="Escape")close();if(e.key==="ArrowLeft")open(current-1);if(e.key==="ArrowRight")open(current+1)});
  let down=false,startX=0,startY=0,left=0,top=0;
  shell.addEventListener("pointerdown",e=>{if(e.target.closest("button,a"))return;down=true;startX=e.clientX;startY=e.clientY;left=shell.scrollLeft;top=shell.scrollTop;shell.classList.add("is-dragging")});
  shell.addEventListener("pointermove",e=>{if(!down)return;shell.scrollLeft=left-(e.clientX-startX);shell.scrollTop=top-(e.clientY-startY)});
  ["pointerup","pointercancel","pointerleave"].forEach(type=>shell.addEventListener(type,()=>{down=false;shell.classList.remove("is-dragging")}));
 };
 const showPhotographyIndex=()=>{
  mainSections.forEach(s=>s.hidden=true);route.hidden=false;route.classList.add("photography-route");
  route.innerHTML=renderFloatingCanvas(Object.keys(photoSeries),'<span>PHOTOGRAPHY / SELECTED WORK</span>');
  bindFloatingGallery();scrollTo({top:0,behavior:reduced?"auto":"smooth"});return true;
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
  const series=photoSeries[id];if(!series)return false;
  mainSections.forEach(s=>s.hidden=true);route.hidden=false;route.classList.add("photography-route");
  route.innerHTML=renderFloatingCanvas([id],'<a href="#work/photography">← ALL PHOTOGRAPHY</a><span>'+esc(series.title)+'</span>');
  bindFloatingGallery();scrollTo({top:0,behavior:reduced?"auto":"smooth"});return true;
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