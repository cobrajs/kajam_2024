import 'kaplay/global'

import addPlayer from './player'
import addUI from './interface'
import addEnemy, {
	getEnemyByName, BASIC_ENEMY, BASIC_FAST_ENEMY, DOUBLER_ENEMY,
	SPREADER_ENEMY, PEWPEW_ENEMY, LAUNCHY_ENEMY, BADBOY_ENEMY
} from './enemy'
import addRock from './rock'
import addStarfield, { getStars } from './starfield'
import { addBigExplosion } from './explosion'

import { 
	SCRIPT_SET_POSITION, 
	SCRIPT_SET_TARGET, 
	SCRIPT_REMOVE_TARGET, 
	SCRIPT_END,
	SCRIPT_DESTROY,
} from './components/followScript'

const SCRIPT_ADD_ENEMIES = 'addEnemies'
const SCRIPT_ADD_TEXT = 'addText'
const SCRIPT_CHANGE_ROCK_DENSITY = 'changeRockDensity'
const SCRIPT_ADD_SPRITE = 'addSprite'

function genScriptFlyIn(y) {
	return {
		0: [{
			action: SCRIPT_SET_POSITION,
			value: [0.8, -0.1],
		}, {
			action: SCRIPT_SET_TARGET,
			value: [0.8, y],
		}],
		3: {
			action: SCRIPT_SET_TARGET,
			value: [0.5, 0.4],
		},
		6: {
			action: SCRIPT_SET_TARGET,
			value: [0.1, y],
		},
		9: { action: SCRIPT_REMOVE_TARGET },
		14: {
			action: SCRIPT_SET_TARGET,
			value: [0.1, -0.4],
		},
		15: { action: SCRIPT_DESTROY }
	}
}

function genFlyAcross(y) {
	const screenSide = Math.random() > 0.5 ? 0 : 1
	const direction = screenSide === 0 ? 1 : -1
	return {
		0: [{
			action: SCRIPT_SET_POSITION,
			value: [screenSide - direction * 0.1, y],
		}, {
			action: SCRIPT_SET_TARGET,
			value: [screenSide + direction * 0.5],
		}],
		4: {
			action: SCRIPT_REMOVE_TARGET,
		},
		15: {
			action: SCRIPT_SET_TARGET,
			value: [screenSide + direction * 1.2],
		},
		17: { action: SCRIPT_DESTROY }
	}
}

const level = {
	2: [{
		action: SCRIPT_ADD_ENEMIES,
		value: [
			{ type: BASIC_ENEMY, script: genScriptFlyIn(0.1) },
			{ type: BASIC_ENEMY, script: genScriptFlyIn(0.15), delay: 0.3 },
			{ type: BASIC_ENEMY, script: genScriptFlyIn(0.2), delay: 0.6 },
			{ type: BASIC_ENEMY, script: genScriptFlyIn(0.25), delay: 0.9 }
		]
	}],
	12: [{
		action: SCRIPT_ADD_ENEMIES,
		value: [
			{ type: DOUBLER_ENEMY, script: genScriptFlyIn(0.15) },
			{ type: DOUBLER_ENEMY, script: genScriptFlyIn(0.2), delay: 0.3 },
			{ type: BASIC_FAST_ENEMY, script: genScriptFlyIn(0.1), delay: 0.6 },
			{ type: BASIC_FAST_ENEMY, script: genScriptFlyIn(0.25), delay: 0.9 },
		]
	}],
	20: [{
		action: SCRIPT_ADD_ENEMIES,
		value: [
			{ type: PEWPEW_ENEMY, script: genScriptFlyIn(0.15) },
			{ type: PEWPEW_ENEMY, script: genScriptFlyIn(0.1), delay: 0.6 },
			{ type: BASIC_FAST_ENEMY, script: genScriptFlyIn(0.2), delay: 1 },
		]
	}],
	30: [{
		action: SCRIPT_ADD_ENEMIES,
		value: [
			{ type: SPREADER_ENEMY, script: genScriptFlyIn(0.2) },
			{ type: SPREADER_ENEMY, script: genScriptFlyIn(0.1), delay: 1 },
		]
	}],
	40: [{
		action: SCRIPT_ADD_TEXT,
		value: 'Incoming!',
	}],
	50: [{
		action: SCRIPT_ADD_ENEMIES,
		value: [
			{ type: BADBOY_ENEMY, script: genScriptFlyIn(0.1) },
			{ type: LAUNCHY_ENEMY, script: genScriptFlyIn(0.3), delay: 1 },
		]
	}],
	70: [{
		action: SCRIPT_END,
		value: 5
	}]
}

export default function gameScene() {
	scene('game', ({ lifeCount = 5, stars }) => {
		const ui = addUI()

		const player = addPlayer({ lifeCount })

		const starfield = addStarfield(stars)

		const loadLevelPart = (levelPart) => {
			if (levelPart.length) {
				levelPart.forEach(loadLevelPart)
				return
			}

			switch (levelPart.action) {
				case SCRIPT_ADD_ENEMIES:
					levelPart.value.forEach(({ type, delay = null, ...other }) => {
						const enemyConfig = { ...getEnemyByName(type), ...other }
						if (delay) {
							wait(delay, () => addEnemy(enemyConfig))
							return
						}
						addEnemy(enemyConfig)
					})
					break
				case SCRIPT_END:
					wait(levelPart.value, () => {
						go('gameover', getStars(starfield))
					})
					break
			}
		}

		let counter = 0
		let lastCounter = null
		onUpdate(() => {
			counter += dt()
			const counterLookup = Math.floor(counter)
			if (counterLookup > lastCounter) {
				if (level[counterLookup]) {
					loadLevelPart(level[counterLookup])
				}
			}
			lastCounter = counterLookup
		})

		/** TODO: Make this scoring work
		let score = 0
		player.onScore((amount) => {
			score += amount

			ui.updateScore()
		})
		*/

		loop(3, () => {
			addRock({ startPos: vec2(Math.random() * (width() - 40) + 20, -30), direction: Vec2.DOWN })
		})

		player.onGameOver(() => {
			addBigExplosion(player.pos, 20)
			wait(3, () => {
				go('gameover', getStars(starfield))
			})
		})
	})
}
