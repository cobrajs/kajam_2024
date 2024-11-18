export const STRAIGHT = 0
export const TARGET_LOCK = 1
export const OVER_TARGET = 2
export function firing({ style = STRAIGHT, interval = 0.5 }) {
	let target = null
	const setTarget = () => {
		target = get('player').pop()
	}
	const doFire = (self) => {
		// Don't fire if not on screen
		if (self.pos.x < 0 || self.pos.y < 0 || self.pos.x > width() || self.pos.y > height()) {
			return
		}
		if (style === TARGET_LOCK && target) {
			self.fire(target.pos.sub(self.pos).unit())
		} else {
			self.fire()
		}
	}
	return {
		id: 'firing',
		require: ['pos', 'weapon'],
		add() {
			this.firingTimer = interval
		},
		update() {
			if ((style === OVER_TARGET || style === TARGET_LOCK) && !target) {
				setTarget()
			}
			if (style === OVER_TARGET && target) {
				if (Math.abs(target.pos.x - this.pos.x) < 5) {
					wait(0.1, () => doFire(this))
				}
			} else if (style === STRAIGHT || style === TARGET_LOCK) {
				this.firingTimer -= dt()
				if (this.firingTimer < 0) {
					doFire(this)
					this.firingTimer = interval
				}
			}
		},
	}
}


