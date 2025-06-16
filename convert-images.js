const fs = require('fs');
const path = require('path');

// List of images to convert
const images = [
    { name: 'project9', file: '31.jpg' },
    { name: 'thumbnail', file: 'IMG_6799.png' },
    { name: 'intro', file: 'intro.png' },
    { name: 'image4', file: '1.4.png' },
    { name: 'project1', file: '26.jpg' },
    { name: 'project2', file: '30.jpg' },
    { name: 'project3', file: '38.jpg' },
    { name: 'project4', file: '40.jpg' },
    { name: 'project5', file: '37.jpg' },
    { name: 'project6', file: '44.jpg' },
    { name: 'project7', file: '39.jpg' },
    { name: 'project10', file: '28.jpg' }
];

// Convert each image to base64
const imageData = {};
images.forEach(img => {
    const filePath = path.join(__dirname, img.file);
    const imageBuffer = fs.readFileSync(filePath);
    const base64Data = imageBuffer.toString('base64');
    const mimeType = img.file.endsWith('.png') ? 'image/png' : 'image/jpeg';
    imageData[img.name] = `data:${mimeType};base64,${base64Data}`;
});

// Write the base64 data to a file
const output = `const imageData = ${JSON.stringify(imageData, null, 2)};`;
fs.writeFileSync(path.join(__dirname, 'image-data.js'), output);

console.log('Images converted successfully!'); 