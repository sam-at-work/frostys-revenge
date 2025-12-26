/**
 * CustomLoader - Custom loading screen for Frosty's Revenge
 *
 * Displays a background image that fills the screen with a progress bar
 */

import { DefaultLoader, type Engine } from "excalibur";

export class CustomLoader extends DefaultLoader {
  private backgroundImage: HTMLImageElement | null = null;
  private imageLoaded = false;
  private playButtonElement: HTMLButtonElement | null = null;
  private fontLoaded = false;

  constructor() {
    super();

    // Preload the background image
    this.backgroundImage = new Image();
    this.backgroundImage.onload = () => {
      this.imageLoaded = true;
    };
    this.backgroundImage.src = "/homescreen/image.jpg";

    // Load the custom font
    this.loadFont();
  }

  private async loadFont(): Promise<void> {
    try {
      await document.fonts.load('96px "Jacquard 12"');
      if (document.fonts.check('96px "Jacquard 12"')) {
        this.fontLoaded = true;
      }
    } catch (err) {
      console.warn("Failed to load Jacquard 12 font, using fallback", err);
      this.fontLoaded = true; // Use fallback
    }
  }

  override async onUserAction(): Promise<void> {
    // Create a play button overlay to unlock audio
    return new Promise<void>((resolve) => {
      // Create button
      this.playButtonElement = document.createElement("button");
      this.playButtonElement.textContent = "Click to Start";
      this.playButtonElement.style.position = "absolute";
      this.playButtonElement.style.top = "60%";
      this.playButtonElement.style.left = "50%";
      this.playButtonElement.style.transform = "translate(-50%, -50%)";
      this.playButtonElement.style.padding = "20px 40px";
      this.playButtonElement.style.fontSize = "48px";
      this.playButtonElement.style.fontFamily = '"Jacquard 12", system-ui';
      this.playButtonElement.style.fontWeight = "400";
      this.playButtonElement.style.backgroundColor = "#ADD8E6";
      this.playButtonElement.style.color = "white";
      this.playButtonElement.style.textShadow =
        "2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px 0 black, -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black";
      this.playButtonElement.style.border = "none";
      this.playButtonElement.style.borderRadius = "10px";
      this.playButtonElement.style.cursor = "pointer";
      this.playButtonElement.style.zIndex = "10000";
      this.playButtonElement.style.boxShadow = "0 4px 6px rgba(0,0,0,0.3)";
      this.playButtonElement.style.opacity = "0.9";

      // Add hover effect
      this.playButtonElement.onmouseenter = () => {
        if (this.playButtonElement) {
          this.playButtonElement.style.backgroundColor = "#87CEEB";
        }
      };
      this.playButtonElement.onmouseleave = () => {
        if (this.playButtonElement) {
          this.playButtonElement.style.backgroundColor = "#ADD8E6";
        }
      };

      // Handle click
      this.playButtonElement.onclick = () => {
        if (this.playButtonElement) {
          this.playButtonElement.remove();
          this.playButtonElement = null;
        }
        resolve();
      };

      // Add to document
      document.body.appendChild(this.playButtonElement);
    });
  }

  override onDraw(ctx: CanvasRenderingContext2D): void {
    const canvas = ctx.canvas;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background image if loaded
    if (this.imageLoaded && this.backgroundImage) {
      // Calculate dimensions to cover the entire canvas while maintaining aspect ratio
      const imgAspect =
        this.backgroundImage.width / this.backgroundImage.height;
      const canvasAspect = canvasWidth / canvasHeight;

      let drawWidth: number,
        drawHeight: number,
        offsetX: number,
        offsetY: number;

      if (imgAspect > canvasAspect) {
        // Image is wider than canvas - fit to height
        drawHeight = canvasHeight;
        drawWidth = drawHeight * imgAspect;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      } else {
        // Image is taller than canvas - fit to width
        drawWidth = canvasWidth;
        drawHeight = drawWidth / imgAspect;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      }

      ctx.drawImage(
        this.backgroundImage,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight,
      );

      // Add a semi-transparent overlay to make the progress bar more visible
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    } else {
      // Fallback to a simple background color if image hasn't loaded yet
      ctx.fillStyle = "#87CEEB"; // Sky blue
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // Draw game title (higher up)
    ctx.font = this.fontLoaded
      ? '96px "Jacquard 12", system-ui'
      : "96px Arial, sans-serif";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.textAlign = "center";

    const titleText = "Frosty's Revenge";
    ctx.strokeText(titleText, canvasWidth / 2, 140);
    ctx.fillText(titleText, canvasWidth / 2, 140);

    // Draw progress bar background (bottom of screen)
    const barWidth = 400;
    const barHeight = 40;
    const barX = (canvasWidth - barWidth) / 2;
    const barY = canvasHeight - 100;

    // Progress bar border
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    // Progress bar background
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Progress bar fill
    const progress = this.progress; // Value between 0 and 1
    const progressWidth = barWidth * progress;

    // Progress bar fill (icy blue)
    ctx.fillStyle = "#ADD8E6";
    ctx.fillRect(barX, barY, progressWidth, barHeight);

    // Draw percentage text
    const percentText = `${Math.round(progress * 100)}%`;
    ctx.font = this.fontLoaded
      ? '48px "Jacquard 12", system-ui'
      : "48px Arial, sans-serif";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText(percentText, canvasWidth / 2, barY + barHeight / 2 + 8);
    ctx.fillText(percentText, canvasWidth / 2, barY + barHeight / 2 + 8);
  }

  override onUpdate(_engine: Engine, _elapsedMilliseconds: number): void {
    // Optional: You can add any animation or update logic here
    // For example, you could animate elements or track elapsed time
  }

  override async onBeforeLoad(): Promise<void> {
    // Called before loading starts
    // Can be used to prepare the screen or viewport
  }

  override async onAfterLoad(): Promise<void> {
    // Called after loading completes
    // Clean up the play button if it still exists
    if (this.playButtonElement) {
      this.playButtonElement.remove();
      this.playButtonElement = null;
    }
  }
}
