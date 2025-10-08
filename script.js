class MemeGenerator {
    constructor() {
        this.canvas = document.getElementById('memeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.textInput = document.getElementById('memeText');
        this.generateBtn = document.getElementById('generateBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        this.baseImage = null;
        this.init();
    }

    init() {
        this.createBaseImage();
        this.bindEvents();
        this.downloadBtn.disabled = true;
    }

    createBaseImage() {
        // Create a base image using canvas
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = 600;
        tempCanvas.height = 400;

        // Create a gradient background
        const gradient = tempCtx.createLinearGradient(0, 0, 600, 400);
        gradient.addColorStop(0, '#4facfe');
        gradient.addColorStop(1, '#00f2fe');
        
        tempCtx.fillStyle = gradient;
        tempCtx.fillRect(0, 0, 600, 400);

        // Add some decorative elements
        tempCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 600;
            const y = Math.random() * 400;
            const radius = Math.random() * 30 + 10;
            tempCtx.beginPath();
            tempCtx.arc(x, y, radius, 0, Math.PI * 2);
            tempCtx.fill();
        }

        // Add a central focus area
        tempCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        tempCtx.fillRect(50, 100, 500, 200);

        // Add border
        tempCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        tempCtx.lineWidth = 4;
        tempCtx.strokeRect(2, 2, 596, 396);

        // Convert to image
        this.baseImage = new Image();
        this.baseImage.onload = () => {
            this.renderMeme('Your meme text here!');
        };
        this.baseImage.src = tempCanvas.toDataURL();
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => {
            const text = this.textInput.value.trim() || 'Your meme text here!';
            this.renderMeme(text);
        });

        this.downloadBtn.addEventListener('click', () => {
            this.downloadMeme();
        });

        this.textInput.addEventListener('input', () => {
            const text = this.textInput.value.trim() || 'Your meme text here!';
            this.renderMeme(text);
        });

        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const text = this.textInput.value.trim() || 'Your meme text here!';
                this.renderMeme(text);
            }
        });
    }

    renderMeme(text) {
        if (!this.baseImage) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw base image
        this.ctx.drawImage(this.baseImage, 0, 0);

        // Setup text styling
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 3;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';

        // Calculate font size based on text length
        let fontSize = Math.max(20, Math.min(60, 500 / text.length));
        this.ctx.font = `bold ${fontSize}px Arial, sans-serif`;

        // Position text at the top
        const x = this.canvas.width / 2;
        const y = 30;

        // Draw text with outline effect
        this.ctx.strokeText(text.toUpperCase(), x, y);
        this.ctx.fillText(text.toUpperCase(), x, y);

        // Enable download button
        this.downloadBtn.disabled = false;
    }

    downloadMeme() {
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = this.canvas.toDataURL();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Initialize the meme generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemeGenerator();
});