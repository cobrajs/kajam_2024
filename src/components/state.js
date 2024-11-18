export function state(startState) {
	let stateWatch = {}
	return {
		id: 'state',
		add() {
			this.state = startState
		},
		changeState(newState) {
			const oldState = this.state
			this.state = newState
			if (stateWatch[oldState]) {
				stateWatch[oldState].exit.forEach((func) => func(this))
			}
			if (stateWatch[newState]) {
				stateWatch[newState].enter.forEach((func) => func(this))
			}
		},
		enterState(state, func) {
			if (!stateWatch[state]) {
				stateWatch[state] = { enter: [], exit: [] }
			}
			stateWatch[state].enter.push(func)
		},
		exitState(state, func) {
			if (!stateWatch[state]) {
				stateWatch[state] = { enter: [], exit: [] }
			}
			stateWatch[state].exit.push(func)
		}
	}
}


