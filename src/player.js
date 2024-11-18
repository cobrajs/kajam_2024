import 'kaplay/global'

import {
	weapon, 
	PEA_SHOOTER, SINGLE, DOUBLE, WAVE, MISSILE, WEAPON_LIST
} from './components/weapon'
import { spaceFlight } from './components/spaceFlight'
import { displayUpgrades } from './components/displayUpgrades'
import { blink } from './components/blink'
import { state } from './components/state'
import { lives } from './components/lives'
import { score } from './components/score'

import { addBigExplosion } from './explosion'

const PLAYER_SPEED = 400

export default function addPlayer({ startPos, lifeCount }) {

	if (!startPos) {
		startPos = vec2(width() / 2, height() - 32)
	}

	const player = add([
		pos(startPos),
		sprite('sheet', { frame: 17 }),
		anchor('center'),
		weapon(PEA_SHOOTER),
		layer('player'),
		opacity(1),
		blink(),
		state('alive'),
		displayUpgrades(),
		spaceFlight({ maxSpeed: PLAYER_SPEED }),
		lives(lifeCount),
		area({ shape: new Rect(vec2(0), 18, 18) }),
		score(0),
		'player',
		{
			firingDirection: Vec2.UP,
		}
	])

	player.onUpdate(() => {
		if (player.state === 'dead') {
			return
		}

		player.moveVec = vec2(0)
		if (isButtonDown('left')) {
			player.moveVec.x = -1
		}
		if (isButtonDown('right')) {
			player.moveVec.x = 1
		}
		if (isButtonDown('up')) {
			player.moveVec.y = -1
		}
		if (isButtonDown('down')) {
			player.moveVec.y = 1
		}

		if (player.moveVec.x < 0) {
			player.frame = 19
		} else if (player.moveVec.x > 0) {
			player.frame = 18
		} else {
			player.frame = 17
		}

		if (isButtonPressed('fire')) {
			player.fire()
		}

		if (isButtonPressed('weaponPlus')) {
			let nextWeapon = WEAPON_LIST.findIndex((weapon) => weapon === player.weaponType) + 1
			if (nextWeapon >= WEAPON_LIST.length) {
				nextWeapon = 0
			}
			player.changeWeapon(WEAPON_LIST[nextWeapon])
			player.updateWeaponType(WEAPON_LIST[nextWeapon])
		}
		if (isButtonPressed('weaponMinus')) {
			let prevWeapon = WEAPON_LIST.findIndex((weapon) => weapon === player.weaponType) - 1
			if (prevWeapon < 0) {
				prevWeapon = WEAPON_LIST.length - 1
			}
			player.changeWeapon(WEAPON_LIST[prevWeapon])
			player.updateWeaponType(WEAPON_LIST[prevWeapon])
		}
	})

	player.onCollide('bullet', (bullet) => {
		if (player.isInvincible) {
			return
		}
		const { type: weaponType, tag }= bullet.from
		if (tag !== 'enemy') {
			return
		}

		player.changeWeapon(weaponType)
		player.updateWeaponType(weaponType)
		bullet.destroy()

		player.kill()
		player.changeState('dead')
	})

	player.onCollide('laser', (laser) => {
		if (player.isInvincible) {
			return
		}

		const { type: weaponType, tag } = laser.from
		if (tag !== 'enemy') {
			return
		}

		player.changeWeapon(weaponType)
		player.updateWeaponType(weaponType)

		player.kill()
		player.changeState('dead')
	})

	player.onCollide('rock', (rock) => {
		if (player.isInvincible) {
			return
		}

		player.changeWeapon(PEA_SHOOTER)
		player.updateWeaponType(PEA_SHOOTER)

		player.kill()
		player.changeState('dead')
	})

	player.enterState('alive', () => {
		player.isInvincible = false
	})

	player.enterState('dead', () => {
		player.opacity = 0
		player.isInvincible = true
		player.moveVec.x = 0
		player.moveVec.y = 0

		addBigExplosion(player.pos, 10)

		wait(0.5, () => {
			if (player.getLives() <= 0) {
				return
			}

			player.changeState('invincible')
		})
	})

	player.exitState('dead', () => {
		player.opacity = 1
		player.pos = vec2(width() / 2, height() - 32)
	})

	player.enterState('invincible', () => {
		player.isInvincible = true

		player.blink(5, () => {
			player.changeState('alive')
		})
	})

	return player
}

