import addStarfield, { getStars } from './starfield'

export default function gameoverScene() {
	scene('gameover', ({ stars, score = 0 }) => {
		const starfield = addStarfield(stars)

		add([
			pos(width() / 2, height() / 2),
			text('Game Over'),
			anchor('center'),
			color(255, 255, 255),
		])

		add([
			pos(width() / 2, height() / 2 + 64),
			text(`Score\n${score}`),
			anchor('center'),
			color(255, 255, 255),
		])

		const proceed = () => {
			go('menu', getStars(starfield))
		}

		onMousePress(proceed)
		onButtonPress(proceed)
	})
}



