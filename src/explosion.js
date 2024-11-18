import 'kaplay/global'

export function addBigExplosion(position, spread = 10) {
	position = position.clone()
	for (let i = 0; i < 5; i++) {
		wait(i * 0.1, () => {
			addExplosion(position.add(vec2(
				Math.random() * (spread * 2) - spread,
				Math.random() * (spread * 2) - spread
			)))
		})
	}
}

export function addExplosion(position) {
	add([
		pos(position),
		rotate(Math.floor(Math.random() * 360)),
		anchor('center'),
		sprite('sheet', { anim: Math.random() > 0.5 ? 'explode1' : 'explode2' }),
		opacity(1),
		lifespan(0.5, { fade: 0.2 })
	])

	play('explosion', { detune: randi(-10, 10) * 5, volume: rand(0.8, 1.0) })
}

