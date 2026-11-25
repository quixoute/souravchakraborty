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
 const cp=data.copy||{}, n=cp.navigation||{}, h=cp.showreel||{}, i=cp.intro||{}, f=cp.feature||{}, a=cp.about||{}, c=cp.capabilities||{}, ct=cp.contact||{}, ft=cp.footer||{};
 const txt=(s,v)=>{const el=$(s);if(!el||v===undefined)return;const node=[...el.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);if(node)node.textContent=v;else el.textContent=v};
 const html=(s,v)=>{const el=$(s);if(el&&v!==undefined){const safe=String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/&lt;(\/?)(em|br)&gt;/gi,"<$1$2>");el.innerHTML=safe}};
 txt(".nav-work-trigger",n.work);txt('.desktop a[href="#about"]',n.about);txt('.desktop a[href="#contact"]',n.contact);txt(".menu-toggle",n.menu);txt(".menu-close",n.close);
 const navKeys={"#home":"home","#work/commercials":"commercials","#work/weddings":"weddings","#work/pre-wedding":"prewedding","#work/short-films":"shortFilms","#work/photography":"photography","#about":"about","#contact":"contact"};$(".mobile-menu a").forEach(el=>{const k=navKeys[el.getAttribute("href")];if(k&&n[k])el.textContent=n[k]});
 txt(".showreel-top .eyebrow",h.topLabel);txt("#active-kicker",h.activeKicker);txt(".recent-works>.eyebrow",h.recentLabel+" ");txt(".recent-works>.eyebrow i",h.recentHint);
 const labels={ai:h.aiLabel,wedding:h.weddingLabel,prewedding:h.preweddingLabel,short:h.shortLabel};$(".recent-item").forEach(el=>{const b=$("b",el);if(b&&labels[el.dataset.showreel])b.textContent=labels[el.dataset.showreel]});
 html("#active-title",h.aiTitle||data.showreel.ai.title);txt("#active-description",h.aiDescription||data.showreel.ai.description);
 txt(".showreel-scroll",h.scrollLabel);txt("#sound-toggle",h.soundOff);
 txt("#way-of-seeing .eyebrow",i.eyebrow);html("#way-of-seeing h2",i.headline);txt("#way-of-seeing .intro-copy>p:last-child",i.body);
 txt("#feature .eyebrow",f.eyebrow);html("#feature h2",f.headline);txt("#feature .feature-copy>p:not(.eyebrow)",f.body);txt("#feature .text-link",f.link);
 txt("#about .about-copy .eyebrow",a.eyebrow);html("#about .about-copy h2",a.headline);const ap=$("#about .about-copy>p:not(.eyebrow)");if(ap[0])ap[0].textContent=a.body1||"";if(ap[1])ap[1].textContent=a.body2||"";txt("#about .about-copy .text-link",a.link);
 txt(".capabilities>.eyebrow",c.eyebrow);const caps=$(".capabilities>div");[["directionTitle","directionBody"],["editingTitle","editingBody"],["aiTitle","aiBody"],["photographyTitle","photographyBody"]].forEach((keys,j)=>{if(caps[j]){const hh=$("h3",caps[j]),pp=$("p",caps[j]);if(hh)hh.textContent=c[keys[0]]||"";if(pp)pp.textContent=c[keys[1]]||""}});
 txt(".contact-heading .eyebrow",ct.eyebrow);html(".contact-heading h2",ct.headline);txt(".contact-sub",ct.subtitle);txt(".contact-direct a:first-child",ct.emailLabel);txt(".contact-direct a:last-child",ct.whatsappLabel);
 const landingForm=$("#enquiry-form");if(landingForm){const ls=$("label",landingForm);const lvals=[ct.nameLabel,ct.emailFieldLabel,ct.categoryLabel,ct.budgetLabel,ct.detailsLabel,ct.timelineLabel];ls.forEach((el,j)=>{if(lvals[j]&&el.firstChild?.nodeType===Node.TEXT_NODE)el.firstChild.textContent=lvals[j]});const sel=$('select[name="Project category"]',landingForm);if(sel&&ct.categoryPlaceholder)sel.options[0].textContent=ct.categoryPlaceholder;const budget=$('input[name="Budget range"]',landingForm),details=$('textarea[name="Project details"]',landingForm),timeline=$('input[name="Timeline"]',landingForm);if(budget)budget.placeholder=ct.budgetPlaceholder||"";if(details)details.placeholder=ct.detailsPlaceholder||"";if(timeline)timeline.placeholder=ct.timelinePlaceholder||"";txt(".enquiry-form .contact-button",ct.submit);txt("#form-note",ct.note)}
 txt("footer>div:first-child>p",ft.tagline);txt(".footer-links a:first-child",ft.emailLabel);txt(".footer-links a:last-child",ft.instagramLabel);txt("footer small",ft.copyright+" ");
 const media=$("#showreel-media"),title=$("#active-title"),desc=$("#active-description"),kicker=$("#active-kicker"),counter=$("#showreel-counter"),buttons=$$(".recent-item");
 let activeKey="ai",cycle={wedding:0,prewedding:0,short:0},currentVideo=$("#hero-video"),muted=localStorage.getItem("portfolioSound")!=="on",mediaRequest=0;
 const categoryEntries=(key)=>{
  const categoryId=key==="wedding"?"weddings":key==="prewedding"?"pre-wedding":key==="short"?"short-films":null;
  const category=data.categories.find(c=>c.id===categoryId);
  return (category?.projects||[]).filter(p=>p.videoId||p.videoSrc).map(p=>({
   id:p.videoId||null,src:p.videoSrc||null,title:p.title||"Film",type:p.videoId?"youtube":"video"
  }));
 };
 const setMedia=(key)=>{
  const item=data.showreel[key];if(!item)return;
  const entries=key==="ai"?[]:categoryEntries(key);
  // Every video in the selected category is included; clicking the active category advances the playlist.
  if(key===activeKey&&entries.length)cycle[key]=(cycle[key]+1)%entries.length;
  else if(entries.length)cycle[key]=0;
  activeKey=key;
  const entry=entries.length?entries[cycle[key]]:null;
  title.innerHTML=(data.copy?.showreel?.[key+"Title"]||item.title);
  desc.textContent=(data.copy?.showreel?.[key+"Description"]||item.description);
  kicker.textContent="SELECTED WORK";
  counter.textContent=String(["ai","wedding","prewedding","short"].indexOf(key)+1).padStart(2,"0")+" / 04";
  buttons.forEach(b=>{const active=b.dataset.showreel===key;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active))});
  const request=++mediaRequest;
  let next;
  if(entry?.type==="youtube"){
   next=document.createElement("iframe");
   next.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(entry.id)+"?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&enablejsapi=1";
   next.title=entry.title+" — "+(key==="wedding"?"Wedding teaser":key==="prewedding"?"Pre-wedding teaser":"Short film");
   next.allow="autoplay; encrypted-media; picture-in-picture; fullscreen";
   next.referrerPolicy="strict-origin-when-cross-origin";
   next.setAttribute("allowfullscreen","");
   next.loading="eager";
  }else{
   next=document.createElement("video");
   next.src=entry?.src||item.src;next.autoplay=true;next.muted=true;next.loop=true;next.playsInline=true;next.preload="auto";next.controls=false;
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
  const sound=$("#sound-toggle");sound.textContent=muted?"SOUND OFF":"SOUND ON";sound.setAttribute("aria-label",muted?"Turn video sound on":"Turn video sound off");
 };
 // Bind category controls after all page-copy initialization has completed.
 // Explicit listeners avoid relying on inline HTML handlers/global scope.
 buttons.forEach(button=>{
  button.addEventListener("click",()=>setMedia(button.dataset.showreel));
 });
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
  localStorage.setItem("portfolioSound",muted?"off":"on");
  const button=$("#sound-toggle");
  button.textContent=muted?(data.copy?.showreel?.soundOff||"SOUND OFF"):(data.copy?.showreel?.soundOn||"SOUND ON");
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
  return '<a class="category-tile" data-category-tile style="--tile-ratio:'+esc(p.aspectRatio||"16 / 9")+'" href="'+esc(target)+'">'+mediaHtml+'<span class="category-tile-title">'+esc(p.title)+'</span></a>';
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
  const projectIndex=ids.length>1,viewportW=Math.max(320,window.innerWidth),rowCounts=[],rowPattern=[4,3,4,3,5],canvasW=projectIndex?1750:viewportW;
  let remaining=entries.length,patternIndex=0;
  while(remaining>0){const n=Math.min(rowPattern[patternIndex%rowPattern.length],remaining);rowCounts.push(n);remaining-=n;patternIndex++;}
  const totalRows=rowCounts.length,canvasH=projectIndex?1320:Math.max(window.innerHeight-70,80+totalRows*250);
  const items=entries.map((item,i)=>{
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
   let row=0,col=0,rowStart=0;
   if(!projectIndex){
    for(let r=0;r<rowCounts.length;r++){if(i<rowStart+rowCounts[r]){row=r;col=i-rowStart;break;}rowStart+=rowCounts[r];}
   }
   const count=projectIndex?1:rowCounts[row];
   const width=projectIndex?position.width:Math.min(Math.round(150+rand*58),Math.round(viewportW/(count+.7)));
   const gap=projectIndex?0:Math.max(24,Math.round(viewportW*.025));
   const slot=projectIndex?0:(viewportW-gap*(count+1))/count;
   const rowShift=projectIndex?0:((row%2===0)?-0.035:0.045)*viewportW;
   const localJitter=Math.round((rand2-.5)*Math.min(62,slot*.34));
   const left=projectIndex?position.left:Math.max(12,Math.min(viewportW-width-12,Math.round(gap+col*slot+((slot-width)/2)+rowShift+localJitter)));
   const top=projectIndex?position.top:48+row*250+Math.round(rand*74);
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
   ?'<video class="category-feature__video" style="--media-ratio:'+esc(first.aspectRatio||"16 / 9")+';--media-ratio-width:'+esc((first.aspectRatio||"16 / 9").split(" / ")[0])+';--media-ratio-height:'+esc((first.aspectRatio||"16 / 9").split(" / ")[1])+'" src="'+esc(first.videoSrc)+'" autoplay muted loop playsinline></video>'
   :first.videoId
    ?'<iframe class="category-feature__video" style="--media-ratio:'+esc(first.aspectRatio||"16 / 9")+';--media-ratio-width:'+esc((first.aspectRatio||"16 / 9").split(" / ")[0])+';--media-ratio-height:'+esc((first.aspectRatio||"16 / 9").split(" / ")[1])+'" src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(first.videoId)+'?autoplay=1&mute=1&controls=0&loop=1&playlist='+encodeURIComponent(first.videoId)+'&playsinline=1&rel=0&modestbranding=1&enablejsapi=1" title="'+esc(first.title)+'" allow="autoplay; encrypted-media; picture-in-picture" loading="eager"></iframe>'
    :first.image?'<img class="category-feature__video" style="--media-ratio:'+esc(first.aspectRatio||"16 / 9")+'" src="'+esc(first.image)+'" alt="">':'';
  mainSections.forEach(s=>s.hidden=true);route.hidden=false;
  const remaining=cat.projects.slice(1);
  route.innerHTML='<div class="category-showcase-page '+(id==="commercials"?"commercial-showcase-page":"")+'"><section class="category-feature">'+feature+'</section><button class="route-sound-toggle" type="button">SOUND OFF</button><div class="category-project-grid">'+remaining.map((p,i)=>imageCard(p,cat.id,i)).join("")+'</div></div>';
  bindRouteSound();
  initCategoryTilePlayback();
  scrollTo({top:0,behavior:reduced?"auto":"smooth"});return true;
 };
 const bindRouteSound=()=>{const b=$(".route-sound-toggle",route);if(!b)return;b.textContent=muted?"SOUND OFF":"SOUND ON";b.addEventListener("click",()=>{muted=!muted;localStorage.setItem("portfolioSound",muted?"off":"on");b.textContent=muted?"SOUND OFF":"SOUND ON";$("video",route).forEach(v=>{v.muted=muted;if(!muted)v.play().catch(()=>{});});$("iframe",route).forEach(f=>{f.contentWindow?.postMessage(JSON.stringify({event:"command",func:muted?"mute":"unMute",args:[]}),"*");});});};
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
   if(visible&&!frame.src)frame.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(id)+"?autoplay=1&mute=1&controls=0&loop=1&playlist="+encodeURIComponent(id)+"&playsinline=1&rel=0&modestbranding=1&enablejsapi=1";
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