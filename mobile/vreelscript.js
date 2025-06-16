// Wrap everything in an IIFE to prevent global scope pollution
(function() {
    // Image loading and management
    if (typeof window.vreelImages === 'undefined') {
        window.vreelImages = {};
    }
    const images = window.vreelImages;
    
    const imagePaths = {
        mumuso: 'mumuso.png',
        spacify: 'spacify.png',
        rimi: 'rimi.png',
        wedding: 'wedding.png',
        turtle: 'turtle.png',
        project1: '45.jpg',
        project2: '47.jpg',
        project3: '46.jpg',
        project4: '41.jpg',
        project5: '39.jpg'
    };

    // Load all images
    function loadImages() {
        console.log('Starting to load images...');
        return Promise.all(
            Object.entries(imagePaths).map(([key, path]) => {
                return new Promise((resolve, reject) => {
                    if (!images[key]) {
                        images[key] = new Image();
                        images[key].onload = () => {
                            console.log(`Loaded image: ${path}`);
                            resolve();
                        };
                        images[key].onerror = (error) => {
                            console.error(`Failed to load image: ${path}`, error);
                            reject(error);
                        };
                        images[key].src = path;
                    } else {
                        resolve();
                    }
                });
            })
        );
    }

    // Canvas setup
    const canvas = document.getElementById('mobileCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    console.log('Canvas element found');

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get canvas context!');
        return;
    }
    console.log('Canvas context obtained');

    // Container positions and states
    const containers = [
        { id: 'container1', image: 'project1', x: 0.35, y: 0.2, width: 153, height: 153, page: 'mumuso.html' },
        { id: 'container2', image: 'project2', x: 0.5, y: 0.15, width: 153, height: 153, page: 'spacify.html' },
        { id: 'container3', image: 'project3', x: 0.50, y: 0.55, width: 153, height: 153, page: 'riminayak.html' },
        { id: 'container4', image: 'project4', x: 0.25, y: 0.55, width: 153, height: 153, page: 'weddingreels.html' },
        { id: 'container5', image: 'project5', x: 0.65, y: 0.35, width: 153, height: 153, page: 'turtle.html' }
    ];

    // Background images
    const backgroundImages = [
        { image: 'mumuso', x: 0.34, y: 0.22, width: 338, height: 198, rotation: 0 },
        { image: 'spacify', x: 0.65, y: 0.25, width: 318, height: 187, rotation: 15 },
        { image: 'rimi', x: 0.60, y: 0.81, width: 232, height: 136, rotation: 0 },
        { image: 'wedding', x: 0.20, y: 0.70, width: 277, height: 163, rotation: 0 },
        { image: 'turtle', x: 0.78, y: 0.55, width: 271, height: 159, rotation: 0 }
    ];

    // Animation state
    let animationFrame = 0;
    let lastTimestamp = 0;
    let hoveredContainer = null;
    let isDragging = false;
    let startX, startY, initialX, initialY;
    let offsetX = 0;
    let offsetY = 0;
    let scale = 1;

    // Draw dotted background
    function drawDottedBackground(ctx, width, height) {
        console.log('Drawing dotted background', width, height);
        const dotSize = 20;
        const dotColor = '#a0a0a0';
        const bgColor = '#e0e0e0';
        
        // Fill background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        
        // Draw dots
        ctx.fillStyle = dotColor;
        for (let x = 0; x < width; x += dotSize) {
            for (let y = 0; y < height; y += dotSize) {
                ctx.beginPath();
                ctx.arc(x + dotSize/2, y + dotSize/2, dotSize * 0.15, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Draw background images
    function drawBackgroundImages(ctx, width, height) {
        backgroundImages.forEach(bg => {
            if (!images[bg.image]) {
                console.error(`Background image not loaded: ${bg.image}`);
                return;
            }
            ctx.save();
            const x = width * bg.x + offsetX;
            const y = height * bg.y + offsetY;
            
            ctx.translate(x, y);
            ctx.rotate(bg.rotation * Math.PI / 180);
            ctx.drawImage(
                images[bg.image],
                -bg.width/2,
                -bg.height/2,
                bg.width,
                bg.height
            );
            ctx.restore();
        });
    }

    // Draw containers
    function drawContainers(ctx, width, height) {
        containers.forEach(container => {
            if (!images[container.image]) {
                console.error(`Container image not loaded: ${container.image}`);
                return;
            }
            const x = width * container.x + offsetX;
            const y = height * container.y + offsetY;
            
            ctx.save();
            
            // Add hover effect
            if (hoveredContainer === container.id) {
                ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
                ctx.shadowBlur = 15;
                ctx.shadowOffsetX = 5;
                ctx.shadowOffsetY = 5;
            }
            
            // Draw image
            ctx.drawImage(
                images[container.image],
                x - container.width/2,
                y - container.height/2,
                container.width,
                container.height
            );
            
            ctx.restore();
        });
    }

    // Animation loop
    function animate(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const elapsed = timestamp - lastTimestamp;
        
        if (elapsed > 100) {
            animationFrame++;
            lastTimestamp = timestamp;
        }
        
        resizeCanvas();
        requestAnimationFrame(animate);
    }

    // Resize canvas
    function resizeCanvas() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Calculate scale based on screen size
        scale = Math.min(width / 1920, height / 1080);
        
        // Set canvas size
        canvas.width = width;
        canvas.height = height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw background
        drawDottedBackground(ctx, width, height);
        
        // Draw background images
        drawBackgroundImages(ctx, width, height);
        
        // Draw containers
        drawContainers(ctx, width, height);
    }

    // Mouse event handlers
    function isPointInContainer(x, y, container, width, height) {
        const containerX = width * container.x + offsetX;
        const containerY = height * container.y + offsetY;
        const halfWidth = container.width / 2;
        const halfHeight = container.height / 2;
        
        return x >= containerX - halfWidth && 
               x <= containerX + halfWidth && 
               y >= containerY - halfHeight && 
               y <= containerY + halfHeight;
    }

    // Touch and mouse event handling
    function handlePointerMove(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        let foundHover = false;
        containers.forEach(container => {
            if (isPointInContainer(x, y, container, canvas.width, canvas.height)) {
                hoveredContainer = container.id;
                foundHover = true;
                canvas.style.cursor = 'pointer';
            }
        });
        
        if (!foundHover) {
            hoveredContainer = null;
            canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
        }
        
        if (isDragging) {
            const dx = x - startX;
            const dy = y - startY;
            offsetX = initialX + dx;
            offsetY = initialY + dy;
            resizeCanvas();
        }
    }

    function handlePointerDown(e) {
        isDragging = true;
        const rect = canvas.getBoundingClientRect();
        startX = (e.clientX || e.touches[0].clientX) - rect.left;
        startY = (e.clientY || e.touches[0].clientY) - rect.top;
        initialX = offsetX;
        initialY = offsetY;
        canvas.style.cursor = 'grabbing';
    }

    function handlePointerUp() {
        isDragging = false;
        canvas.style.cursor = 'grab';
    }

    function handlePointerClick(e) {
        if (isDragging) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        containers.forEach(container => {
            if (isPointInContainer(x, y, container, canvas.width, canvas.height)) {
                window.open(container.page, '_blank');
            }
        });
    }

    // Event listeners
    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('mouseup', handlePointerUp);
    canvas.addEventListener('mouseleave', handlePointerUp);
    canvas.addEventListener('click', handlePointerClick);

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        handlePointerMove(e);
    }, { passive: false });

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handlePointerDown(e);
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        handlePointerUp();
        handlePointerClick(e);
    }, { passive: false });

    canvas.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        handlePointerUp();
    }, { passive: false });

    // Initialize
    console.log('Starting initialization...');
    loadImages().then(() => {
        console.log('All images loaded successfully');
        resizeCanvas();
        requestAnimationFrame(animate);
    }).catch(error => {
        console.error('Error loading images:', error);
    });

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    // Initial resize
    console.log('Performing initial resize...');
    resizeCanvas();
})();