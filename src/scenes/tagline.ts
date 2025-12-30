/**
 * Tagline Scene - Final dramatic reveal
 * Frosty's Revenge
 */

import {
  Scene,
  Color,
  Label,
  Vector,
  Font,
  FontUnit,
  Input,
  ImageSource,
  Actor,
  TextAlign,
} from "excalibur";
import { Config } from "../config";

export class TaglineScene extends Scene {
  private keyHandler?: (evt: any) => void;
  private clickHandler?: (evt: any) => void;
  private backgroundImage?: ImageSource;
  private backgroundActor?: Actor;

  public onInitialize() {
    // Load background image
    this.backgroundImage = new ImageSource("homescreen/image.jpg");
  }

  public async onActivate() {
    // Load the background image if not already loaded
    if (this.backgroundImage && !this.backgroundImage.isLoaded()) {
      await this.backgroundImage.load();
    }

    // Create background actor with the image
    if (this.backgroundImage && this.backgroundImage.isLoaded()) {
      const sprite = this.backgroundImage.toSprite();

      // Scale sprite to cover the entire screen
      const scaleX = Config.GAME_WIDTH / this.backgroundImage.width;
      const scaleY = Config.GAME_HEIGHT / this.backgroundImage.height;
      const scale = Math.max(scaleX, scaleY);

      sprite.scale.x = scale;
      sprite.scale.y = scale;

      this.backgroundActor = new Actor({
        pos: new Vector(Config.GAME_WIDTH / 2, Config.GAME_HEIGHT / 2),
        z: -100,
      });

      this.backgroundActor.graphics.use(sprite);
      this.add(this.backgroundActor);
    }

    // Add dark overlay for better text readability
    const overlay = new Actor({
      pos: new Vector(Config.GAME_WIDTH / 2, Config.GAME_HEIGHT / 2),
      width: Config.GAME_WIDTH,
      height: Config.GAME_HEIGHT,
      color: Color.fromRGB(0, 0, 0, 0.6),
      z: -50,
    });
    this.add(overlay);

    // First line: "This isn't about saving Christmas."
    const line1 = new Label({
      text: "This isn't about saving Christmas.",
      pos: new Vector(Config.GAME_WIDTH / 2, Config.GAME_HEIGHT / 2 - 40),
      font: new Font({
        family: '"Jacquard 12", system-ui',
        size: 32,
        unit: FontUnit.Px,
        color: Color.fromHex("#d4e8f0"),
        textAlign: TextAlign.Center,
        shadow: {
          blur: 8,
          offset: new Vector(3, 3),
          color: Color.Black,
        },
      }),
    });
    this.add(line1);

    // Second line: "It's about revenge." - larger and red
    const line2 = new Label({
      text: "It's about revenge.",
      pos: new Vector(Config.GAME_WIDTH / 2, Config.GAME_HEIGHT / 2 + 40),
      font: new Font({
        family: '"Jacquard 12", system-ui',
        size: 56,
        unit: FontUnit.Px,
        color: Color.fromHex("#ff4444"),
        textAlign: TextAlign.Center,
        shadow: {
          blur: 12,
          offset: new Vector(4, 4),
          color: Color.Black,
        },
      }),
    });
    this.add(line2);

    // Add instruction text at bottom with pulsing effect
    const instructionText = new Label({
      text: "Press SPACE or Click to Begin",
      pos: new Vector(Config.GAME_WIDTH / 2, Config.GAME_HEIGHT - 80),
      font: new Font({
        family: '"Jacquard 12", system-ui',
        size: 28,
        unit: FontUnit.Px,
        color: Color.fromHex("#ffff00"),
        textAlign: TextAlign.Center,
        shadow: {
          blur: 6,
          offset: new Vector(2, 2),
          color: Color.Black,
        },
      }),
    });
    this.add(instructionText);

    // Animate instruction text (pulsing)
    let pulseTime = 0;
    this.on("preupdate", (evt) => {
      pulseTime += evt.delta;
      const opacity = 0.5 + Math.sin(pulseTime / 300) * 0.5;
      instructionText.graphics.opacity = opacity;
    });

    // Remove old listeners if they exist
    if (this.keyHandler) {
      this.engine.input.keyboard.off("press", this.keyHandler);
    }
    if (this.clickHandler) {
      this.engine.input.pointers.primary.off("down", this.clickHandler);
    }

    // Create new keyboard listener
    this.keyHandler = (evt) => {
      if (evt.key === Input.Keys.Space) {
        this.engine.goToScene("level");
      }
    };

    // Create new click listener
    this.clickHandler = () => {
      this.engine.goToScene("level");
    };

    // Listen for space key or click to start game
    this.engine.input.keyboard.on("press", this.keyHandler);
    this.engine.input.pointers.primary.on("down", this.clickHandler);
  }

  public onDeactivate() {
    // Clean up listeners when leaving scene
    if (this.keyHandler) {
      this.engine.input.keyboard.off("press", this.keyHandler);
      this.keyHandler = undefined;
    }
    if (this.clickHandler) {
      this.engine.input.pointers.primary.off("down", this.clickHandler);
      this.clickHandler = undefined;
    }

    // Clear the scene
    this.clear();
  }
}
