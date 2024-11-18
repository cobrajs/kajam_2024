import addStarfield, { getStars } from './starfield'
import { numbers } from './components/numbers'

export default function menuScene() {
	scene('menu', ({ stars }) => {
		const starfield = addStarfield(stars)

		add([
			pos(width() / 2, height() / 2),
			text('Space Game'),
			anchor('center'),
			color(255, 255, 255),
		])

		add([
			pos(width() / 2, height() / 2 + 64),
			text('space to\ncontinue'),
			anchor('center'),
			color(255, 255, 255),
		])


		const proceed = () => {
			go('game', getStars(starfield))
		}

		onMousePress(proceed)
		onButtonPress(proceed)
	})
}

