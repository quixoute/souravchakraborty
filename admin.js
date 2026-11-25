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
    renderProjects();
    renderTextEditor();
    markClean();
    setStatus(dashboardStatus, "Connected as " + (user.login || "GitHub user") + ". Changes publish to the main branch.", "success");
  }

  function populateCategoryControls() {
    const options = categoryList().map((category) => '<option value="' + escapeHtml(category.id) + '">' + escapeHtml(category.title) + '</option>').join("");
    $("#new-category").innerHTML = options;
    $("#filter-category").innerHTML = '<option value="all">All categories</option>' + options;
  }


  const textGroups = [
    ["Navigation",["navigation.work","navigation.about","navigation.contact","navigation.menu","navigation.close","navigation.home","navigation.commercials","navigation.weddings","navigation.prewedding","navigation.shortFilms","navigation.photography"]],
    ["Showreel",["showreel.topLabel","showreel.activeKicker","showreel.recentLabel","showreel.recentHint","showreel.aiLabel","showreel.weddingLabel","showreel.preweddingLabel","showreel.shortLabel","showreel.scrollLabel","showreel.soundOff","showreel.soundOn"]],
    ["A way of seeing",["intro.eyebrow","intro.headline","intro.body"]],
    ["Featured section",["feature.eyebrow","feature.headline","feature.body","feature.link"]],
    ["About",["about.eyebrow","about.headline","about.body1","about.body2","about.link"]],
    ["Practice & tools",["capabilities.eyebrow","capabilities.directionTitle","capabilities.directionBody","capabilities.editingTitle","capabilities.editingBody","capabilities.aiTitle","capabilities.aiBody","capabilities.photographyTitle","capabilities.photographyBody"]],
    ["Contact",["contact.eyebrow","contact.headline","contact.subtitle","contact.emailLabel","contact.whatsappLabel","contact.nameLabel","contact.emailFieldLabel","contact.categoryLabel","contact.categoryPlaceholder","contact.budgetLabel","contact.budgetPlaceholder","contact.detailsLabel","contact.detailsPlaceholder","contact.timelineLabel","contact.timelinePlaceholder","contact.submit","contact.note"]],
    ["Footer",["footer.tagline","footer.emailLabel","footer.instagramLabel","footer.copyright"]]
  ];
  function getCopy(path){return path.split(".").reduce((obj,key)=>obj&&obj[key],portfolio.copy||{})??"";}
  function setCopy(path,value){const parts=path.split(".");let obj=portfolio.copy;for(let i=0;i<parts.length-1;i++){if(!obj[parts[i]])obj[parts[i]]={};obj=obj[parts[i]];}obj[parts[parts.length-1]]=value;}
  function renderTextEditor(){
    const root=$("#text-editor");if(!root)return;
    root.innerHTML=textGroups.map((group,idx)=>'<section class="text-group"><div class="text-group-heading"><h3>'+escapeHtml(group[0])+'</h3><span>'+String(idx+1).padStart(2,"0")+'</span></div><div class="text-fields">'+group[1].map(path=>{const value=String(getCopy(path));const multiline=value.length>85||/headline|body|description|Placeholder|note/i.test(path);const label=path.split(".").slice(1).join(" ").replace(/([A-Z])/g," $1");return '<label class="text-field"><span>'+escapeHtml(label)+'</span>'+(multiline?'<textarea data-copy-path="'+escapeHtml(path)+'" rows="2">'+escapeHtml(value)+'</textarea>':'<input data-copy-path="'+escapeHtml(path)+'" value="'+escapeHtml(value)+'">')+'</label>';}).join("")+'</div></section>').join("");
    root.querySelectorAll("[data-copy-path]").forEach(el=>el.addEventListener("change",()=>{setCopy(el.dataset.copyPath,el.value);markDirty();}));
  }

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