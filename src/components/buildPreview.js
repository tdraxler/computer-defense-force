// The functions here are intended to be used with the Level scene only

// import Phaser from 'phaser';
import { CURRENT_ACTION, MAP_CONSTANTS } from '../constants';
import { Explosion } from '../components/explosion';
import { Turret } from '../components/turret';
import { TextPopup } from '../components/textPopup';
import Player from '../components/player';

const nearestTile = (num) => {
  return (MAP_CONSTANTS.T_SIZE * Math.floor(num / MAP_CONSTANTS.T_SIZE));
}

const nearestIndex = (num) => {
  return (Math.floor(num / MAP_CONSTANTS.T_SIZE));
}

// Add or remove a turret upon click
// Should be placed in Level.create()
export function setUpBuildSystem(scene) {
  // Cursor
  scene.input.setDefaultCursor('url(images/ui/cursors/default.png), pointer');

  // Valid build location (drawn on tilemap)
  scene.buildReady = scene.add.sprite(0, 0, 'build-ready', 1).setOrigin(0, 0);
  scene.turretPreview = scene.add.sprite(0, 0, 'firewall', 2).setOrigin(0, 0); // Placeholder texture. Gets changed
  scene.turretPreview.setAlpha(0.5);

  scene.input.on('pointerup', (pointer) => {
    let mapInd = (nearestIndex(pointer.worldY) * scene.tilemap.width + nearestIndex(pointer.worldX));
    let buildArea = scene.collidemap.layer.data[Math.floor(scene.input.activePointer.worldY / MAP_CONSTANTS.T_SIZE)][Math.floor(scene.input.activePointer.worldX / MAP_CONSTANTS.T_SIZE)].index;

    if (Player.action == CURRENT_ACTION.BUILD && buildArea == MAP_CONSTANTS.BUILD_AREA_INDEX) {
      if (scene.turretMap[mapInd] == null) {
        for (let i = 0; i < scene.turretData.length; i++) {
          if (Player.chosenTurret === scene.turretData[i].name && scene.turretData[i].buildCost <= Player.energy) {
            let projectile = scene.projectileData.find(x => x.type === scene.turretData[i].projectile)
            let newTurret = new Turret(
              scene,
              nearestTile(pointer.worldX) + MAP_CONSTANTS.T_SIZE / 2,
              nearestTile(pointer.worldY),
              scene.turretData[i],
              projectile
            );

            Player.energy -= scene.turretData[i].buildCost;

            scene.turrets.push(newTurret);
            scene.buildSfx.play();

            //sets turret to look at newest enemy on map, delete now works as well
            scene.turretMap[mapInd] = newTurret;
          } else if (Player.chosenTurret === scene.turretData[i].name && scene.turretData[i].buildCost > Player.energy) {
            scene.popups.push(new TextPopup(scene, pointer.worldX, pointer.worldY, 'Not enough energy!'));
          }
        }
      }
      else {
        console.log('occupied - can\'t build');
      }
    }
    else if (Player.action == CURRENT_ACTION.DEMOLISH) {
      if (scene.turretMap[mapInd] == null) {
        scene.popups.push(new TextPopup(scene, pointer.worldX, pointer.worldY, 'Nothing to demolish!'));
      }
      else {
        for(let i = 0; i < scene.turretData.length; i++) {
          if (Player.chosenTurret === scene.turretData[i].name) {
            Player.energy += Math.floor(scene.turretData[i].buildCost / 2);
          }
        }
        let toDelete = scene.turretMap[mapInd]; // Get object ref
        let turretsArrInd = scene.turrets.indexOf(toDelete);
        // Clean up and destroy it
        scene.delTurret.play();
        let explosion = new Explosion({scene, x: toDelete.x, y: toDelete.y, animKey: 'explosion-frames-demolish', framesCount: 12});
        explosion.setDepth(2000);
        toDelete.dismantle();
        toDelete.destroy();

        // Remove all references to it.
        scene.turrets.splice(turretsArrInd, 1);
        scene.turretMap[mapInd] = null;

        // Play demolish animation
        explosion.explode('explosion-anim-demolish');
      }
    }
    else {
      scene.popups.push(new TextPopup(scene, pointer.worldX, pointer.worldY, 'Can\'t build here!'));
    }
  });
}

// Update buildable area indicator
export function buildPreview(scene) {
  scene.input.activePointer.updateWorldPoint(scene.cameras.main);

  // Change sprite index if cursor position is a valid area to build in.
  let mapInd = scene.collidemap.getTileAt(
    Math.floor(scene.input.activePointer.worldX / MAP_CONSTANTS.T_SIZE),
    Math.floor(scene.input.activePointer.worldY / MAP_CONSTANTS.T_SIZE)
  );

  if (mapInd && mapInd.index == MAP_CONSTANTS.BUILD_AREA_INDEX) {  // 'B' (buildable) block
    scene.buildReady.setFrame(0);
  }
  else {
    scene.buildReady.setFrame(1);
  }
  scene.buildReady.x = (MAP_CONSTANTS.T_SIZE * Math.floor(scene.input.activePointer.worldX / MAP_CONSTANTS.T_SIZE));
  scene.buildReady.y = (MAP_CONSTANTS.T_SIZE * Math.floor(scene.input.activePointer.worldY / MAP_CONSTANTS.T_SIZE));
  scene.turretPreview.x = (MAP_CONSTANTS.T_SIZE * Math.floor(scene.input.activePointer.worldX / MAP_CONSTANTS.T_SIZE));
  scene.turretPreview.y = (MAP_CONSTANTS.T_SIZE * Math.floor(scene.input.activePointer.worldY / MAP_CONSTANTS.T_SIZE)) - 12;
  if (scene.turretPreview.texture.key != Player.chosenTurret) {
    scene.turretPreview.setTexture(Player.chosenTurret, 2);
  }

  if (Player.action != CURRENT_ACTION.BUILD && scene.turretPreview.visible) {
    scene.turretPreview.setVisible(false);
  }

  if (Player.action == CURRENT_ACTION.BUILD && !scene.turretPreview.visible) {
    scene.turretPreview.setVisible(true);
  }
}