import { addExplosion } from '../explosion'

export const SINGLE = 'single'
export const DOUBLE = 'double'
export const WAVE = 'wave'
export const SUPER_SPREAD = 'super_spread'
export const LASER = 'laser'
export const BOLT = 'bolt'
export const MISSILE = 'missile'
export const PEA_SHOOTER = 'pea_shooter'

export const WEAPON_LIST = [
	SINGLE, DOUBLE, WAVE, SUPER_SPREAD, LASER, BOLT, MISSILE
]

const COOLDOWN = 0.3

function getWaveAngles(baseDirection) {
	const baseAngle = baseDirection.angle()
	return [12, -12, -6, 6, 0].map((angle) => Vec2.fromAngle(baseAngle + angle))
}

const BULLET_LANE = 8
function addBullet({ position, direction, speed = 200, power = 2, fromInfo }) {
	let usePosition = position
	if (direction.x === 0) {
		usePosition = vec2(Math.round(position.x / BULLET_LANE) * BULLET_LANE, position.y)
	}

	const bullet = add([
		pos(usePosition),
		move(direction, speed),
		anchor('center'),
		sprite('sheet', { frame: power === 2 ? 80 : 83 }),
		offscreen({ destroy: true, distance: 10 }),
		layer('bullets'),
		rotate(direction.angle() + 90),
		area({ shape: new Rect(vec2(0), 8, 8) }),
		{
			from: fromInfo,
			power
		},
		'bullet'
	])

	play(power === 1 ? 'shot' : 'shot2', { detune: randi(-10, 10) * 20, volume: rand(0.7, 0.9) }) 

	bullet.onCollide('bullet', (otherBullet) => {
		if (otherBullet.from.tag !== bullet.from.tag) {
			otherBullet.destroy()
			bullet.destroy()
			if (bullet.from.tag === 'player') {
				addExplosion(bullet.pos.add(otherBullet.pos).scale(0.5))
				const player = get('player').pop()
				if (player) {
					player.score(50)
				}
			}
		}
	})
}

function addLaser({ position, direction, fromInfo }) {
	let midPointY, useHeight
	if (direction.y > 0) {
		useHeight = height() - position.y
		midPointY = useHeight / 2 + position.y
	} else {
		midPointY = position.y / 2
		useHeight = position.y
	}
	const bullet = add([
		pos(vec2(Math.floor(position.x / BULLET_LANE) * BULLET_LANE, midPointY)),
		anchor('center'),
		rect(8, useHeight),
		color(255, 255, 255),
		lifespan(0.08, { fade: 0.08 }),
		opacity(1),
		layer('bullets'),
		area(),
		{ 
			from: fromInfo,
			power: 2,
		},
		'laser'
	])

	play('laser', { detune: randi(-10, 10) * 5, volume: rand(0.7, 0.9) }) 

	bullet.onCollide('bullet', (otherBullet) => {
		if (otherBullet.from.tag !== bullet.from.tag) {
			otherBullet.destroy()
			addExplosion(otherBullet.pos)
			const player = get('player').pop()
			if (player) {
				player.score(50)
			}
		}
	})
}

function addMissile({ position, direction, target, speed = 100, fromInfo }) {
	const bullet = add([
		pos(position),
		anchor('center'),
		sprite('sheet', { frame: 81 }),
		offscreen({ destroy: true, distance: 10 }),
		layer('bullets'),
		rotate(direction.angle() + 90),
		area({ shape: new Rect(vec2(0), 8, 8) }),
		{
			from: fromInfo,
			target,
		},
		'bullet'
	])

	if (!target) {
		bullet.use(move(direction, speed))
	} else {
		bullet.onUpdate(() => {
			if (!bullet.target) {
				return
			}
			const directionVec = bullet.target.pos.sub(bullet.pos).unit()
			bullet.moveTo(bullet.target.pos, speed)
			bullet.angle = directionVec.angle() + 90
		})

		target.onDestroy(() => {
			bullet.target = null
			bullet.use(move(Vec2.fromAngle(bullet.angle), speed))
		})
	}

	bullet.onCollide('bullet', (otherBullet) => {
		if (otherBullet.from.tag !== bullet.from.tag) {
			otherBullet.destroy()
			bullet.destroy()
			if (bullet.from.tag === 'player') {
				addExplosion(bullet.pos.add(otherBullet.pos).scale(0.5))
			}

			if (otherBullet.from.tag === 'player') {
				const player = get('player').pop()
				if (player) {
					player.score(100)
				}
			}
		}
	})
}

export function weapon(type) {
	return {
		id: 'weapon',
		require: ['pos', 'sprite'],
		add() {
			this.cooldown = 0
			this.weaponType = type
		},
		update() {
			if (this.cooldown > 0) {
				this.cooldown -= dt()
			}
		},
		changeWeapon(newType) {
			this.weaponType = newType
			this.cooldown = 0
		},
		fire(firingDirection) {
			if (this.cooldown > 0) {
				return
			}

			if (!firingDirection) {
				firingDirection = this.firingDirection ?? Vec2.DOWN
			}

			const fromInfo = {}

			if (this.tags.length) {
				fromInfo.tag = this.tags[0]
			}
			if (this.weaponType) {
				fromInfo.type = this.weaponType
			}

			let firePower = 1.2
			switch (this.weaponType) {
				case PEA_SHOOTER:
					addBullet({ position: this.pos, direction: firingDirection, power: 1, fromInfo })
					break
				case SINGLE:
					addBullet({ position: this.pos, direction: firingDirection, fromInfo })
					firePower = 1.5
					break
				case DOUBLE:
					addBullet({ position: this.pos.add(vec2(-16, 0)), direction: firingDirection, fromInfo })
					addBullet({ position: this.pos.add(vec2(16, 0)), direction: firingDirection, fromInfo })
					firePower = 2
					break
				case WAVE:
					const angles = getWaveAngles(firingDirection)
					angles.forEach((angleVec) => {
						addBullet({ position: this.pos.add(angleVec.scale(10)), direction: angleVec, fromInfo })
					})
					firePower = 3
					break
				case LASER:
					addLaser({ position: this.pos, direction: firingDirection, fromInfo })
					firePower = 4
					break
				case MISSILE:
					let target = null
					if (this.is('player')) {
						const targets = get('enemy')
						if (targets.length) {
							target = choose(targets)
						}
					} else if (this.is('enemy')) {
						target = get('player').pop()
					}
					addMissile({ position: this.pos, direction: firingDirection, target, fromInfo })
					break
			}

			if (this.height) {
				if (!this.originalHeight) {
					this.originalHeight = this.height
				}
				tween(this.originalHeight / firePower, this.originalHeight, 0.4, (height) => this.height = height, easings.easeOutQuad)
			}

			this.cooldown = COOLDOWN
		}
	}
}


