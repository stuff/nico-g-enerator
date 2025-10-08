class MemeGenerator {
  constructor() {
    this.canvas = document.getElementById('memeCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.textInput = document.getElementById('memeText');
    this.downloadBtn = document.getElementById('downloadBtn');

    this.baseImage = null;
    this.init();
  }

  init() {
    this.loadTextFromURL(); // Load URL text first
    this.createBaseImage();
    this.bindEvents();
    this.downloadBtn.disabled = true;
  }

  loadTextFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const textParam = urlParams.get('text');

    if (textParam) {
      // Decode and set the text from URL parameter
      this.textInput.value = decodeURIComponent(textParam);
    }
  }

  createBaseImage() {
    // Load the base image from nicoG.jpg
    this.baseImage = new Image();
    this.baseImage.onload = () => {
      // Set canvas dimensions to match the loaded image
      this.canvas.width = this.baseImage.width;
      this.canvas.height = this.baseImage.height;

      // Check if we have text from URL, otherwise use default
      const currentText = this.textInput.value.trim() || 'Your meme text here!';
      this.renderMeme(currentText);
    };
    this.baseImage.onerror = () => {
      console.error('Failed to load nicoG.jpg');
      // Fallback: create a simple colored background
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = 600;
      tempCanvas.height = 400;
      tempCtx.fillStyle = '#cccccc';
      tempCtx.fillRect(0, 0, 600, 400);
      tempCtx.fillStyle = '#000000';
      tempCtx.font = "bold 24px 'Inter', Arial, sans-serif";
      tempCtx.textAlign = 'center';
      tempCtx.fillText('Image not found', 300, 200);
      this.baseImage.src = tempCanvas.toDataURL();
    };
    this.baseImage.src = 'nicoG.jpg';
  }

  bindEvents() {
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

  wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (let word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = this.ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
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
    let fontSize = Math.max(42, Math.min(60, 1000 / text.length));
    this.ctx.font = `bold ${fontSize}px 'Inter', Arial, sans-serif`;

    // Position text at the top
    const x = this.canvas.width / 2;
    const y = 60;

    // Calculate max width for text wrapping (90% of canvas width)
    const maxWidth = this.canvas.width * 0.9;

    // Wrap text into multiple lines
    const lines = this.wrapText(text, maxWidth);

    // Calculate line height
    const lineHeight = fontSize * 1.2;

    // Draw each line of text
    lines.forEach((line, index) => {
      const lineY = y + index * lineHeight;

      // Draw shadow first (slightly offset)
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillText(line, x + 3, lineY + 3);

      // Draw main text with stroke and fill
      this.ctx.strokeText(line, x, lineY);
      this.ctx.fillStyle = 'white';
      this.ctx.fillText(line, x, lineY);
    });

    // Enable download button
    this.downloadBtn.disabled = false;
  }

  downloadMeme() {
    // Generate a random suffix (4 characters)
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const filename = `nico-g_${randomSuffix}.png`;

    const link = document.createElement('a');
    link.download = filename;
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
