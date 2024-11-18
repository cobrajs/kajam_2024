import kaplay from 'kaplay';
import 'kaplay/global';

import gameScene from './game_scene'
import menuScene from './menu_scene'
import gameoverScene from './gameover_scene'

const k = kaplay({
	buttons: {
		left: {
			keyboard: ['left', 'a'],
			gamepad: ['west']
		},
		right: {
			keyboard: ['right', 'd'],
			gamepad: ['east']
		},
		up: {
			keyboard: ['up', 'w'],
			gamepad: ['north']
		},
		down: {
			keyboard: ['down', 's'],
			gamepad: ['south']
		},
		fire: {
			keyboard: ['space', 'z', 'j'],
			gamepad: ['a']
		},
		special: {
			keyboard: ['ctrl', 'x', 'k'],
			gamepad: ['b']
		},
		weaponPlus: {
			keyboard: ['m']
		},
		weaponMinus: {
			keyboard: ['n']
		}
	},
	crisp: true,
	touchToMouse: false,
	scale: 2
})

layers(['background', 'bullets', 'enemies', 'other', 'player', 'ui'], 'other')

loadSprite('bean', 'sprites/bean.png')
loadSprite('sheet', 'sprites/sheet.png', {
	sliceX: 16,
	sliceY: 9,
	anims: {
		explode1: { from: 84, to: 87, loop: false, speed: 8 },
		explode2: { from: 88, to: 91, loop: false, speed: 8 },
		laser: { from: 82, to: 83, loop: true, speed: 8 }
	},
})
loadSprite('earth', 'sprites/earth.png')
loadSprite('title', 'sprites/title.png')

loadSound('shot', 'sounds/shot.wav')
loadSound('shot2', 'sounds/shot2.wav')
loadSound('laser', 'sounds/laser.wav')
loadSound('explosion', 'sounds/explosion.wav')

loadMusic('dnbspace', 'music/dnb space.ogg')

gameScene()
menuScene()
gameoverScene()

go('menu', {})

