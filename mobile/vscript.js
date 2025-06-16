// Image loading and management
const images = {};
const imagePaths = {
    wedding1: 'wedding1.png',
    prewedding: 'prewedding.png',
    reels: 'reels.png',
    image4: '1.4.png',
    project1: '26.jpg',
    project2: '30.jpg',
    project3: '38.jpg',
    project4: '40.jpg',
    project5: '37.jpg',
    project6: '44.jpg',
    project7: '39.jpg',
    project9: '31.jpg',
    project10: '28.jpg',
    thumbnail: 'IMG_6799.png',
    intro: 'intro.png'
};

// Load all images
function loadImages() {
    return Promise.all(
        Object.entries(imagePaths).map(([key, path]) => {
            return new Promise((resolve, reject) => {
                images[key] = new Image();
                images[key].onload = () => resolve();
                images[key].onerror = reject;
                images[key].src = path;
            });
        })
    );
}

// Draw coordinate grid for positioning help
function drawGrid(ctx, width, height) {
    // Empty function - grid removed
}

// Animation state
let animationFrame = 0;
let lastTimestamp = 0;

// Draw dotted background with animation
function drawDottedBackground(ctx, width, height) {
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate offset based on animation frame with reduced movement
    const offsetX = (animationFrame % 40) * 1; // Slower movement
    const offsetY = (animationFrame % 40) * 1; // Slower movement
    
    ctx.fillStyle = '#a0a0a0';
    for (let x = -offsetX; x < width + 20; x += 20) {
        for (let y = -offsetY; y < height + 20; y += 20) {
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Animation loop
function animate(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const elapsed = timestamp - lastTimestamp;
    
    // Update animation frame every 100ms for slower movement
    if (elapsed > 100) {
        animationFrame++;
        lastTimestamp = timestamp;
    }
    
    // Redraw both canvases
    resizeCanvas();
    
    // Request next frame
    requestAnimationFrame(animate);
}

// Draw first canvas content
function drawFirstCanvas(ctx, width, height) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    drawDottedBackground(ctx, width, height);

    // Draw image4
    ctx.save();
    ctx.translate(width * 0.49, height * 0.45);
    ctx.rotate(-15 * Math.PI / 180);
    ctx.drawImage(images.image4, -200, -395, 450, 550);
    ctx.restore();

    // Draw intro
    ctx.save();
    ctx.translate(width * 0.42, height * 0.45);
    ctx.rotate(-4 * Math.PI / 180);
    ctx.drawImage(images.intro, -185, -215, 425, 250);
    ctx.restore();

    // Draw project9
    ctx.save();
    ctx.translate(width * 0.75, height * 0.45);
    
    // Add shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    
    ctx.drawImage(images.project9, -275, -310, 150, 140);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.restore();

    // Draw thumbnail
    ctx.save();
    ctx.translate(width * 0.42, height * 0.45);
    ctx.rotate(-2 * Math.PI / 180);
    ctx.drawImage(images.thumbnail, -220, -150, 600, 700);
    ctx.restore();
}

// Draw second canvas content
function drawSecondCanvas(ctx, width, height) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    drawDottedBackground(ctx, width, height);

    // Draw wedding1
    ctx.save();
    ctx.translate(width * 0.2, height * 0.84);
    ctx.drawImage(images.wedding1, -131, -351, 322, 194);
    ctx.restore();

    
    
    const projectPositions = [
        { x: 0.65, y: 0.48, width: 169, height: 169, id: 'container4', page: 'wedding.html', image: images.project4 },
        { x: 0.35, y: 0.25, width: 160, height: 155, id: 'container6', page: 'Prewedding.html', image: images.project6 },
        { x: 0.40, y: 0.70, width: 157, height: 157, id: 'container7', page: 'r.html', image: images.project7 }
    ];
    
    projectPositions.forEach(pos => {
        ctx.save();
        ctx.translate(width * pos.x, height * pos.y);
        
        // Draw the image
        ctx.drawImage(pos.image, -pos.width/2, -pos.height/2, pos.width, pos.height);
        
        // Add hover effect
        if (isHovering(pos.id)) {
            ctx.fillStyle = 'rgba(0, 0, 128, 0.1)';
            ctx.fillRect(-pos.width/2, -pos.height/2, pos.width, pos.height);
        }
        
        ctx.restore();
    });
    // Draw prewedding
    ctx.save();
    ctx.translate(width * 0.14, height * 0.53);
    ctx.rotate(8 * Math.PI / 180);
    ctx.drawImage(images.prewedding, 7.5, -380, 322, 194);
    ctx.restore();

    // Draw reels
    ctx.save();
    ctx.translate(width * 0.92, height * 0.86);
    ctx.drawImage(images.reels, -280, -170, 322, 194);
    ctx.restore();
}

// Draw Third canvas content
function drawThirdCanvas(ctx, width, height) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    drawDottedBackground(ctx, width, height);

    const projectPositions = [
        { x: 0.25, y: 0.4, width: 144, height: 144, id: 'container1', page: 'Tri.html', image: images.project1 },
        { x: 0.25, y: 0.69, width: 128, height: 129, id: 'container10', page: 'project3.html', image: images.project10 },
        { x: 0.68, y: 0.35, width: 140, height: 198, id: 'container2', page: 'project2.html', image: images.project2 },
        { x: 0.68, y: 0.59, width: 189, height: 126, id: 'container3', page: 'project5.html', image: images.project3 },
     
    ];

    projectPositions.forEach(pos => {
        ctx.save();
        ctx.translate(width * pos.x, height * pos.y);
        
        // Draw the image
        ctx.drawImage(pos.image, -pos.width/2, -pos.height/2, pos.width, pos.height);
        
        // Add hover effect
        if (isHovering(pos.id)) {
            ctx.fillStyle = 'rgba(0, 0, 128, 0.1)';
            ctx.fillRect(-pos.width/2, -pos.height/2, pos.width, pos.height);
        }
        
        ctx.restore();
    });
}

