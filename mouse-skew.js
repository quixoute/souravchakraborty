document.addEventListener("DOMContentLoaded", () => {
    // 1. Set up the Parallax Skew Elements (No Liquid Ripple anymore)
    const skewElements = document.querySelectorAll('.gallery-item, .gallery-header h1, .gallery-header p, .page-title, .back-btn, .gallery-item img');

    let mouseX = 0;
    let targetX = 0;
    
    // Hard Limiter for how much it can skew left and right (degrees)
    const MAX_SKEW_DEG = 5; 
    const smoothness = 0.08;

    // Track global mouse position for parallax (Only X axis for left/right subtlety)
    document.addEventListener("mousemove", (e) => {
        // Significantly reduced sensitivity
        let rawX = (e.clientX - window.innerWidth / 2) / 100; 
        
        // Hard limiter to avoid breaking the layout
        mouseX = Math.max(-MAX_SKEW_DEG, Math.min(MAX_SKEW_DEG, rawX));
    });

    // 2. Global Animation Loop for subtle left/right perspective skew only
    function animate() {
        // Skew lerping (only horizontal)
        targetX += (mouseX - targetX) * smoothness;

        skewElements.forEach(el => {
            // Only skewing left and right (rotateY)
            el.style.transform = `perspective(1200px) rotateY(${targetX}deg) translateZ(10px)`;
            el.style.transformStyle = 'preserve-3d';
        });

        requestAnimationFrame(animate);
    }
    
    animate();
});
