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

// Draw dotted background with animation
function drawDottedBackground(ctx, width, height) {
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(0, 0, width, height);
    
    const offsetX = (animationFrame % 40) * 1;
    const offsetY = (animationFrame % 40) * 1;
    
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
    ctx.drawImage(images.image4, -250, -395, 500, 600);
    ctx.restore();

    // Draw intro
    ctx.save();
    ctx.translate(width * 0.42, height * 0.45);
    ctx.rotate(-4 * Math.PI / 180);
    ctx.drawImage(images.intro, -235, -265, 525, 300);
    ctx.restore();

    // Draw project9
    ctx.save();
    ctx.translate(width * 0.75, height * 0.45);
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    
    ctx.drawImage(images.project9, -325, -360, 200, 190);
    
    ctx.shadowColor = 'transparent';
    ctx.restore();

    // Draw thumbnail
    ctx.save();
    ctx.translate(width * 0.42, height * 0.45);
    ctx.rotate(-2 * Math.PI / 180);
    ctx.drawImage(images.thumbnail, -270, -200, 700, 800);
    ctx.restore();
}

// Draw second canvas content
function drawSecondCanvas(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    drawDottedBackground(ctx, width, height);

    // Draw wedding1
    ctx.save();
    ctx.translate(width * 0.2, height * 0.84);
    ctx.drawImage(images.wedding1, -215, -381, 590, 300);
    ctx.restore();

    // Draw prewedding
    ctx.save();
    ctx.translate(width * 0.14, height * 0.53);
    ctx.rotate(8 * Math.PI / 180);
    ctx.drawImage(images.prewedding, -225, -550, 590, 300);
    ctx.restore();

    // Draw reels
    ctx.save();
    ctx.translate(width * 0.92, height * 0.86);
    ctx.drawImage(images.reels, -590, -200, 590, 300);
    ctx.restore();
    
    const projectPositions = [
        { x: 0.35, y: 0.45, width: 260, height: 230, id: 'container4', page: 'wedding.html', image: images.project4 },
        { x: 0.60, y: 0.20, width: 300, height: 210, id: 'container6', page: 'Prewedding.html', image: images.project6 },
        { x: 0.65, y: 0.80, width: 250, height: 230, id: 'container7', page: 'r.html', image: images.project7 }
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

// Draw Third canvas content
function drawThirdCanvas(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    drawDottedBackground(ctx, width, height);

    const projectPositions = [
        { x: 0.25, y: 0.15, width: 220, height: 220, id: 'container1', page: 'Tri.html', image: images.project1 },
        { x: 0.25, y: 0.4, width: 260, height: 210, id: 'container10', page: 'project3.html', image: images.project10 },
        { x: 0.62, y: 0.55, width: 250, height: 280, id: 'container2', page: 'project2.html', image: images.project2 },
        { x: 0.35, y: 0.79, width: 250, height: 180, id: 'container3', page: 'project5.html', image: images.project3 },
        { x: 0.78, y: 0.25, width: 250, height: 180, id: 'container5', page: 'project10.html', image: images.project5 }
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
            { x: 0.35, y: 0.45, width: 260, height: 230, id: 'container4', page: 'wedding.html', image: images.project4 },
            { x: 0.60, y: 0.20, width: 300, height: 210, id: 'container6', page: 'Prewedding.html', image: images.project6 },
            { x: 0.65, y: 0.80, width: 250, height: 230, id: 'container7', page: 'r.html', image: images.project7 }
        ] :
        [
            { x: 0.25, y: 0.15, width: 220, height: 220, id: 'container1', page: 'Tri.html', image: images.project1 },
            { x: 0.25, y: 0.4, width: 260, height: 210, id: 'container10', page: 'project3.html', image: images.project10 },
            { x: 0.62, y: 0.55, width: 250, height: 280, id: 'container2', page: 'project2.html', image: images.project2 },
            { x: 0.35, y: 0.79, width: 250, height: 180, id: 'container3', page: 'project5.html', image: images.project3 },
            { x: 0.78, y: 0.25, width: 250, height: 180, id: 'container5', page: 'project10.html', image: images.project5 }
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
            { x: 0.35, y: 0.45, width: 260, height: 230, id: 'container4', page: 'wedding.html', image: images.project4 },
            { x: 0.60, y: 0.20, width: 300, height: 210, id: 'container6', page: 'Prewedding.html', image: images.project6 },
            { x: 0.65, y: 0.80, width: 250, height: 230, id: 'container7', page: 'r.html', image: images.project7 }
        ] :
        [
            { x: 0.25, y: 0.15, width: 220, height: 220, id: 'container1', page: 'Tri.html', image: images.project1 },
            { x: 0.25, y: 0.4, width: 260, height: 210, id: 'container10', page: 'project3.html', image: images.project10 },
            { x: 0.62, y: 0.55, width: 250, height: 280, id: 'container2', page: 'project2.html', image: images.project2 },
            { x: 0.35, y: 0.79, width: 250, height: 180, id: 'container3', page: 'project5.html', image: images.project3 },
            { x: 0.78, y: 0.25, width: 250, height: 180, id: 'container5', page: 'project10.html', image: images.project5 }
        ];
    
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
        const wrapperWidth = wrapper.offsetWidth;
        const wrapperHeight = wrapper.offsetHeight;

        canvas.style.width = `${wrapperWidth}px`;
        canvas.style.height = `${wrapperHeight}px`;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = wrapperWidth * dpr;
        canvas.height = wrapperHeight * dpr;

        ctx.scale(dpr, dpr);
        drawFunction(ctx, wrapperWidth, wrapperHeight);
    });
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