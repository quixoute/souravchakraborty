(() => {
  "use strict";
  const OWNER = "quixoute";
  const REPO = "souravchakraborty";
  const FILE_PATH = "portfolio-data.js";
  const API = "https://api.github.com";
  const $ = (selector) => document.querySelector(selector);
  const loginPanel = $("#login-panel");
  const dashboard = $("#dashboard");
  const loginForm = $("#login-form");
  const tokenInput = $("#github-token");
  const loginStatus = $("#login-status");
  const projectList = $("#project-list");
  const photoList = $("#photo-list");
  const publishButton = $("#publish");
  const publishBottom = $("#publish-bottom");
  const changeState = $("#change-state");
  const dashboardStatus = $("#dashboard-status");
  let token = "";
  let portfolio = null;
  let fileSha = "";
  let dirty = false;
  let dragSource = null;

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[char]);
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const headers = () => ({
    "Accept": "application/vnd.github+json",
    "Authorization": "Bearer " + token,
    "X-GitHub-Api-Version": "2022-11-28"
  });
  const setStatus = (element, message, type = "") => {
    element.textContent = message;
    element.className = (element.id === "add-status" ? "inline-status " : "status ") + type;
  };
  const markDirty = () => {
    dirty = true;
    publishButton.disabled = false;
    publishBottom.disabled = false;
    changeState.textContent = "Unpublished changes";
    changeState.classList.add("dirty");
    $("#bottom-state").textContent = "You have unpublished changes.";
  };
  const markClean = () => {
    dirty = false;
    publishButton.disabled = true;
    publishBottom.disabled = true;
    changeState.textContent = "All changes published";
    changeState.classList.remove("dirty");
    $("#bottom-state").textContent = "Your website is up to date.";
  };
  const videoIdFromUrl = (raw) => {
    let url;
    try { url = new URL(raw.trim()); } catch { return null; }
    if (!["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtube-nocookie.com"].includes(url.hostname)) return null;
    let id = "";
    if (url.hostname === "youtu.be") id = url.pathname.split("/").filter(Boolean)[0] || "";
    else if (url.pathname === "/watch") id = url.searchParams.get("v") || "";
    else {
      const parts = url.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0])) id = parts[1] || "";
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  };
  const thumbnail = (project) => project.videoId
    ? "https://i.ytimg.com/vi/" + encodeURIComponent(project.videoId) + "/hqdefault.jpg"
    : (project.image || "");
  const categoryList = () => (portfolio?.categories || []).filter((category) => category.id !== "photography");

  async function github(path, options = {}) {
    const response = await fetch(API + path, { ...options, headers: { ...headers(), ...(options.headers || {}) } });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || ("GitHub request failed (" + response.status + ")"));
    return payload;
  }

  function decodeBase64Utf8(value) {
    const binary = atob(value.replace(/\s/g, ""));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder("utf-8").decode(bytes);
  }
  function encodeBase64Utf8(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return btoa(binary);
  }
  function loadPortfolioFromSource(source) {
    return new Promise((resolve, reject) => {
      const previous = window.PORTFOLIO;
      const script = document.createElement("script");
      const blobUrl = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
      script.src = blobUrl;
      script.onload = () => {
        const result = window.PORTFOLIO;
        script.remove();
        URL.revokeObjectURL(blobUrl);
        if (previous === undefined) delete window.PORTFOLIO;
        else window.PORTFOLIO = previous;
        if (!result || !Array.isArray(result.categories)) reject(new Error("Could not read portfolio-data.js."));
        else resolve(clone(result));
      };
      script.onerror = () => {
        script.remove();
        URL.revokeObjectURL(blobUrl);
        reject(new Error("Could not load the portfolio data file."));
      };
      document.head.appendChild(script);
    });
  }

  async function connect(suppliedToken) {
    token = suppliedToken.trim();
    if (!token) throw new Error("Paste your GitHub token first.");
    sessionStorage.setItem("portfolio_admin_token", token);
    const user = await github("/user");
    const file = await github("/repos/" + OWNER + "/" + REPO + "/contents/" + FILE_PATH + "?ref=main");
    fileSha = file.sha;
    portfolio = await loadPortfolioFromSource(decodeBase64Utf8(file.content));
    if (!portfolio.categories?.length) throw new Error("No portfolio categories were found.");
    loginPanel.hidden = true;
    dashboard.hidden = false;
    $("#logout").hidden = false;
    populateCategoryControls();
    populatePhotographyControls();
    renderPhotography();
    renderProjects();
    markClean();
    setStatus(dashboardStatus, "Connected as " + (user.login || "GitHub user") + ". Changes publish to the main branch.", "success");
  }

  function populateCategoryControls() {
    const options = categoryList().map((category) => '<option value="' + escapeHtml(category.id) + '">' + escapeHtml(category.title) + '</option>').join("");
    $("#new-category").innerHTML = options;
    $("#filter-category").innerHTML = '<option value="all">All categories</option>' + options;
  }


  const photoSeriesOrder=["tri","dreamer","untitled","ubereats"];
  const photoSeriesList=()=>photoSeriesOrder.filter(id=>portfolio?.photography?.[id]);
  const selectedPhotoSeries=()=>portfolio.photography[$("#photo-series").value];
  function populatePhotographyControls(){$("#photo-series").innerHTML=photoSeriesList().map(id=>'<option value="'+escapeHtml(id)+'">'+escapeHtml(portfolio.photography[id].title)+'</option>').join("");}
  function syncPhotographyProjects(){
    const category=portfolio.categories.find(item=>item.id==="photography");if(!category)return;
    photoSeriesList().forEach(id=>{const series=portfolio.photography[id],project=category.projects.find(item=>(item.href||"").endsWith("/"+id));if(project){project.image=series.images[0]||"";project.count=series.images.length+" photographs";}});
  }
  function renderPhotography(){
    if(!portfolio?.photography)return;const id=$("#photo-series").value||photoSeriesList()[0],series=portfolio.photography[id];if(!series)return;
    const images=series.images||[];
    photoList.innerHTML=images.length?images.map((src,index)=>'<article class="photo-row" data-photo-index="'+index+'"><span class="photo-number">'+String(index+1).padStart(2,"0")+'</span><img class="photo-thumb" src="'+escapeHtml(src)+'" alt="" loading="lazy"><span class="photo-path" title="'+escapeHtml(src)+'">'+escapeHtml(src)+'</span><div class="photo-actions"><button class="icon-button photo-up" type="button" '+(index===0?'disabled':'')+'>↑</button><button class="icon-button photo-down" type="button" '+(index===images.length-1?'disabled':'')+'>↓</button><button class="icon-button delete photo-remove" type="button">×</button></div></article>').join(""):'<div class="empty">No photographs yet. Upload your first image above.</div>';
    photoList.querySelectorAll(".photo-row").forEach(row=>{const i=Number(row.dataset.photoIndex);row.querySelector(".photo-up").addEventListener("click",()=>movePhoto(id,i,i-1));row.querySelector(".photo-down").addEventListener("click",()=>movePhoto(id,i,i+1));row.querySelector(".photo-remove").addEventListener("click",()=>{if(!confirm("Remove this photograph from the gallery? The file stays in the repository."))return;series.images.splice(i,1);markDirty();renderPhotography();});});
    setStatus($("#photo-status"),series.title+" · "+images.length+" photographs. Publish Changes updates the public gallery.");
  }
  function movePhoto(id,from,to){const images=portfolio.photography[id].images;if(to<0||to>=images.length||from===to)return;const [v]=images.splice(from,1);images.splice(to,0,v);markDirty();renderPhotography();}
  function safeImageFilename(name){return name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g,"-").replace(/^-+|-+$/g,"").slice(-90)||"photograph";}
  async function uploadPhotographyFile(file,id){
    if(!["image/jpeg","image/png","image/webp","image/gif","image/avif"].includes(file.type))throw new Error(file.name+": unsupported image format.");
    if(file.size>20*1024*1024)throw new Error(file.name+": image exceeds 20 MB.");
    const series=portfolio.photography[id],ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"")||"jpg";
    const base=safeImageFilename(file.name.replace(/\.[^.]+$/,"")),path=series.directory+"/admin-"+Date.now()+"-"+Math.random().toString(36).slice(2,7)+"-"+base+"."+ext;
    const bytes=new Uint8Array(await file.arrayBuffer());let binary="";for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));
    await github("/repos/"+OWNER+"/"+REPO+"/contents/"+path.split("/").map(encodeURIComponent).join("/"),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:"Add photography image: "+file.name,content:btoa(binary),branch:"main"})});
    series.images.push(path);syncPhotographyProjects();markDirty();
  }
  $("#photo-series").addEventListener("change",renderPhotography);
  $("#photo-files").addEventListener("change",async event=>{const selected=Array.from(event.target.files||[]),id=$("#photo-series").value;if(!selected.length||!id)return;event.target.disabled=true;try{for(let i=0;i<selected.length;i++){setStatus($("#photo-status"),"Uploading "+(i+1)+" of "+selected.length+": "+selected[i].name);await uploadPhotographyFile(selected[i],id);}renderPhotography();setStatus($("#photo-status"),selected.length+" image(s) uploaded to "+portfolio.photography[id].title+". Click Publish Changes to add them to the public gallery.","success");}catch(error){setStatus($("#photo-status"),error.message,"error");renderPhotography();}finally{event.target.disabled=false;event.target.value="";}});
  $("#photo-url-form").addEventListener("submit",event=>{event.preventDefault();const value=$("#photo-url").value.trim();if(!/^https:\/\//i.test(value)){setStatus($("#photo-status"),"Please use a secure https:// image URL.","error");return;}const series=selectedPhotoSeries();if(!series)return;series.images.push(value);$("#photo-url").value="";syncPhotographyProjects();markDirty();renderPhotography();});

  function renderProjects() {
    if (!portfolio) return;
    const search = $("#search").value.trim().toLowerCase();
    const filter = $("#filter-category").value;
    const groups = categoryList().filter((category) => filter === "all" || category.id === filter);
    projectList.innerHTML = groups.map((category) => {
      const projects = category.projects || [];
      const rows = projects.map((project, index) => ({ project, index })).filter(({ project }) =>
        !search || (project.title || "").toLowerCase().includes(search) || (project.videoId || "").toLowerCase().includes(search)
      );
      if (!rows.length) return search ? "" : '<section class="category-group"><div class="category-title"><h3>' + escapeHtml(category.title) + '</h3><span>0 projects</span></div><div class="empty">No projects in this category yet.</div></section>';
      return '<section class="category-group" data-category="' + escapeHtml(category.id) + '"><div class="category-title"><h3>' + escapeHtml(category.title) + '</h3><span>' + projects.length + ' projects · drag to reorder</span></div>' +
        rows.map(({ project, index }) => {
          const image = thumbnail(project);
          const urlValue = project.videoId ? "https://youtu.be/" + project.videoId : "";
          const localNote = project.videoSrc ? '<span class="row-note">Local video: ' + escapeHtml(project.videoSrc) + ' · leave URL blank to keep it</span>' : "";
          return '<article class="project-row" draggable="true" data-category="' + escapeHtml(category.id) + '" data-index="' + index + '">' +
            '<span class="drag-handle" title="Drag to reorder">⠿</span>' +
            (image ? '<img class="thumb" src="' + escapeHtml(image) + '" alt="" loading="lazy">' : '<div class="thumb"></div>') +
            '<input class="edit-title" aria-label="Project title" value="' + escapeHtml(project.title || "") + '" placeholder="Project title">' +
            '<input class="edit-url" aria-label="YouTube URL" value="' + escapeHtml(urlValue) + '" placeholder="YouTube URL (optional)">' +
            '<select class="edit-category" aria-label="Project category">' + categoryList().map((item) => '<option value="' + escapeHtml(item.id) + '"' + (item.id === category.id ? " selected" : "") + '>' + escapeHtml(item.title) + '</option>').join("") + '</select>' +
            '<div class="row-actions"><button class="icon-button move-up" type="button" title="Move up" aria-label="Move up">↑</button><button class="icon-button move-down" type="button" title="Move down" aria-label="Move down">↓</button><button class="icon-button delete" type="button" title="Delete project" aria-label="Delete project">×</button></div>' + localNote + '</article>';
        }).join("") + '</section>';
    }).join("") || '<div class="empty">No matching projects found.</div>';
    bindProjectRows();
  }

  function bindProjectRows() {
    projectList.querySelectorAll(".project-row").forEach((row) => {
      const categoryId = row.dataset.category;
      const index = Number(row.dataset.index);
      const project = findProject(categoryId, index);
      row.querySelector(".edit-title").addEventListener("change", (event) => {
        project.title = event.target.value.trim();
        markDirty();
      });
      row.querySelector(".edit-url").addEventListener("change", (event) => {
        const value = event.target.value.trim();
        if (!value && project.videoSrc) { delete project.videoId; markDirty(); return; }
        const id = videoIdFromUrl(value);
        if (!id) { setStatus(dashboardStatus, "That is not a valid YouTube video URL.", "error"); event.target.value = project.videoId ? "https://youtu.be/" + project.videoId : ""; return; }
        project.videoId = id;
        delete project.videoSrc;
        markDirty();
      });
      row.querySelector(".edit-category").addEventListener("change", (event) => {
        moveProject(categoryId, index, event.target.value);
      });
      row.querySelector(".delete").addEventListener("click", () => {
        if (!confirm('Delete "' + (project.title || "this project") + '" from the portfolio?')) return;
        portfolio.categories.find((category) => category.id === categoryId).projects.splice(index, 1);
        markDirty(); renderProjects();
      });
      row.querySelector(".move-up").addEventListener("click", () => moveWithinCategory(categoryId, index, index - 1));
      row.querySelector(".move-down").addEventListener("click", () => moveWithinCategory(categoryId, index, index + 1));
      row.addEventListener("dragstart", (event) => {
        dragSource = { categoryId, index };
        row.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";
      });
      row.addEventListener("dragend", () => { row.classList.remove("dragging"); projectList.querySelectorAll(".drag-over").forEach((node) => node.classList.remove("drag-over")); });
      row.addEventListener("dragover", (event) => {
        if (!dragSource || dragSource.categoryId !== categoryId) return;
        event.preventDefault(); row.classList.add("drag-over");
      });
      row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
      row.addEventListener("drop", (event) => {
        event.preventDefault(); row.classList.remove("drag-over");
        if (!dragSource || dragSource.categoryId !== categoryId) return;
        moveWithinCategory(categoryId, dragSource.index, index);
        dragSource = null;
      });
    });
  }

  function findProject(categoryId, index) {
    return portfolio.categories.find((category) => category.id === categoryId).projects[index];
  }
  function moveWithinCategory(categoryId, from, to) {
    const category = portfolio.categories.find((item) => item.id === categoryId);
    if (!category || to < 0 || to >= category.projects.length || from === to) return;
    const [project] = category.projects.splice(from, 1);
    category.projects.splice(to, 0, project);
    markDirty(); renderProjects();
  }
  function moveProject(fromCategoryId, index, toCategoryId) {
    if (fromCategoryId === toCategoryId) return;
    const from = portfolio.categories.find((item) => item.id === fromCategoryId);
    const to = portfolio.categories.find((item) => item.id === toCategoryId);
    const [project] = from.projects.splice(index, 1);
    to.projects.unshift(project);
    markDirty(); renderProjects();
  }

  $("#add-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const rawUrl = $("#new-url").value.trim();
    const id = videoIdFromUrl(rawUrl);
    if (!id) { setStatus($("#add-status"), "Please enter a valid YouTube video URL.", "error"); return; }
    const categoryId = $("#new-category").value;
    const category = portfolio.categories.find((item) => item.id === categoryId);
    const project = {
      title: $("#new-title").value.trim(),
      description: categoryId === "weddings" ? "Wedding film." : categoryId === "pre-wedding" ? "Pre-wedding film." : categoryId === "short-films" ? "A short film." : "Video project.",
      videoId: id
    };
    const position = $("#new-position").value;
    if (position === "newest") category.projects.unshift(project);
    else category.projects.push(project);
    markDirty();
    $("#new-url").value = "";
    $("#new-title").value = "";
    $("#new-position").value = "newest";
    $("#filter-category").value = categoryId;
    renderProjects();
    setStatus($("#add-status"), '"' + project.title + '" added to ' + category.title + '. Publish to update your website.', "success");
  });

  async function publish() {
    if (!dirty || !portfolio) return;
    publishButton.disabled = true;
    publishBottom.disabled = true;
    publishButton.textContent = "PUBLISHING…";
    setStatus(dashboardStatus, "Publishing portfolio-data.js to GitHub…");
    try {
      const content = "window.PORTFOLIO = " + JSON.stringify(portfolio, null, 2) + ";\n";
      const result = await github("/repos/" + OWNER + "/" + REPO + "/contents/" + FILE_PATH, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Update portfolio projects from admin dashboard",
          content: encodeBase64Utf8(content),
          sha: fileSha,
          branch: "main"
        })
      });
      fileSha = result.content.sha;
      markClean();
      setStatus(dashboardStatus, "Published successfully. Your website will update after GitHub Pages finishes deploying.", "success");
    } catch (error) {
      publishButton.disabled = false;
      publishBottom.disabled = false;
      setStatus(dashboardStatus, error.message + " Check your token permissions and try again.", "error");
    } finally {
      publishButton.innerHTML = 'PUBLISH CHANGES <span>↗</span>';
    }
  }
  publishButton.addEventListener("click", publish);
  publishBottom.addEventListener("click", publish);
  $("#search").addEventListener("input", renderProjects);
  $("#filter-category").addEventListener("change", renderProjects);
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginStatus.textContent = "Connecting…";
    loginStatus.className = "status";
    try { await connect(tokenInput.value); }
    catch (error) { sessionStorage.removeItem("portfolio_admin_token"); token = ""; setStatus(loginStatus, error.message, "error"); }
  });
  $("#logout").addEventListener("click", () => {
    if (dirty && !confirm("You have unpublished changes. Log out and discard them?")) return;
    sessionStorage.removeItem("portfolio_admin_token");
    token = ""; portfolio = null; fileSha = ""; dirty = false;
    dashboard.hidden = true; loginPanel.hidden = false; $("#logout").hidden = true;
    tokenInput.value = ""; setStatus(loginStatus, "Disconnected.");
  });
  const savedToken = sessionStorage.getItem("portfolio_admin_token");
  if (savedToken) {
    tokenInput.value = savedToken;
    connect(savedToken).catch((error) => {
      sessionStorage.removeItem("portfolio_admin_token");
      token = "";
      setStatus(loginStatus, error.message + " Please reconnect.", "error");
    });
  }
})();