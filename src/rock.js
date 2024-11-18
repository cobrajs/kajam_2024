import { addExplosion } from './explosion'

const ROCK_SPEED = 100

const BIG = 0
const SMALL = 1

export default function addRock({ startPos, direction = Vec2.DOWN, size = BIG }) {

	const rock = add([
		pos(startPos),
		sprite('sheet', { frame: size === BIG ? 68 : Math.random() > 0.5 ? 69 : 70 }),
		anchor('center'),
		layer('other'),
		rotate(Math.floor(Math.random() * 360)),
		health(1),
		move(direction, ROCK_SPEED),
		area({ shape: size === BIG ? new Rect(vec2(0), 22, 22) : new Rect(vec2(0), 12, 12) }),
		offscreen({ destroy: true }),
		'rock',
		{
			isInvincible: true
		}
	])

	wait(0.2, () => rock.isInvincible = false)

	const collider = (other) => {
		if (rock.isInvincible) {
			return false
		}
		rock.hurt()

		if (other.from && other.from.tag === 'player') {
			const player = get('player').pop()
			if (player) {
				player.score(50)
			}
		}
		return true
	}


	rock.onCollide('bullet', (other) => {
		if (!collider(other)) {
			return 
		}
		
		other.destroy()
	})
	rock.onCollide('laser', collider)
	rock.onCollide('player', (other) => {
		if (other.isInvincible) {
			return
		}

		collider()
	})

	rock.onDeath(() => {
		if (size === BIG) {
			addRock({ startPos: rock.pos, direction: Vec2.fromAngle(120 + Math.random() * 20 - 10), size: SMALL })
			addRock({ startPos: rock.pos, direction: Vec2.fromAngle(60 + Math.random() * 20 - 10), size: SMALL })
		}
		addExplosion(rock.pos)
		rock.destroy()
	})

	return rock
}



