export function score(startScore) {
	let score = startScore
	let scoreUpdateFunc = null

	return {
		id: 'score',
		score(amount) {
			score += amount

			if (scoreUpdateFunc) {
				scoreUpdateFunc(score)
			}
		},
		getScore() {
			return score
		},
		resetScore() {
			score = 0
		},
		onScoreUpdate(func) {
			scoreUpdateFunc = func
		}
	}
}
