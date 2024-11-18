const BLINK_TIME = 0.1
export function blink() {
	let blinking = false
	let blinkTimer = BLINK_TIME
	let blinkRepeat = 0
	let blinkDoneFunc

	return {
		id: 'blink',
		require: ['opacity'],
		blink(times, doneFunc) {
			blinking = true
			blinkTimer = BLINK_TIME
			blinkRepeat = times * 2
			blinkDoneFunc = doneFunc
		},
		stopBlink() {
			blinking = false
			this.opacity = 1
			if (blinkDoneFunc) {
				blinkDoneFunc()
				blinkDoneFunc = null
			}
		},
		update() {
			if (!blinking) {
				return
			}

			blinkTimer -= dt()
			if (blinkTimer < 0) {
				blinkRepeat--
				blinkTimer = BLINK_TIME
				this.opacity = this.opacity ? 0 : 1

				if (blinkRepeat < 0) {
					this.stopBlink()
				}
			}
		}
	}
}

