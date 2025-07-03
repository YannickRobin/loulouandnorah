// Dynamically load gallery images from medias/ folder
const gallery = document.getElementById('gallery');
const imageCount = 6; // Number of images in medias/ (media1.jpg to media6.jpg)

for (let i = 1; i <= imageCount; i++) {
    const img = document.createElement('img');
    img.src = `medias/media${i}.jpg`;
    img.alt = `Loulou & Norah Patisserie creation ${i}`;
    img.loading = 'lazy';
    img.onclick = () => {
        // Simple lightbox effect
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.7)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = 1000;
        const bigImg = document.createElement('img');
        bigImg.src = img.src;
        bigImg.style.maxWidth = '90vw';
        bigImg.style.maxHeight = '80vh';
        bigImg.style.borderRadius = '1.2rem';
        overlay.appendChild(bigImg);
        overlay.onclick = () => document.body.removeChild(overlay);
        document.body.appendChild(overlay);
    };
    gallery.appendChild(img);
}
