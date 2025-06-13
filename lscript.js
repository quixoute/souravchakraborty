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

// Animation state
let animationFrame = 0;
let lastTimestamp = 0;

// Draw dotted background
function drawDottedBackground(ctx, width, height) {
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

// Draw first canvas content
function drawFirstCanvas(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    drawDottedBackground(ctx, width, height);

    // Draw image4
    ctx.save();
    ctx.translate(width * 0.49, height * 0.45);
    ctx.rotate(-15 * Math.PI / 180);
    ctx.drawImage(images.image4, -300, -385, 500, 650);
    ctx.restore();

    // Draw intro
    ctx.save();
    ctx.translate(width * 0.42, height * 0.45);
    ctx.rotate(-6 * Math.PI / 180);
    ctx.drawImage(images.intro, -190, -185, 525, 350);
    ctx.restore();

    // Draw project9
    ctx.save();
    ctx.translate(width * 0.75, height * 0.45);
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    
    ctx.drawImage(images.project9, -50, 10, 180, 170);
    
    ctx.shadowColor = 'transparent';
    ctx.restore();

    // Draw thumbnail
    ctx.save();
    ctx.translate(width * 0.42, height * 0.45);
    ctx.rotate(-2 * Math.PI / 180);
    ctx.drawImage(images.thumbnail, -50, -50, 550, 630);
    ctx.restore();

    // Draw wedding1
    ctx.save();
    ctx.translate(width * 0.2, height * 0.84);
    ctx.drawImage(images.wedding1, -305, -85, 590, 250);
    ctx.restore();

    // Draw prewedding
    ctx.save();
    ctx.translate(width * 0.14, height * 0.53);
    ctx.rotate(8 * Math.PI / 180);
    ctx.drawImage(images.prewedding, -305, -465, 490, 250);
    ctx.restore();
    
    // Draw reels
    ctx.save();
    ctx.translate(width * 0.92, height * 0.86);
    ctx.drawImage(images.reels, -300, -150, 590, 250);
    ctx.restore();
    
    const projectPositions = [
        { x: 0.15, y: 0.75, width: 170, height: 165, id: 'container4', page: 'wedding.html', image: images.project4 },
        { x: 0.15, y: 0.30, width: 250, height: 170, id: 'container6', page: 'Prewedding.html', image: images.project6 },
        { x: 0.8, y: 0.80, width: 220, height: 220, id: 'container7', page: 'r.html', image: images.project7 },
        { x: 0.36, y: 0.19, width: 200, height: 190, id: 'container1', page: 'Tri.html', image: images.project1 },
        { x: 0.22, y: 0.5, width: 200, height: 160, id: 'container10', page: 'project3.html', image: images.project10 },
        { x: 0.72, y: 0.30, width: 200, height: 300, id: 'container2', page: 'project2.html', image: images.project2 },
        { x: 0.36, y: 0.85, width: 220, height: 160, id: 'container3', page: 'project5.html', image: images.project3 },
        { x: 0.89, y: 0.45, width: 150, height: 100, id: 'container5', page: 'project10.html', image: images.project5 }
    ];
    
    projectPositions.forEach(pos => {
        ctx.save();
        ctx.translate(width * pos.x, height * pos.y);
        
        ctx.drawImage(pos.image, -pos.width/2, -pos.height/2, pos.width, pos.height);
        
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

function isHovering(containerId) {
    return hoveredContainer === containerId;
}

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

// Mouse event listeners
document.addEventListener('mousemove', (e) => {
    const canvas = e.target.closest('canvas');
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    const projectPositions = canvas.id === 'myCanvas2' ? 
        [
            { x: 0.35, y: 0.45, width: 260, height: 250, id: 'container4', page: 'wedding.html', image: images.project4 },
            { x: 0.60, y: 0.20, width: 300, height: 220, id: 'container6', page: 'Prewedding.html', image: images.project6 },
            { x: 0.8, y: 0.80, width: 220, height: 220, id: 'container7', page: 'r.html', image: images.project7 }
        ] :
        [
            { x: 0.25, y: 0.15, width: 250, height: 240, id: 'container1', page: 'Tri.html', image: images.project1 },
            { x: 0.25, y: 0.4, width: 260, height: 220, id: 'container10', page: 'project3.html', image: images.project10 },
            { x: 0.62, y: 0.55, width: 250, height: 300, id: 'container2', page: 'project2.html', image: images.project2 },
            { x: 0.35, y: 0.79, width: 250, height: 200, id: 'container3', page: 'project5.html', image: images.project3 },
            { x: 0.78, y: 0.25, width: 250, height: 200, id: 'container5', page: 'project10.html', image: images.project5 }
        ];
    
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
    
    resizeCanvas();
});

// Click event listener
document.addEventListener('click', (e) => {
    const canvas = e.target.closest('canvas');
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const projectPositions = canvas.id === 'myCanvas2' ? 
        [
            { x: 0.35, y: 0.45, width: 260, height: 250, id: 'container4', page: 'wedding.html', image: images.project4 },
            { x: 0.60, y: 0.20, width: 300, height: 220, id: 'container6', page: 'Prewedding.html', image: images.project6 },
            { x: 0.8, y: 0.80, width: 220, height: 220, id: 'container7', page: 'r.html', image: images.project7 }
        ] :
        [
            { x: 0.25, y: 0.15, width: 250, height: 240, id: 'container1', page: 'Tri.html', image: images.project1 },
            { x: 0.25, y: 0.4, width: 260, height: 220, id: 'container10', page: 'project3.html', image: images.project10 },
            { x: 0.62, y: 0.55, width: 250, height: 300, id: 'container2', page: 'project2.html', image: images.project2 },
            { x: 0.35, y: 0.79, width: 250, height: 200, id: 'container3', page: 'project5.html', image: images.project3 },
            { x: 0.78, y: 0.25, width: 250, height: 200, id: 'container5', page: 'project10.html', image: images.project5 }
        ];
    
    projectPositions.forEach(container => {
        if (isPointInContainer(clickX, clickY, container, rect.width, rect.height)) {
            window.location.href = container.page;
        }
    });
});

function resizeCanvas() {
    const canvas = document.getElementById('myCanvas');
    const wrapper = document.getElementById('canvasWrapper');
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
    drawFirstCanvas(ctx, wrapperWidth, wrapperHeight);
}

// Initial setup
loadImages().then(() => {
    resizeCanvas();
    requestAnimationFrame(animate);
}).catch(error => {
    console.error('Error loading images:', error);
});

// Event listeners
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);

// Smooth scroll behavior
document.addEventListener('wheel', (e) => {
    e.preventDefault();
    const scrollContainer = document.getElementById('scrollContainer');
    const scrollAmount = e.deltaY;
    scrollContainer.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
    });
}, { passive: false });

// Touch scroll behavior
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].clientY;
    const scrollContainer = document.getElementById('scrollContainer');
    const scrollAmount = touchEndY - touchStartY;
    
    if (Math.abs(scrollAmount) > 50) {
        scrollContainer.scrollBy({
            top: scrollAmount,
            behavior: 'smooth'
        });
    }
}, { passive: true }); 