// Track mouse position and hover state
let mouseX = 0;
let mouseY = 0;
let hoveredContainer = null;

// Function to check if mouse is hovering over a container
function isHovering(containerId) {
    return hoveredContainer === containerId;
}

// Function to check if a point is within a container's bounds
function isPointInContainer(x, y, container, canvasWidth, canvasHeight) {
    const containerX = canvasWidth * container.x;
    const containerY = canvasHeight * container.y;
    const halfWidth = container.width / 2;
    const halfHeight = container.height / 2;
    
    return x >= containerX - halfWidth && 
           x <= containerX + halfWidth && 
           y >= containerY - halfHeight && 
           y <= containerY + halfHeight;
}

// Add mouse move event listener
document.addEventListener('mousemove', (e) => {
    const canvas = e.target.closest('canvas');
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    // Define positions for each canvas
    const canvas1Positions = [
        { x: 0.49, y: 0.45, width: 450, height: 550, id: 'container4', page: 'wedding.html', image: images.project4 },
        { x: 0.42, y: 0.45, width: 425, height: 250, id: 'container6', page: 'Prewedding.html', image: images.project6 },
        { x: 0.75, y: 0.45, width: 150, height: 140, id: 'container9', page: 'project9.html', image: images.project9 }
    ];
    
    const canvas2Positions = [
        { x: 0.65, y: 0.48, width: 169, height: 169, id: 'container4', page: 'wedding.html', image: images.project4 },
        { x: 0.35, y: 0.25, width: 160, height: 155, id: 'container6', page: 'Prewedding.html', image: images.project6 },
        { x: 0.40, y: 0.70, width: 157, height: 157, id: 'container7', page: 'r.html', image: images.project7 }
    ];
    
    const canvas3Positions = [
        { x: 0.25, y: 0.4, width: 144, height: 144, id: 'container1', page: 'Tri.html', image: images.project1 },
        { x: 0.25, y: 0.69, width: 128, height: 129, id: 'container10', page: 'project3.html', image: images.project10 },
        { x: 0.68, y: 0.35, width: 140, height: 198, id: 'container2', page: 'project2.html', image: images.project2 },
        { x: 0.68, y: 0.59, width: 189, height: 126, id: 'container3', page: 'project5.html', image: images.project3 }
    ];
    
    // Select the appropriate positions based on canvas ID
    let projectPositions;
    switch(canvas.id) {
        case 'myCanvas':
            projectPositions = canvas1Positions;
            break;
        case 'myCanvas2':
            projectPositions = canvas2Positions;
            break;
        case 'myCanvas3':
            projectPositions = canvas3Positions;
            break;
        default:
            return;
    }
    
    // Check which container is being hovered
    let foundHover = false;
    projectPositions.forEach(container => {
        if (isPointInContainer(mouseX, mouseY, container, rect.width, rect.height)) {
            hoveredContainer = container.id;
            foundHover = true;
            canvas.style.cursor = 'pointer';
        }
    });
    
    if (!foundHover) {
        hoveredContainer = null;
        canvas.style.cursor = 'default';
    }
    
    // Redraw canvas to show hover effects
    resizeCanvas();
});

