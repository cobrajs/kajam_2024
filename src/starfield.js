function addStar({ parent, top = false, position, size, rotation }) {
	if (!size) {
		size = Math.floor(Math.random() * 3)
	}
	if (!position) {
		position = vec2(Math.round(Math.random() * width()), top ? Math.round(Math.random() * -20) : Math.round(Math.random() * height()))
	}
	if (!rotation) {
		rotation = Math.round(Math.random() * 360)
	}
	parent.add([
		pos(position),
		move(Vec2.DOWN, size * 20 + 20),
		sprite('sheet', { frame: 128 + size }),
		rotate(rotation),
		color(90, 90, 90),
		offscreen({ destroy: true, distance: 20 }),
		'star',
		{
			size
		}
	])
}

export function getStars(starfield) {
	return {
		stars: starfield.get('star').map((star) => ({
			position: star.pos,
			size: star.size,
			rotation: star.angle
		}))
	}
}

export default function addStarfield(starPositions) {
	const starfield = add([
		pos(0, 0),
		layer('background'),
		rect(width(), height()),
		color(40, 40, 40),
	])

	if (starPositions) {
		starPositions.forEach((star) => addStar({ ...star, parent: starfield }))
	} else {
		Array(20).fill(0).forEach(() => addStar({ parent: starfield }))
	}

	onDestroy('star', () => {
		addStar({ parent: starfield, top: true })
	})

	return starfield
}

