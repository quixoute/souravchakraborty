document.addEventListener("DOMContentLoaded", () => {
    // 1. Set up the SVG Filter for Liquify
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.style.position = "absolute";
    svg.style.pointerEvents = "none";
    
    // Reduced baseFrequency and scale to make the ripple less heavy
    svg.innerHTML = `
        <filter id="liquify-hover" color-interpolation-filters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence id="turb" type="fractalNoise" baseFrequency="0.012" numOctaves="2" result="noise" />
            <feDisplacementMap id="disp" in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
        </filter>
    `;
    document.body.appendChild(svg);

    const turb = document.getElementById("turb");
    
    // 2. Set up the Parallax Skew Elements
    const skewElements = document.querySelectorAll('.gallery-item, .gallery-header h1, .gallery-header p, .page-title, .back-btn, .gallery-item img');

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    // Limits
    const MAX_SKEW_DEG = 8;
    const smoothness = 0.08;

    // Track global mouse position for parallax
    document.addEventListener("mousemove", (e) => {
        // Reduced sensitivity (divided by 120 instead of 40)
        let rawX = (e.clientX - window.innerWidth / 2) / 120; 
        let rawY = -(e.clientY - window.innerHeight / 2) / 120;
        
        // Clamp the values to avoid breaking the layout when mouse gets too far
        mouseX = Math.max(-MAX_SKEW_DEG, Math.min(MAX_SKEW_DEG, rawX));
        mouseY = Math.max(-MAX_SKEW_DEG, Math.min(MAX_SKEW_DEG, rawY));
    });

    // 3. Attach Hover events for Liquify Paintbrush to images and headers
    const liquidTargets = document.querySelectorAll('.gallery-item img, .gallery-header h1, .page-title');
    
    // Store brush trails for active elements
    const activeTrails = new Map();

    liquidTargets.forEach(target => {
        // Create an exact clone to apply the distortion and mask onto
        const clone = target.cloneNode(true);
        
        // Ensure parent can hold the absolute clone
        const wrapper = document.createElement('div');
        const computedStyle = window.getComputedStyle(target);
        wrapper.style.position = 'relative';
        wrapper.style.display = computedStyle.display === 'inline' ? 'inline-block' : computedStyle.display;
        if (target.tagName === 'IMG') {
            wrapper.style.width = '100%';
            wrapper.style.height = '100%';
        }
        
        target.parentNode.insertBefore(wrapper, target);
        wrapper.appendChild(target);
        
        // Style the clone to lay exactly on top
        clone.style.position = 'absolute';
        clone.style.top = '0';
        clone.style.left = '0';
        clone.style.width = '100%';
        clone.style.height = '100%';
        clone.style.pointerEvents = 'none';
        clone.style.filter = "url(#liquify-hover)";
        clone.style.opacity = "0"; // Hidden until painted
        clone.style.transition = "opacity 0.2s ease";
        clone.classList.add('liquid-brush-clone');
        
        // For text elements, make sure styles map over
        if (target.tagName !== 'IMG') {
            clone.style.margin = '0';
            clone.style.padding = computedStyle.padding;
            clone.style.lineHeight = computedStyle.lineHeight;
            clone.style.fontSize = computedStyle.fontSize;
            clone.style.color = computedStyle.color;
        }

        wrapper.appendChild(clone);
        
        let points = [];
        let isHovering = false;

        target.addEventListener('mouseenter', () => {
            isHovering = true;
            clone.style.opacity = "1";
            activeTrails.set(target, { clone, points });
        });
        
        target.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            const rect = target.getBoundingClientRect();
            // Mouse relative to the element
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            points.push({ x, y, life: 1.0 });
            // Keep maximum points for the trail
            if (points.length > 20) points.shift();
        });
        
        target.addEventListener('mouseleave', () => {
            isHovering = false;
            clone.style.opacity = "0";
            // The animation loop will naturally clear the points
        });
    });

    let noiseTime = 0;

    // 4. Global Animation Loop combining parallax and paintbrush trails
    function animate() {
        // A. Skew lerping
        targetX += (mouseX - targetX) * smoothness;
        targetY += (mouseY - targetY) * smoothness;

        skewElements.forEach(el => {
            el.style.transform = \`perspective(1000px) rotateX(\${targetY}deg) rotateY(\${targetX}deg) translateZ(10px)\`;
            if(!el.classList.contains('liquid-brush-clone')) {
                el.style.transformStyle = 'preserve-3d';
            }
        });

        // B. Animate noise baseFrequency dynamically for fluid liquid illusion
        noiseTime += 0.05;
        const freqX = 0.015 + Math.sin(noiseTime) * 0.003;
        const freqY = 0.015 + Math.cos(noiseTime) * 0.003;
        turb.setAttribute("baseFrequency", \`\${freqX} \${freqY}\`);

        // C. Update Paintbrush Trails
        activeTrails.forEach((data, target) => {
            let { clone, points } = data;
            
            if (points.length > 0) {
                // Fade lifetime
                for (let i = 0; i < points.length; i++) {
                    points[i].life -= 0.04;
                }
                points = points.filter(p => p.life > 0);
                data.points = points;
                
                // Construct mask image using radial gradients
                if (points.length > 0) {
                    const gradients = points.map(p => {
                        const radius = 30 + (1 - p.life) * 50; // Expands outward as it fades
                        return \`radial-gradient(circle at \${p.x}px \${p.y}px, rgba(0,0,0,\${p.life * 0.8}) 0%, transparent \${radius}px)\`;
                    }).join(', ');
                    
                    clone.style.webkitMaskImage = gradients;
                    clone.style.maskImage = gradients;
                    clone.style.webkitMaskComposite = "source-over";
                    clone.style.maskComposite = "add";
                } else {
                    clone.style.webkitMaskImage = "none";
                    clone.style.maskImage = "none";
                }
            } else {
                clone.style.webkitMaskImage = "none";
                clone.style.maskImage = "none";
                // If not hovering and trail died, remove from active updates
                if (clone.style.opacity === "0") {
                    activeTrails.delete(target);
                }
            }
        });

        requestAnimationFrame(animate);
    }
    
    animate();
});
