import addStarfield, { getStars } from './starfield'

export default function gameoverScene() {
	scene('gameover', ({ stars, score = 0, lost = false, destroyedEarth = false }) => {
		const starfield = addStarfield(stars)

		let finalText = 'You Win!'
		if (lost) {
			finalText = 'Game Over'
		} else if (destroyedEarth) {
			finalText = 'Why destroy\n  Earth??'
		}

		add([
			pos(width() / 2, height() / 3),
			text(finalText),
			anchor('center'),
			color(255, 255, 255),
		])

		add([
			pos(width() / 2, height() / 2 + 64),
			text(`Score\n ${score}`),
			anchor('center'),
			color(255, 255, 255),
		])

		let doProceed = false
		let canProceed = false
		const proceed = () => {
			if (!canProceed) {
				doProceed = true
				return
			}
			go('menu', getStars(starfield))
		}

		wait(2, () => {
			canProceed = true
			if (doProceed) {
				proceed()
			}
		})

		onMousePress(proceed)
		onButtonPress(proceed)
	})
}