// Add click event listener for containers
document.addEventListener('click', (e) => {
    const canvas = e.target.closest('canvas');
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Define positions for each canvas
    const canvas1Positions = [
        { x: 0.49, y: 0.45, width: 450, height: 550, id: 'container4', page: 'wedding.html', image: images.project4 },
        { x: 0.42, y: 0.45, width: 425, height: 250, id: 'container6', page: 'Prewedding.html', image: images.project6 },
        { x: 0.75, y: 0.45, width: 150, height: 140, id: 'container9', page: 'project9.html', image: images.project9 }
    ];
    
    const canvas2Positions = [
        { x: 0.65, y: 0.48, width: 169, height: 169, id: 'container4', page: 'wedding.html', image: images.project4 },
        { x: 0.35, y: 0.25, width: 160, height: 155, id: 'container6', page: 'Prewedding.html', image: images.project6 },
        { x: 0.40, y: 0.70, width: 157, height: 157, id: 'container7', page: 'r.html', image: images.project7 }
    ];
    
    const canvas3Positions = [
        { x: 0.25, y: 0.4, width: 144, height: 144, id: 'container1', page: 'Tri.html', image: images.project1 },
        { x: 0.25, y: 0.69, width: 128, height: 129, id: 'container10', page: 'project3.html', image: images.project10 },
        { x: 0.68, y: 0.35, width: 140, height: 198, id: 'container2', page: 'project2.html', image: images.project2 },
        { x: 0.68, y: 0.59, width: 189, height: 126, id: 'container3', page: 'project5.html', image: images.project3 }
    ];
    
    // Select the appropriate positions based on canvas ID
    let projectPositions;
    switch(canvas.id) {
        case 'myCanvas':
            projectPositions = canvas1Positions;
            break;
        case 'myCanvas2':
            projectPositions = canvas2Positions;
            break;
        case 'myCanvas3':
            projectPositions = canvas3Positions;
            break;
        default:
            return;
    }
    
    // Check which container was clicked
    projectPositions.forEach(container => {
        if (isPointInContainer(clickX, clickY, container, rect.width, rect.height)) {
            window.location.href = container.page;
        }
    });
});

function resizeCanvas() {
    const canvases = [
        { 
            canvas: document.getElementById('myCanvas'), 
            wrapper: document.getElementById('canvasWrapper'),
            drawFunction: drawFirstCanvas
        },
        { 
            canvas: document.getElementById('myCanvas2'), 
            wrapper: document.getElementById('canvasWrapper2'),
            drawFunction: drawSecondCanvas
        },
        {
            canvas: document.getElementById('myCanvas3'), 
            wrapper: document.getElementById('canvasWrapper3'),
            drawFunction: drawThirdCanvas
        }
    ];

    canvases.forEach(({ canvas, wrapper, drawFunction }) => {
        const ctx = canvas.getContext('2d');

        // Get actual wrapper dimensions (constrained by CSS)
        const wrapperWidth = wrapper.offsetWidth;
        const wrapperHeight = wrapper.offsetHeight;

        // Set canvas CSS size to match wrapper
        canvas.style.width = `${wrapperWidth}px`;
        canvas.style.height = `${wrapperHeight}px`;

        // Set canvas drawing buffer size (account for DPR)
        const dpr = window.devicePixelRatio || 1;
        canvas.width = wrapperWidth * dpr;
        canvas.height = wrapperHeight * dpr;

        // Scale context to account for DPR
        ctx.scale(dpr, dpr);

        // Draw canvas content
        drawFunction(ctx, wrapperWidth, wrapperHeight);
    });
}

// Initial setup
loadImages().then(() => {
    resizeCanvas();
    // Start animation loop
    requestAnimationFrame(animate);
}).catch(error => {
    console.error('Error loading images:', error);
});

// Handle window resize and orientation change
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);

// iOS-specific: Handle dynamic viewport changes (e.g., toolbar show/hide)
window.addEventListener('scroll', () => {
    setTimeout(resizeCanvas, 100); // Debounce for Safari quirks
});

// Add smooth scroll behavior with improved performance
let isScrolling = false;
let scrollTimeout;
const SCROLL_DURATION = 200; // Faster scroll duration
const SCROLL_THRESHOLD = 30; // Minimum scroll amount to trigger page change
let lastScrollTime = 0;
const SCROLL_COOLDOWN = 100; // Minimum time between scrolls

