import { Velocity } from '../sprites';
import { Animation } from '../sprites';
import { key } from '../constants';

export function controlAgentMovements(
  playerControlledAgent: any,
  cursors: any,
) {
  // agent movement controls
  const { anims, body } = playerControlledAgent;
  const prevVelocity = body.velocity.clone();

  // Stop any previous movement from the last frame
  body.setVelocity(0);

  // Horizontal movement
  switch (true) {
    case cursors.left.isDown:
    case cursors.a.isDown:
      body.setVelocityX(-Velocity.Horizontal);
      break;

    case cursors.right.isDown:
    case cursors.d.isDown:
      body.setVelocityX(Velocity.Horizontal);
      break;
  }

  // Vertical movement
  switch (true) {
    case cursors.up.isDown:
    case cursors.w.isDown:
      body.setVelocityY(-Velocity.Vertical);
      break;

    case cursors.down.isDown:
    case cursors.s.isDown:
      body.setVelocityY(Velocity.Vertical);
      break;
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  body.velocity.normalize().scale(Velocity.Horizontal);

  // Update the animation last and give left/right animations precedence over up/down animations
  switch (true) {
    case cursors.left.isDown:
    case cursors.a.isDown:
      anims.play(Animation.Left, true);
      playerControlledAgent.moveSelector(Animation.Left);
      break;

    case cursors.right.isDown:
    case cursors.d.isDown:
      anims.play(Animation.Right, true);
      playerControlledAgent.moveSelector(Animation.Right);
      break;

    case cursors.up.isDown:
    case cursors.w.isDown:
      anims.play(Animation.Up, true);
      playerControlledAgent.moveSelector(Animation.Up);
      break;

    case cursors.down.isDown:
    case cursors.s.isDown:
      anims.play(Animation.Down, true);
      playerControlledAgent.moveSelector(Animation.Down);
      break;

    default:
      anims.stop();

      // If we were moving, pick an idle frame to use
      switch (true) {
        case prevVelocity.x < 0:
          playerControlledAgent.setTexture(key.atlas.player, 'misa-left');
          playerControlledAgent.moveSelector(Animation.Left);
          break;

        case prevVelocity.x > 0:
          playerControlledAgent.setTexture(key.atlas.player, 'misa-right');
          playerControlledAgent.moveSelector(Animation.Right);
          break;

        case prevVelocity.y < 0:
          playerControlledAgent.setTexture(key.atlas.player, 'misa-back');
          playerControlledAgent.moveSelector(Animation.Up);
          break;

        case prevVelocity.y > 0:
          playerControlledAgent.setTexture(key.atlas.player, 'misa-front');
          playerControlledAgent.moveSelector(Animation.Down);
          break;
      }
  }
}

export interface AgentPerspectiveKeyMapping{
    activateIndex: number;
    triggerKey: any;
}

export function setupKeyListeners(
    controlMapping: AgentPerspectiveKeyMapping[], 
    input: Phaser.Input.InputPlugin
): Map<number, Phaser.Input.Keyboard.Key> {
    const keyMap = new Map<number, Phaser.Input.Keyboard.Key>();
    controlMapping.forEach(mapping => {
        keyMap.set(mapping.triggerKey, input.keyboard!.addKey(mapping.triggerKey));
    });
    return keyMap;
}

export function controlPlayerPerspective(
    controlMapping: AgentPerspectiveKeyMapping[], 
    cameras: any,
    controllableCharacters: any,
    input: any
){
    controlMapping.forEach((mapping: AgentPerspectiveKeyMapping) => {
        updatePlayerPerspective(cameras, controllableCharacters, mapping.activateIndex, input, mapping.triggerKey);
    });
}

function updatePlayerPerspective(
    cameras: any, 
    controllableCharacters: any, 
    activateIndex: number, 
    input: any, 
    triggerKey:any
) {
    if (input.keyboard!.checkDown(input.keyboard!.addKey(triggerKey), 250)) {
        cameras.main.startFollow(controllableCharacters[activateIndex]); 
        controllableCharacters.forEach((agent: any) => {
        agent.changeNameTagColor("#ffffff");
        })
        controllableCharacters[activateIndex].changeNameTagColor("#ff0000");
    }
}

export function initKeyboardInputs(this: any){
  return (this.input.keyboard
        ? this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            one: Phaser.Input.Keyboard.KeyCodes.ONE,
            seven: Phaser.Input.Keyboard.KeyCodes.SEVEN,
            eight: Phaser.Input.Keyboard.KeyCodes.EIGHT,
            nine: Phaser.Input.Keyboard.KeyCodes.NINE,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
          })
        : null);
}
