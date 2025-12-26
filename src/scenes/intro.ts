/**
 * Intro/Backstory Scene
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
  Actor,
  TextAlign,
} from "excalibur";
import { Config } from "../config";

export class IntroScene extends Scene {
  private keyHandler?: (evt: any) => void;
  private clickHandler?: (evt: any) => void;

  public onInitialize() {
    // Set background color - dark blue winter night
    this.backgroundColor = Color.fromHex("#0a1628");

    // Add decorative snow gradient at bottom
    // const snowGround = new Actor({
    //   pos: new Vector(Config.GAME_WIDTH / 2, Config.GAME_HEIGHT - 50),
    //   width: Config.GAME_WIDTH,
    //   height: 100,
    //   color: Color.fromHex("#e8f4f8"),
    //   z: -1,
    // });
    // this.add(snowGround);

    // Title
    const titleText = new Label({
      text: "FROSTY'S REVENGE",
      pos: new Vector(Config.GAME_WIDTH / 2, 60),
      font: new Font({
        family: '"Jacquard 12", system-ui',
        size: 48,
        textAlign: TextAlign.Center,
        unit: FontUnit.Px,
        color: Color.fromHex("#ff4444"), // Red for revenge theme
        shadow: {
          blur: 10,
          offset: new Vector(3, 3),
          color: Color.Black,
        },
      }),
    });
    this.add(titleText);

    // Backstory text - line by line for better control
    const storyLines = [
      "In the future, Earth's population exploded.",
      "Too many children. Not enough presents.",
      "",
      "Desperate to keep Christmas alive,",
      "Santa Claus made a terrible choice —",
      "he enslaved the Snowmen, forcing them",
      "to work endlessly in frozen factories.",
      "",
      "But Frosty the Snowman managed to escape.",
      "",
      "Now armed with snowballs and",
      "pure determination, Frosty battles through",
      "Santa's Elves on a path straight",
      "to Santa himself.",
      "",
    ];

    let yPosition = 130;
    const lineHeight = 24;

    storyLines.forEach((line) => {
      // Determine color and size based on content
      let textColor = Color.fromHex("#d4e8f0"); // Light blue-white for most text
      let fontSize = 20;

      // Highlight certain dramatic lines
      if (line.includes("enslaved the Snowmen")) {
        textColor = Color.fromHex("#ffaa00"); // Orange for drama
      } else if (line.includes("Frosty the Snowman")) {
        textColor = Color.fromHex("#88ddff"); // Bright blue for hero
        fontSize = 22;
      } else if (line.includes("revenge")) {
        textColor = Color.fromHex("#ff4444"); // Red for revenge
        fontSize = 26;
      } else if (line.includes("terrible choice")) {
        textColor = Color.fromHex("#ff6666"); // Light red
      }

      const storyLabel = new Label({
        text: line,
        pos: new Vector(Config.GAME_WIDTH / 2, yPosition),
        font: new Font({
          family: '"Jacquard 12", system-ui',
          size: fontSize,
          textAlign: TextAlign.Center,
          unit: FontUnit.Px,
          color: textColor,
          shadow: {
            blur: 4,
            offset: new Vector(2, 2),
            color: Color.Black,
          },
        }),
      });
      this.add(storyLabel);

      yPosition += lineHeight;
    });

    // Add instruction text at bottom with pulsing effect
    const instructionText = new Label({
      text: "Press SPACE or Click to Begin",
      pos: new Vector(Config.GAME_WIDTH / 2, Config.GAME_HEIGHT - 60),
      font: new Font({
        family: '"Jacquard 12", system-ui',
        size: 24,
        unit: FontUnit.Px,
        textAlign: TextAlign.Center,
        color: Color.fromHex("#ffff00"), // Bright yellow for visibility
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

    // Add some decorative snowflakes
    this.createSnowflakes();
  }

  private createSnowflakes(): void {
    // Create a few decorative snowflakes
    for (let i = 0; i < 15; i++) {
      const snowflake = new Actor({
        pos: new Vector(
          Math.random() * Config.GAME_WIDTH,
          Math.random() * Config.GAME_HEIGHT,
        ),
        width: 4,
        height: 4,
        color: Color.White,
        z: -0.5,
      });

      // Slow falling animation
      const fallSpeed = 20 + Math.random() * 30;
      const drift = (Math.random() - 0.5) * 20;

      snowflake.on("preupdate", (evt) => {
        snowflake.pos.y += (fallSpeed * evt.delta) / 1000;
        snowflake.pos.x += (drift * evt.delta) / 1000;

        // Reset to top when it falls off bottom
        if (snowflake.pos.y > Config.GAME_HEIGHT) {
          snowflake.pos.y = -10;
          snowflake.pos.x = Math.random() * Config.GAME_WIDTH;
        }
      });

      this.add(snowflake);
    }
  }

  public onActivate() {
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
        this.engine.goToScene("tagline");
      }
    };

    // Create new click listener
    this.clickHandler = () => {
      this.engine.goToScene("tagline");
    };

    // Listen for space key or click to continue to tagline
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
  }
}
