let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  zoomLevel = 1; 

  init(paper) {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;

    if (isTouchDevice) {
      paper.addEventListener('touchstart', (e) => this.onTouchStart(e, paper));
      paper.addEventListener('touchmove', (e) => this.onTouchMove(e, paper));
      paper.addEventListener('touchend', () => this.onTouchEnd());
      paper.addEventListener('gesturestart', (e) => this.onGestureStart(e, paper));
      paper.addEventListener('gesturechange', (e) => this.onGestureChange(e, paper));
      paper.addEventListener('gestureend', () => this.onGestureEnd());
    } else {
      document.addEventListener('mousemove', (e) => this.onMouseMove(e, paper));
      paper.addEventListener('mousedown', (e) => this.onMouseDown(e, paper));
      window.addEventListener('mouseup', () => this.onMouseUp());
    }
  }

  onTouchStart(e, paper) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;
    paper.style.zIndex = highestZ;
    highestZ += 1;

    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.prevMouseX = this.touchStartX;
    this.prevMouseY = this.touchStartY;

    // Change cursor to heart emoji when touching
    paper.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'%3E%3Ctext x=\'4\' y=\'24\' font-size=\'24\' fill=\'red\'%3E❤️%3C/text%3E%3C/svg%3E") 16 16, auto';
    e.preventDefault();
  }

  onTouchMove(e, paper) {
    e.preventDefault();
    this.touchMoveX = e.touches[0].clientX;
    this.touchMoveY = e.touches[0].clientY;

    this.velX = this.touchMoveX - this.prevMouseX;
    this.velY = this.touchMoveY - this.prevMouseY;

    const dirX = this.touchMoveX - this.touchStartX;
    const dirY = this.touchMoveY - this.touchStartY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = (180 * angle) / Math.PI;
    degrees = (360 + Math.round(degrees)) % 360;

    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }

      this.prevMouseX = this.touchMoveX;
      this.prevMouseY = this.touchMoveY;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg) scale(${this.zoomLevel})`;
    }
  }

  onTouchEnd() {
    this.holdingPaper = false;
    this.rotating = false;
    this.zoomLevel = 1; 

    // Reset cursor back to default when touch ends
    const paper = document.querySelector('.paper');
    paper.style.cursor = 'default';
  }

  onGestureStart(e, paper) {
    e.preventDefault();
    this.zoomLevel = e.scale;
  }

  onGestureChange(e, paper) {
    e.preventDefault();
    this.zoomLevel = e.scale;
    paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg) scale(${this.zoomLevel})`;
  }

  onGestureEnd() {
    this.zoomLevel = 1;
  }

  onMouseDown(e, paper) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;

    paper.style.zIndex = highestZ;
    highestZ += 1;

    // Change cursor to heart emoji when mouse is down
    paper.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'%3E%3Ctext x=\'4\' y=\'24\' font-size=\'24\' fill=\'red\'%3E❤️%3C/text%3E%3C/svg%3E") 16 16, auto';

    if (e.button === 0) {
      this.mouseTouchX = this.mouseX;
      this.mouseTouchY = this.mouseY;
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;
    }
    if (e.button === 2) {
      this.rotating = true;
    }
  }

  onMouseMove(e, paper) {
    if (!this.rotating) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;
    }

    const dirX = e.clientX - this.mouseTouchX;
    const dirY = e.clientY - this.mouseTouchY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = (180 * angle) / Math.PI;
    degrees = (360 + Math.round(degrees)) % 360;
    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg) scale(${this.zoomLevel})`;
    }
  }

  onMouseUp() {
    this.holdingPaper = false;
    this.rotating = false;
  
    // Reset cursor to heart emoji when mouse up stlye In C
    const paper = document.querySelector('.paper');
    paper.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\' viewBox=\'0 0 48 48\'%3E%3Ccircle cx=\'24\' cy=\'24\' r=\'22\' fill=\'none\' stroke=\'#ff0000\' stroke-width=\'2\' /%3E%3Ctext x=\'10\' y=\'30\' font-size=\'24\' fill=\'#ff0000\'%3E❤️%3C/text%3E%3C/svg%3E") 24 24, auto';
  }
  
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
