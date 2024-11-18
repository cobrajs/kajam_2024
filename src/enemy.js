import 'kaplay/global'

import {
	weapon, 
	PEA_SHOOTER, SINGLE, DOUBLE, WAVE, LASER, MISSILE,
} from './components/weapon'

import { spaceFlight } from './components/spaceFlight'
import { followScript } from './components/followScript'
import { firing, STRAIGHT, TARGET_LOCK, OVER_TARGET } from './components/firing'

import { addBigExplosion } from './explosion'

const ENEMY_SPEED = 200

const FOLLOW = 0
const SIDE_TO_SIDE = 1

export const BASIC_ENEMY = 'basic'
export const BASIC_FAST_ENEMY = 'basicfast'
export const DOUBLER_ENEMY = 'doubler'
export const SPREADER_ENEMY = 'spreader'
export const PEWPEW_ENEMY = 'pewpew'
export const LAUNCHY_ENEMY = 'launchy'
export const BADBOY_ENEMY = 'badboy'

export const enemyTypes = [{
	name: BASIC_ENEMY,
	frame: 38,
	hurtFrame: 39,
	weaponType: SINGLE,
	speed: 150,
	firingStyle: {
		interval: 1.2,
		style: STRAIGHT,
	},
	points: 200
}, {
	name: BASIC_FAST_ENEMY,
	frame: 38,
	hurtFrame: 39,
	weaponType: SINGLE,
	speed: 200,
	firingStyle: {
		interval: 1,
		style: OVER_TARGET,
	},
	points: 300
}, {
	name: DOUBLER_ENEMY,
	frame: 40,
	hurtFrame: 41,
	weaponType: DOUBLE,
	speed: 150,
	firingStyle: {
		interval: 1,
		style: STRAIGHT,
	},
	points: 400
}, {
	name: SPREADER_ENEMY,
	frame: 52,
	hurtFrame: 53,
	weaponType: WAVE,
	speed: 150,
	firingStyle: {
		interval: 1,
		style: STRAIGHT,
	},
	points: 600
}, {
	name: PEWPEW_ENEMY,
	frame: 42,
	hurtFrame: 43,
	weaponType: LASER,
	speed: 200,
	firingStyle: {
		interval: 1,
		style: OVER_TARGET,
	},
	points: 600
}, {
	name: LAUNCHY_ENEMY,
	frame: 54,
	hurtFrame: 55,
	weaponType: MISSILE,
	speed: 200,
	firingStyle: {
		interval: 1.5,
		style: STRAIGHT,
	},
	points: 800
}, {
	name: BADBOY_ENEMY,
	frame: 36,
	hurtFrame: 37,
	weaponType: WAVE,
	//shipUpgradeType: SHIELD,
	speed: 200,
	firingStyle: {
		interval: 1,
		style: TARGET_LOCK,
	},
	points: 2000
}]

export function getEnemyByName(name) {
	return enemyTypes.find(({ name: enemyName }) => name === enemyName)
}

export default function addEnemy({
	startPos,
	frame = 36,
	hurtFrame = 36,
	speed = ENEMY_SPEED,
	weaponType = SINGLE,
	firingStyle = { style: STRAIGHT, interval: 1 },
	script = null,
	points = 200
} = {}) {

	if (!startPos) {
		startPos = vec2(width() / 2, -32)
	}

	const enemy = add([
		pos(startPos),
		sprite('sheet', { frame }),
		anchor('center'),
		layer('enemies'),
		weapon(weaponType),
		health(2),
		spaceFlight({ maxSpeed: speed }),
		firing(firingStyle),
		area({ shape: new Rect(vec2(0), 22, 22) }),
		'enemy',
		{
			firingDirection: Vec2.DOWN,
			moveStyle: SIDE_TO_SIDE,
			target: null,
			hurtFrame,
			points
		}
	])

	if (script) {
		enemy.use(followScript(script))
	}

	enemy.onUpdate(() => {
		if (enemy.target) {
			enemy.moveVec = enemy.target.clone().sub(enemy.pos).unit()
		} else if (enemy.moveStyle === FOLLOW) {
			const player = get('player').pop()
			if (!player) {
				return
			}
			enemy.moveVec = player.pos.clone().sub(enemy.pos).unit()
		} else if (enemy.moveStyle === SIDE_TO_SIDE) {
			enemy.moveVec.y = 0
			enemy.velocity.y = 0
			if (!enemy.moveDir) {
				enemy.moveDir = Math.random() > 0.5 ? Vec2.LEFT : Vec2.RIGHT
			}
			if (enemy.moveDir.x > 0) {
				enemy.moveVec.x = 1
				if (enemy.pos.x > width() - width() / 4) {
					enemy.moveDir = Vec2.LEFT
				}
			} else {
				enemy.moveVec.x = -1
				if (enemy.pos.x < width() / 4) {
					enemy.moveDir = Vec2.RIGHT
				}
			}
		}
	})

	enemy.onCollide('bullet', (bullet) => {
		const { type: weaponType, tag } = bullet.from
		if (tag !== 'player') {
			return
		}

		enemy.hurt(bullet.power)

		enemy.frame = enemy.hurtFrame
	})

	enemy.onCollide('laser', (laser) => {
		const { type: weaponType, tag } = laser.from
		if (tag !== 'player') {
			return
		}

		enemy.hurt(laser.power)

		enemy.frame = enemy.hurtFrame
	})

	enemy.onDeath(() => {
		addBigExplosion(enemy.pos, 10)
		enemy.destroy()

		const player = get('player').pop()
		if (player) {
			player.score(enemy.points)
		}
	})

	return enemy
}


