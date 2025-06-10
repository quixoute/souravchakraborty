const mainContainer = document.querySelector(".window");
const containers = document.querySelectorAll(".project-container");

console.log("Number of containers found:", containers.length);

let isDragging = false;
let startX, startY, initialX, initialY;

function setInitialPositions() {
  let t = window.innerWidth;
  let e = window.innerHeight;
  console.log("Setting positions...");
  let n = [
    { top: 0.1 * e, left: 0.2 * t },
    { top: 0.1 * e, left: 0.6 * t },
    { top: 0.65 * e, left: 0.65 * t },
    { top: 0.65 * e, left: 0.15 * t },
    { top: 0.35 * e, left: 0.8 * t },
    { top: 0.35 * e, left: 0.1 * t },
    { top: 0.7 * e, left: 0.8 * t },
    { top: 0.05 * e, left: 0.4 * t },
    { top: 0.45 * e, left: 0.75 * t },
    { top: 0.45 * e, left: 0.2 * t },
  ];

  containers.forEach((t, e) => {
    if (t) {
      t.style.setProperty("position", "fixed", "important");
      t.style.setProperty("left", n[e].left + "px", "important");
      t.style.setProperty("top", n[e].top + "px", "important");
      t.style.setProperty("z-index", "6", "important");
      t.style.setProperty("visibility", "visible", "important");
      t.style.transform = "none";
    }
  });
}

function randomSmallMovement(t) {
  containers.forEach((e) => {
    if (e !== t) {
      let n = (Math.random() - 0.5) * 15;
      let i = (Math.random() - 0.5) * 15;
      if ("container11" === e.id) {
        parseInt(e.style.top);
        parseInt(e.style.left);
        e.style.transform = `translate(${n}px, ${i}px)`;
        let o = e.getBoundingClientRect();
        let a = Array.from(containers).some((t, n) => {
          if (t !== e && 10 !== n) {
            let i = t.getBoundingClientRect();
            return !(o.right < i.left || o.left > i.right || o.bottom < i.top || o.top > i.bottom);
          }
          return false;
        });
        if (a) {
          e.style.transform = "none";
        }
      } else {
        e.style.transform = `translate(${n}px, ${i}px)`;
      }
    }
  });
}

function startDrag(t) {
  isDragging = true;
  let e = t.type.includes("touch");
  startX = e ? t.touches[0].clientX : t.clientX;
  startY = e ? t.touches[0].clientY : t.clientY;
  initialX = mainContainer.offsetLeft;
  initialY = mainContainer.offsetTop;
  if (e) t.preventDefault();
}

function drag(t) {
  if (!isDragging) return;
  let e = t.type.includes("touch");
  let n = e ? t.touches[0].clientX : t.clientX;
  let i = e ? t.touches[0].clientY : t.clientY;
  let o = n - startX;
  let a = i - startY;
  mainContainer.style.left = `${initialX + o}px`;
  mainContainer.style.top = `${initialY + a}px`;
  adjustFloatingContainers();
}

function stopDrag() {
  isDragging = false;
}

function adjustFloatingContainers() {
  let t = mainWindow.getBoundingClientRect();
  containers.forEach((e) => {
    let n = e.getBoundingClientRect();
    if (isOverlapping(t, n)) {
      let i = t.left + t.width / 2;
      let o = t.top + t.height / 2;
      let a = n.left + n.width / 2;
      let r = n.top + n.height / 2;
      e.style.transform = `translate(${a < i ? -150 : 150}px, ${r < o ? -150 : 150}px)`;
    }
  });
}

function isOverlapping(t, e) {
  return !(t.right < e.left || t.left > e.right || t.bottom < e.top || t.top > e.bottom);
}

function preloadImages() {
  ["38.jpg"].forEach((t) => {
    let e = new Image();
    e.src = t;
  });
}

window.addEventListener("load", () => {
  setTimeout(setInitialPositions, 100);
});
window.addEventListener("resize", setInitialPositions);

containers.forEach((t, e) => {
  t.addEventListener("mouseenter", () => randomSmallMovement(t));
  t.addEventListener("mouseleave", () => {
    containers.forEach((t) => (t.style.transform = "translate(0, 0)"));
  });
  t.addEventListener("click", (t) => {
    if (!t.target.closest("a")) {
      t.preventDefault();
      window.open(`project${e + 1}.html`, "_blank");
    }
  });
});

mainContainer.addEventListener("mousedown", startDrag);
mainContainer.addEventListener("mousemove", drag);
mainContainer.addEventListener("mouseup", stopDrag);
mainContainer.addEventListener("mouseleave", stopDrag);
mainContainer.addEventListener("touchstart", startDrag, { passive: false });
mainContainer.addEventListener("touchmove", drag, { passive: false });
mainContainer.addEventListener("touchend", stopDrag);
mainContainer.addEventListener("touchcancel", stopDrag);

document.addEventListener("DOMContentLoaded", preloadImages);