// Improved scroll handling
function handleScroll(direction) {
    if (isScrolling) return;
    
    const now = Date.now();
    if (now - lastScrollTime < SCROLL_COOLDOWN) return;
    
    const scrollContainer = document.getElementById('scrollContainer');
    const currentScroll = scrollContainer.scrollTop;
    const windowHeight = window.innerHeight;
    
    // Calculate target scroll position with easing
    let targetScroll;
    if (direction > 0) {
        // Scrolling down
        targetScroll = Math.ceil(currentScroll / windowHeight) * windowHeight;
    } else {
        // Scrolling up
        targetScroll = Math.floor(currentScroll / windowHeight) * windowHeight;
    }
    
    // Prevent scrolling if already at the target
    if (targetScroll === currentScroll) return;
    
    isScrolling = true;
    lastScrollTime = now;
    
    // Smooth scroll to target with easing
    scrollContainer.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
    });
    
    // Reset scrolling flag after animation
    setTimeout(() => {
        isScrolling = false;
    }, SCROLL_DURATION);
}

// Wheel event handler
document.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (Math.abs(e.deltaY) < SCROLL_THRESHOLD) return;
    handleScroll(e.deltaY);
}, { passive: false });

// Touch event handling with improved performance
let touchStartY = 0;
let touchStartX = 0;
let touchEndY = 0;
let touchEndX = 0;
let lastTouchTime = 0;
const TOUCH_THRESHOLD = 40; // Reduced threshold for more responsive touch
const TOUCH_TIMEOUT = 200; // Reduced timeout for snappier response
let touchVelocity = 0;
let lastTouchY = 0;
let touchStartTime = 0;

function handleTouchStart(e) {
    if (isScrolling) return;
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    lastTouchY = touchStartY;
    touchStartTime = Date.now();
    lastTouchTime = touchStartTime;
    touchVelocity = 0;
}

function handleTouchMove(e) {
    if (isScrolling) {
        e.preventDefault();
        return;
    }
    
    const touchY = e.touches[0].clientY;
    const touchX = e.touches[0].clientX;
    const deltaY = Math.abs(touchY - touchStartY);
    const deltaX = Math.abs(touchX - touchStartX);
    
    // Calculate touch velocity
    const now = Date.now();
    const timeDelta = now - lastTouchTime;
    if (timeDelta > 0) {
        touchVelocity = (touchY - lastTouchY) / timeDelta;
        lastTouchY = touchY;
        lastTouchTime = now;
    }
    
    // Determine if this is a vertical scroll
    if (deltaY > deltaX && deltaY > 10) {
        e.preventDefault();
    }
}

function handleTouchEnd(e) {
    if (isScrolling) return;
    
    touchEndY = e.changedTouches[0].clientY;
    touchEndX = e.changedTouches[0].clientX;
    const deltaY = touchEndY - touchStartY;
    const timeElapsed = Date.now() - touchStartTime;
    
    // Use velocity for more natural scrolling
    const velocityThreshold = 0.3;
    const shouldScroll = Math.abs(touchVelocity) > velocityThreshold || 
                        (timeElapsed < TOUCH_TIMEOUT && Math.abs(deltaY) > TOUCH_THRESHOLD);
    
    if (shouldScroll) {
        handleScroll(touchVelocity > 0 ? -1 : 1);
    }
}

// Add touch event listeners
document.addEventListener('touchstart', handleTouchStart, { passive: true });
document.addEventListener('touchmove', handleTouchMove, { passive: false });
document.addEventListener('touchend', handleTouchEnd, { passive: true });

// Add touch feedback for project containers
document.querySelectorAll('.project-container').forEach(container => {
    container.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
        this.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
    }, { passive: true });
    
    container.addEventListener('touchend', function() {
        this.style.transform = '';
        this.style.backgroundColor = '';
    }, { passive: true });
    
    container.addEventListener('touchcancel', function() {
        this.style.transform = '';
        this.style.backgroundColor = '';
    }, { passive: true });
});

// Add touch feedback for social icons
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
    }, { passive: true });
    
    icon.addEventListener('touchend', function() {
        this.style.transform = '';
    }, { passive: true });
    
    icon.addEventListener('touchcancel', function() {
        this.style.transform = '';
    }, { passive: true });
});

// Optimize scroll performance with RAF
let ticking = false;
document.getElementById('scrollContainer').addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            resizeCanvas();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });