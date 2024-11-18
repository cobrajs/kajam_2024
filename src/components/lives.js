export function lives(baseLives) {
	let lives = baseLives
	let gameOverFunc
	const getShipCount = () => get('ship_count', { recursive: true }).pop()
	return {
		id: 'lives',
		add() {
			const count = getShipCount()
			if (!count) {
				return
			}

			count.setNumbers(lives)
		},
		kill() {
			if (lives <= 0) {
				gameOverFunc()
				return
			}

			lives--

			const count = getShipCount()
			if (!count) {
				return
			}

			count.decrease()
			if (lives <= 0 && gameOverFunc) {
				gameOverFunc()
			}
		},
		getLives() {
			return lives
		},
		onGameOver (func) {
			gameOverFunc = func
		}
	}
}

