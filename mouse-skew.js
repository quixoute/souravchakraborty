document.addEventListener("DOMContentLoaded", () => {
    // 1. Set up the SVG Filter for Liquify
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.style.position = "absolute";
    svg.style.pointerEvents = "none";
    
    // We use feTurbulence and feDisplacementMap for that liquid warp effect
    svg.innerHTML = `
        <filter id="liquify-hover" color-interpolation-filters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence id="turb" type="fractalNoise" baseFrequency="0.012" numOctaves="2" result="noise" />
            <feDisplacementMap id="disp" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
    `;
    document.body.appendChild(svg);

    const turb = document.getElementById("turb");
    const disp = document.getElementById("disp");

    let currentDispScale = 0;
    let targetDispScale = 0;
    let noiseTime = 0;

    // 2. Set up the Parallax Skew Elements
    const skewElements = document.querySelectorAll('.gallery-item, .gallery-header h1, .gallery-header p, .page-title, .back-btn, .gallery-item img');

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let isHovering = false;
    
    const smoothness = 0.08;

    document.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / 40; 
        mouseY = -(e.clientY - window.innerHeight / 2) / 40;
    });

    // 3. Attach Hover events for Liquify to images and headers
    const liquidTargets = document.querySelectorAll('.gallery-item img, .gallery-header h1, .page-title');
    liquidTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            target.style.filter = "url(#liquify-hover)";
            targetDispScale = 45; // Max distortion scale
            isHovering = true;
        });
        
        target.addEventListener('mousemove', (e) => {
            // Reinvigorate the effect on move
            targetDispScale = 45; 
        });
        
        target.addEventListener('mouseleave', () => {
            targetDispScale = 0;
            isHovering = false;
            // Clean up the filter after animation finishes to prevent artifacts
            setTimeout(() => {
                if (!isHovering && currentDispScale < 1) {
                    target.style.filter = "none";
                }
            }, 600);
        });
    });

    // 4. Global Animation Loop combining both effects
    function animate() {
        // A. Skew lerping
        targetX += (mouseX - targetX) * smoothness;
        targetY += (mouseY - targetY) * smoothness;

        skewElements.forEach(el => {
            el.style.transform = `perspective(1000px) rotateX(${targetY}deg) rotateY(${targetX}deg) translateZ(10px)`;
            el.style.transformStyle = 'preserve-3d';
        });

        // B. Liquify lerping
        currentDispScale += (targetDispScale - currentDispScale) * 0.1;
        
        if (currentDispScale > 0.5) {
            disp.setAttribute("scale", currentDispScale);
            
            // Animate noise baseFrequency dynamically to create flowing liquid illusion
            noiseTime += 0.05;
            const freqX = 0.012 + Math.sin(noiseTime) * 0.003;
            const freqY = 0.012 + Math.cos(noiseTime) * 0.003;
            turb.setAttribute("baseFrequency", `${freqX} ${freqY}`);
        } else {
            disp.setAttribute("scale", "0");
        }

        requestAnimationFrame(animate);
    }
    
    animate();
});
