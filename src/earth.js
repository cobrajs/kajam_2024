import 'kaplay/global'

import { addBigExplosion } from './explosion'

export default function addEarth() {

	const earth = add([
		pos(width() / 2, -64),
		sprite('earth'),
		anchor('center'),
		layer('other'),
		rotate(randi(-30, 30)),
		health(8),
		move(Vec2.DOWN, 50),
		area(),
		offscreen({ destroy: true }),
		'earth'
	])

	const collider = (other) => {
		if (other.from && other.from.tag === 'player') {
			earth.hurt(other.power || 1)
		}
	}

	earth.onCollide('bullet', (other) => {
		collider(other)
		
		other.destroy()
	})
	earth.onCollide('laser', collider)

	earth.onDeath(() => {
		addBigExplosion(earth.pos)
		earth.destroy()
	})

	return earth
}




