const NUMBER_WIDTH = 12
export function numbers({ numbers, size = 1, padding = 1}) {
	return {
		id: 'numbers',
		require: ['pos'],
		add() {
			this.renderNumber = String(numbers)
		},
		draw() {
			for (let x = 0; x < this.renderNumber.length; x++) {
				drawSprite({
					sprite: 'sheet',
					pos: this.pos.add(vec2((padding - this.renderNumber.length + x) * NUMBER_WIDTH * size, 0)),
					frame: Number(this.renderNumber[x]) + (size === 2 ? 96 : 112)
				})
			}
		},
		increase(amount = 1) {
			this.setNumbers(Number(this.renderNumber) + amount)
		},
		decrease(amount = 1) {
			this.increase(-amount)
		},
		setNumbers(newNumbers) {
			this.renderNumber = String(newNumbers)
		},
		getNumbers() {
			return Number(this.renderNumber)
		}
	}
}

