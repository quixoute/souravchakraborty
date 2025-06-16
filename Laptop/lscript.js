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

// Animation loop
function animate(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const elapsed = timestamp - lastTimestamp;
    
    if (elapsed > 100) {
        animationFrame++;
        lastTimestamp = timestamp;
    }
    
    drawFirstCanvas();
    requestAnimationFrame(animate);
}

// Draw first canvas content
function drawFirstCanvas() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const width = 1512;
    const height = 982;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(0, 0, width, height);

    // Draw image4
    ctx.save();
    ctx.translate(741, 442);
    ctx.rotate(-15 * Math.PI / 180);
    ctx.drawImage(images.image4, -300, -385, 500, 650);
    ctx.restore();

    // Draw intro
    ctx.save();
    ctx.translate(635, 442);
    ctx.rotate(-6 * Math.PI / 180);
    ctx.drawImage(images.intro, -190, -185, 525, 350);
    ctx.restore();

    // Draw project9
    ctx.save();
    ctx.translate(1134, 442);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.drawImage(images.project9, -50, 10, 180, 170);
    ctx.shadowColor = 'transparent';
    ctx.restore();

    // Draw thumbnail
    ctx.save();
    ctx.translate(635, 442);
    ctx.rotate(-2 * Math.PI / 180);
    ctx.drawImage(images.thumbnail, -50, -50, 550, 630);
    ctx.restore();

    // Draw wedding1
    ctx.save();
    ctx.translate(302, 825);
    ctx.drawImage(images.wedding1, -305, -85, 590, 250);
    ctx.restore();

    // Draw prewedding
    ctx.save();
    ctx.translate(211, 520);
    ctx.rotate(8 * Math.PI / 180);
    ctx.drawImage(images.prewedding, -305, -465, 490, 250);
    ctx.restore();
    
    // Draw reels
    ctx.save();
    ctx.translate(1391, 844);
    ctx.drawImage(images.reels, -300, -150, 590, 250);
    ctx.restore();
    
    const projectPositions = [
        { x: 227, y: 736, width: 170, height: 165, id: 'container4', page: 'wedding.html', image: images.project4 },
        { x: 227, y: 295, width: 170, height: 170, id: 'container6', page: 'Prewedding.html', image: images.project6 },
        { x: 1210, y: 786, width: 220, height: 220, id: 'container7', page: 'r.html', image: images.project7 },
        { x: 544, y: 186, width: 200, height: 190, id: 'container1', page: 'Tri.html', image: images.project1 },
        { x: 333, y: 491, width: 200, height: 160, id: 'container10', page: 'project3.html', image: images.project10 },
        { x: 1089, y: 295, width: 200, height: 300, id: 'container2', page: 'project2.html', image: images.project2 },
        { x: 544, y: 835, width: 220, height: 160, id: 'container3', page: 'project5.html', image: images.project3 },
        { x: 1346, y: 442, width: 150, height: 100, id: 'container5', page: 'project10.html', image: images.project5 }
    ];
    
    projectPositions.forEach(pos => {
        ctx.save();
        ctx.translate(pos.x, pos.y);
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

function isPointInContainer(x, y, container) {
    const halfWidth = container.width / 2;
    const halfHeight = container.height / 2;
    
    return x >= container.x - halfWidth && 
           x <= container.x + halfWidth && 
           y >= container.y - halfHeight && 
           y <= container.y + halfHeight;
}

// Mouse event listeners
document.addEventListener('mousemove', (e) => {
    const canvas = document.getElementById('myCanvas');
    const rect = canvas.getBoundingClientRect();
    const scaleX = 1512 / rect.width;
    const scaleY = 982 / rect.height;
    
    mouseX = (e.clientX - rect.left) * scaleX;
    mouseY = (e.clientY - rect.top) * scaleY;
    
    const projectPositions = [
        { x: 227, y: 736, width: 170, height: 165, id: 'container4', page: 'wedding.html', image: images.project4 },
        { x: 227, y: 295, width: 250, height: 250, id: 'container6', page: 'Prewedding.html', image: images.project6 },
        { x: 1210, y: 786, width: 220, height: 220, id: 'container7', page: 'r.html', image: images.project7 },
        { x: 544, y: 186, width: 200, height: 190, id: 'container1', page: 'Tri.html', image: images.project1 },
        { x: 333, y: 491, width: 200, height: 160, id: 'container10', page: 'project3.html', image: images.project10 },
        { x: 1089, y: 295, width: 200, height: 300, id: 'container2', page: 'project2.html', image: images.project2 },
        { x: 544, y: 835, width: 220, height: 160, id: 'container3', page: 'project5.html', image: images.project3 },
        { x: 1346, y: 442, width: 150, height: 100, id: 'container5', page: 'project10.html', image: images.project5 }
    ];
    
    let foundHover = false;
    projectPositions.forEach(container => {
        if (isPointInContainer(mouseX, mouseY, container)) {
            hoveredContainer = container.id;
            foundHover = true;
            canvas.style.cursor = 'pointer';
        }
    });
    
    if (!foundHover) {
        hoveredContainer = null;
        canvas.style.cursor = 'default';
    }
    
    drawFirstCanvas();
});

// Click event listener
document.addEventListener('click', (e) => {
    const canvas = document.getElementById('myCanvas');
    const rect = canvas.getBoundingClientRect();
    const scaleX = 1512 / rect.width;
    const scaleY = 982 / rect.height;
    
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;
    
    const projectPositions = [
        { x: 227, y: 736, width: 170, height: 165, id: 'container4', page: 'wedding.html', image: images.project4 },
        { x: 227, y: 295, width: 250, height: 250, id: 'container6', page: 'Prewedding.html', image: images.project6 },
        { x: 1210, y: 786, width: 220, height: 220, id: 'container7', page: 'r.html', image: images.project7 },
        { x: 544, y: 186, width: 200, height: 190, id: 'container1', page: 'Tri.html', image: images.project1 },
        { x: 333, y: 491, width: 200, height: 160, id: 'container10', page: 'project3.html', image: images.project10 },
        { x: 1089, y: 295, width: 200, height: 300, id: 'container2', page: 'project2.html', image: images.project2 },
        { x: 544, y: 835, width: 220, height: 160, id: 'container3', page: 'project5.html', image: images.project3 },
        { x: 1346, y: 442, width: 150, height: 100, id: 'container5', page: 'project10.html', image: images.project5 }
    ];
    
    projectPositions.forEach(container => {
        if (isPointInContainer(clickX, clickY, container)) {
            window.location.href = container.page;
        }
    });
});

// Initial setup
loadImages().then(() => {
    const canvas = document.getElementById('myCanvas');
    canvas.width = 1512;
    canvas.height = 982;
    
    // Create dotted canvas background
    const canvasWrapper = document.getElementById('canvasWrapper');
    const dottedCanvas = document.createElement('div');
    dottedCanvas.className = 'dotted-canvas';
    canvasWrapper.insertBefore(dottedCanvas, canvas);
    
    drawFirstCanvas();
    requestAnimationFrame(animate);
}).catch(error => {
    console.error('Error loading images:', error);
});

// Event listeners
window.addEventListener('resize', () => {
    const canvas = document.getElementById('myCanvas');
    canvas.width = 1512;
    canvas.height = 982;
    drawFirstCanvas();
});

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