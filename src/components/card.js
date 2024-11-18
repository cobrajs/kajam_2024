import { PEA_SHOOTER, SINGLE, DOUBLE, WAVE, SUPER_SPREAD, LASER, BOLT, MISSILE } from './weapon'

export const DASH = 'dash'
export const SHIELD = 'shield'

export const WEAPON = 'weapon'
export const MOVEMENT = 'movement'

export function card(cardOpts) {
	return {
		id: 'card',
		require: ['pos'],
		add() {
			this.cardFrame = Math.random() > 0.5 ? 32 : 33
		},
		draw() {
			drawSprite({
				sprite: 'sheet',
				pos: this.pos,
				frame: cardOpts.type === WEAPON ? 49 : 48,
			})

			drawSprite({
				sprite: 'sheet',
				pos: this.pos,
				frame: this.cardFrame,
			})

			const offset = 4
			switch (cardOpts.subType) {
				case PEA_SHOOTER:
					drawSprite({
						sprite: 'sheet',
						pos: this.pos,
						frame: 83,
					})
					break
				case SINGLE:
					drawSprite({
						sprite: 'sheet',
						pos: this.pos,
						frame: 80,
					})
					break
				case DOUBLE:
					drawSprite({
						sprite: 'sheet',
						pos: this.pos.add(vec2(-offset, -offset / 2)),
						frame: 80,
					})
					drawSprite({
						sprite: 'sheet',
						pos: this.pos.add(vec2(offset, offset / 2)),
						frame: 80,
					})
					break
				case WAVE:
					drawSprite({
						sprite: 'sheet',
						pos: this.pos.add(vec2(-6, offset / 2)),
						frame: 80,
					})
					drawSprite({
						sprite: 'sheet',
						pos: this.pos.add(vec2(6, offset / 2)),
						frame: 80,
					})
					drawSprite({
						sprite: 'sheet',
						pos: this.pos.add(vec2(-3, 0)),
						frame: 80,
					})
					drawSprite({
						sprite: 'sheet',
						pos: this.pos.add(vec2(3, 0)),
						frame: 80,
					})
					drawSprite({
						sprite: 'sheet',
						pos: this.pos.add(vec2(0, -offset / 2)),
						frame: 80,
					})
					break
				case SUPER_SPREAD:
					break
				case LASER:
					drawSprite({
						sprite: 'sheet',
						pos: this.pos.add(vec2(0, 0)),
						frame: 82,
					})
					break
				case BOLT:
					break
				case MISSILE:
					drawSprite({
						sprite: 'sheet',
						pos: this.pos.add(vec2(0, 0)),
						frame: 81,
					})
					break

				case DASH:
					drawSprite({
						sprite: 'sheet',
						pos: this.pos.add(vec2(0, 0)),
						frame: 64,
					})
					break
				case SHIELD:
					drawSprite({
						sprite: 'sheet',
						pos: this.pos.add(vec2(0, 0)),
						frame: 65,
					})
					break
			}
		}
	}
}

