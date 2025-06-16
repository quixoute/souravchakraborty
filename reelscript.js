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

// Preload images
const preloadedImages = {};

function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            preloadedImages[src] = img;
            console.log(`Successfully preloaded image: ${src}`);
            resolve(img);
        };
        img.onerror = () => {
            console.error(`Failed to preload image: ${src}`);
            reject(new Error(`Failed to load image: ${src}`));
        };
        img.src = src;
    });
}
// Background images
const backgroundImages = [
    { image: 'mumuso', x: 620, y: 350, width: 338, height: 198, rotation: 0 },
    { image: 'spacify', x: 1000, y: 460, width: 318, height: 187, rotation: 30 },
    { image: 'rimi', x: 1100, y: 840, width: 232, height: 136, rotation: 0 },
    { image: 'wedding', x: 400, y: 850, width: 277, height: 163, rotation: 0 },
    { image: 'turtle', x: 1490, y: 580, width: 271, height: 159, rotation: 0 }
];
// Container positions and states
const containers = [
    { id: 'container1', image: 'project1', x: 750, y: 450, width: 210, height: 210, page: 'mumuso.html' },
    { id: 'container2', image: 'project2', x: 1000, y: 300, width: 210, height: 210, page: 'spacify.html' },
    { id: 'container3', image: 'project3', x: 1050, y: 700, width: 210, height: 210, page: 'riminayak.html' },
    { id: 'container4', image: 'project4', x: 600, y: 800, width: 210, height: 210, page: 'weddingreels.html' },
    { id: 'container5', image: 'project5', x: 1300, y: 500, width: 210, height: 210, page: 'turtle.html' }
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
let canvas = null;
let ctx = null;

// Draw background images
function drawBackgroundImages(width, height) {
    if (!ctx) return;
    
    backgroundImages.forEach(bg => {
        const imagePath = imagePaths[bg.image];
        const preloadedImg = preloadedImages[imagePath];
        
        if (!preloadedImg) {
            console.log(`Preloaded background image not available: ${imagePath}`);
            return;
        }
        
        const x = bg.x + offsetX;
        const y = bg.y + offsetY;
        
        ctx.save();
        ctx.globalAlpha = 1.0;
        ctx.translate(x, y);
        ctx.rotate(bg.rotation * Math.PI / 180);
        ctx.drawImage(
            preloadedImg,
            -bg.width/2,
            -bg.height/2,
            bg.width,
            bg.height
        );
        ctx.restore();
    });
}

// Draw containers
function drawContainers(width, height) {
    if (!ctx) return;
    
    containers.forEach(container => {
        const x = container.x + offsetX;
        const y = container.y + offsetY;
        
        // Use preloaded image if available
        const imagePath = imagePaths[container.image];
        const preloadedImg = preloadedImages[imagePath];
        
        if (!preloadedImg) {
            console.log(`Preloaded image not available for container: ${container.id}`);
            return;
        }
        
        ctx.save();
        ctx.globalAlpha = 1.0;
        
        // Add hover effect
        if (hoveredContainer === container.id) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
        }
        
        // Draw image
        ctx.drawImage(
            preloadedImg,
            x - container.width/2,
            y - container.height/2,
            container.width,
            container.height
        );
        
        ctx.restore();
    });
}

// Main animation loop
function animate(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (!canvas || !ctx) {
        console.error('Canvas or context not available');
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw everything in correct order
    drawContainers(canvas.width, canvas.height);  // Draw containers first
    drawBackgroundImages(canvas.width, canvas.height);  // Draw background images on top

    // Request next frame
    animationFrame = requestAnimationFrame(animate);
}

// Event handlers
function handleMouseMove(event) {
    if (isDragging) {
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;
        offsetX = initialX + deltaX;
        offsetY = initialY + deltaY;
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    let foundHover = false;
    
    containers.forEach(container => {
        const x = container.x + offsetX;
        const y = container.y + offsetY;
        
        if (
            mouseX >= x - container.width/2 &&
            mouseX <= x + container.width/2 &&
            mouseY >= y - container.height/2 &&
            mouseY <= y + container.height/2
        ) {
            hoveredContainer = container.id;
            foundHover = true;
            canvas.style.cursor = 'pointer';
        }
    });
    
    if (!foundHover) {
        hoveredContainer = null;
        canvas.style.cursor = 'default';
    }
}

function handleMouseDown(event) {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    initialX = offsetX;
    initialY = offsetY;
}

function handleMouseUp() {
    isDragging = false;
}

// Add click detection
function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    containers.forEach(container => {
        const x = container.x + offsetX;
        const y = container.y + offsetY;
        
        // Check if click is within container bounds
        if (
            clickX >= x - container.width/2 &&
            clickX <= x + container.width/2 &&
            clickY >= y - container.height/2 &&
            clickY <= y + container.height/2
        ) {
            console.log(`Container clicked: ${container.id}, redirecting to ${container.page}`);
            window.location.href = container.page;
        }
    });
}

// Initialize
async function init() {
    // Create new canvas element
    canvas = document.createElement('canvas');
    canvas.className = 'main-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);

    try {
        ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Could not get 2D context from canvas');
            return;
        }
    } catch (error) {
        console.error('Error getting canvas context:', error);
        return;
    }

    // Set canvas size and center it
    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Calculate center offset
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Update offset to center the content
        offsetX = centerX - 960; // Half of 1920 (our content width)
        offsetY = centerY - 540; // Half of 1080 (our content height)
        
        console.log('Canvas resized:', {
            width: canvas.width,
            height: canvas.height,
            centerX,
            centerY,
            offsetX,
            offsetY
        });
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Add event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('click', handleClick);
    window.addEventListener('mouseup', handleMouseUp);

    // Preload all images
    try {
        console.log('Starting image preloading...');
        
        // Preload container images
        const containerPromises = containers.map(container => {
            const imagePath = imagePaths[container.image];
            console.log(`Preloading container image: ${imagePath}`);
            return preloadImage(imagePath);
        });
        
        // Preload background images
        const backgroundPromises = backgroundImages.map(bg => {
            const imagePath = imagePaths[bg.image];
            console.log(`Preloading background image: ${imagePath}`);
            return preloadImage(imagePath);
        });
        
        // Wait for all images to load
        await Promise.all([...containerPromises, ...backgroundPromises]);
        console.log('All images preloaded successfully');
    } catch (error) {
        console.error('Error preloading images:', error);
    }

    // Start animation
    animate(0);
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
  