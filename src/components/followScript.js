
export const SCRIPT_END = 'end'
export const SCRIPT_SET_TARGET = 'setTarget'
export const SCRIPT_REMOVE_TARGET = 'removeTarget'
export const SCRIPT_SET_POSITION = 'setPosition'
export const SCRIPT_DESTROY = 'destroy'

function toScreen(x, y) {
	return vec2(x * width(), y * height())
}

// Scripts are at double time, so 2 is 1 second in, etc.
export function followScript(script) {
	let counter = 0
	let lastCounter = null
	return {
		id: 'followScript',
		require: ['pos', 'spaceFlight', 'weapon'],
		update() {
			counter += dt() * 2
			const counterLookup = Math.floor(counter)
			if (counterLookup > lastCounter || lastCounter === null) {
				if (script[counterLookup]) {
					this.doScriptPart(script[counterLookup])
				}
			}
			lastCounter = counterLookup
		},
		doScriptPart(part) {
			if (part.length) {
				part.forEach(this.doScriptPart.bind(this))
				return
			}
			switch (part.action) {
				case SCRIPT_END:
					this.endScript()
					break
				case SCRIPT_SET_POSITION:
					const newPosition = toScreen(part.value[0], part.value[1])
					this.moveTo(newPosition)
					break
				case SCRIPT_SET_TARGET:
					const newTarget = toScreen(part.value[0], part.value[1])
					this.target = newTarget
					break
				case SCRIPT_REMOVE_TARGET:
					this.target = null
					break
				case SCRIPT_DESTROY:
					this.destroy()
					break
			}
		},
		endScript() {
			this.unuse('followScript')
		}
	}
}

