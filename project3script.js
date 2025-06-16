// Image gallery configuration
const galleryConfig = {
    images: [
        {
            src: "Dreamer/Dreamer-1.jpg",
            alt: "Image 1",
            x: 170,
            y: 32,
            width: 200,
            height: 250,
            rotation: 0,
        },
        {
            src: "Dreamer/Dreamer-2.jpg",
            alt: "Image 5",
            x: 748,
            y: 400,
            width: 147,
            height: 220,
            rotation: 0
        },
        {
            src: "Dreamer/Dreamer-5.jpg",
            alt: "Image 4",
            x: 1255,
            y: 167,
            width: 147,
            height: 220,
            rotation: 0
        },
        {
            src: "Dreamer/Dreamer-6.jpg",
            alt: "Image 2",
            x: 901,
            y: 167,
            width: 147,
            height: 220,
            rotation: 0
        },
        {
            src: "Dreamer/Dreamer-7.jpg",
            alt: "Image 3",
            x: 1102,
            y: 167,
            width: 147,
            height: 220,
            rotation: 0
        },
        {
            src: "Dreamer/Dreamer-8.jpg",
            alt: "Image 8",
            x: 1102,
            y: 400,
            width: 147,
            height: 220,
            rotation: 0
        },
        {
            src: "Dreamer/Dreamer-9.jpg",
            alt: "Image 9",
            x: 1255,
            y: 400,
            width: 147,
            height: 220,
            rotation: 0
        },
        {
            src: "Dreamer/Dreamer-10.jpg",
            alt: "Image 12",
            x: 1256,
            y: 631,
            width: 147,
            height: 220,
            rotation: 0
        },
        {
            src: "Dreamer/Dreamer-11.jpg",
            alt: "Image 10",
            x: 901,
            y: 400,
            width: 147,
            height: 220,
            rotation: 0
        },
        {
            src: "Dreamer/Dreamer-12.jpg",
            alt: "Image 1",
            x: 748,
            y: 167,
            width: 147,
            height: 220,
            rotation: 0
        },
        {
            src: "Dreamer/Dreamer-13.jpg",
            alt: "Image 13",
            x: 748,
            y: 631,
            width: 147,
            height: 220,
            rotation: 0
        },
        {
            src: "Dreamer/Dreamer-14.jpg",
            alt: "Image 14",
            x: 901,
            y: 631,
            width: 147,
            height: 220,
            rotation: 0
        },
        {
            src: "Dreamer/Dreamer-15.jpg",
            alt: "Image 11",
            x: 1102,
            y: 631,
            width: 147,
            height: 220,
            rotation: 0
        }
    ]
};

// Initialize gallery
function initializeGallery() {
    const gallery = document.querySelector('.galleryConfig');
    if (!gallery) {
        console.error('Gallery container not found');
        return;
    }

    // Create and position images
    galleryConfig.images.forEach((config, index) => {
        const img = document.createElement('img');
        img.src = config.src;
        img.alt = config.alt;
        img.style.position = 'absolute';
        img.style.left = `${config.x}px`;
        img.style.top = `${config.y}px`;
        img.style.width = `${config.width}px`;
        img.style.height = `${config.height}px`;
        img.style.transform = `rotate(${config.rotation}deg)`;
        gallery.appendChild(img);
    });
}

// Start when page loads
document.addEventListener('DOMContentLoaded', initializeGallery);

