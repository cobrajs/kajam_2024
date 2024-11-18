export function spaceFlight({ maxSpeed }) {
	return {
		id: 'spaceFlight',
		require: ['pos'],
		add() {
			this.moveVec = vec2(0)
			this.velocity = vec2(0)
		},
		update() {
			if (!this.moveVec.isZero()) {
				this.velocity = this.velocity.add(this.moveVec.unit().scale(maxSpeed / 20))
				if (this.velocity.len() > maxSpeed) {
					this.velocity = this.velocity.unit().scale(maxSpeed)
				}
			} else {
				this.velocity = this.velocity.lerp(vec2(0), 0.1)
				if (this.velocity.len() < 10) {
					this.velocity = vec2(0)
				}
			}

			if (!this.velocity.isZero()) {
				this.velocity.x = Math.round(this.velocity.x)
				this.velocity.y = Math.round(this.velocity.y)
				this.move(this.velocity)
			}
		}
	}
}

