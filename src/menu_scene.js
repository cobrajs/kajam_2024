import addStarfield, { getStars } from './starfield'
import { numbers } from './components/numbers'

export default function menuScene() {
	scene('menu', ({ stars }) => {
		const starfield = addStarfield(stars)

		add([
			pos(width() / 2, height() / 2 + 64),
			text('space to\ncontinue'),
			anchor('center'),
			color(255, 255, 255),
			'bounce'
		])

		const title = add([
			pos(width() / 2, height() / 2 - 64),
			sprite('title'),
			anchor('center'),
			'bounce'
		])

		onUpdate('bounce', (c) => {
			c.moveBy(0, wave(-0.5, 0.5, time()))
		})


		const proceed = () => {
			go('game', getStars(starfield))
		}

		onMousePress(proceed)
		onButtonPress(proceed)
	})
}

