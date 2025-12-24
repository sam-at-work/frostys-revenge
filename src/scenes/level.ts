/**
 * Level Scene - Main gameplay scene
 * Frosty's Revenge
 */

import { Scene, Color, Actor, Vector } from 'excalibur';
import { Config } from '../config';

export class LevelScene extends Scene {
  public onInitialize() {
    // Set background color
    this.backgroundColor = Color.fromHex(Config.COLORS.SKY);

    // Create ground platform
    this.createGround();
  }

  private createGround() {
    const ground = new Actor({
      pos: new Vector(Config.LEVEL.LENGTH / 2, Config.GAME_HEIGHT - Config.LEVEL.GROUND_HEIGHT / 2),
      width: Config.LEVEL.LENGTH,
      height: Config.LEVEL.GROUND_HEIGHT,
      color: Color.fromHex(Config.COLORS.GROUND),
    });

    ground.body.collisionType = 'fixed';
    this.add(ground);
  }
}
