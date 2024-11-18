import 'kaplay/global'

import addPlayer from './player'
import addUI from './interface'
import addEnemy, {
	getEnemyByName, BASIC_ENEMY, BASIC_FAST_ENEMY, DOUBLER_ENEMY,
	SPREADER_ENEMY, PEWPEW_ENEMY, LAUNCHY_ENEMY, BADBOY_ENEMY
} from './enemy'
import addRock from './rock'
import addEarth from './earth'
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
const SCRIPT_ADD_EARTH = 'addEarth'

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
		18: { action: SCRIPT_DESTROY }
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
			value: [screenSide + direction * 0.5, y],
		}],
		4: {
			action: SCRIPT_REMOVE_TARGET,
		},
		15: {
			action: SCRIPT_SET_TARGET,
			value: [screenSide + direction * 1.2, y],
		},
		20: { action: SCRIPT_DESTROY }
	}
}

const level = {
	0: [
		{ action: SCRIPT_CHANGE_ROCK_DENSITY, value: -1 },
		{ action: SCRIPT_ADD_TEXT, value: 'Get ready!' },
	],
	2: [{
		action: SCRIPT_ADD_ENEMIES,
		value: [
			{ type: BASIC_ENEMY, script: genScriptFlyIn(0.1) },
			{ type: BASIC_ENEMY, script: genScriptFlyIn(0.15), delay: 0.5 },
			{ type: BASIC_ENEMY, script: genScriptFlyIn(0.2), delay: 1 },
			{ type: BASIC_ENEMY, script: genScriptFlyIn(0.25), delay: 1.5 }
		]
	}],
	10: [{ action: SCRIPT_CHANGE_ROCK_DENSITY, value: 3 }],
	20: [{
		action: SCRIPT_ADD_ENEMIES,
		value: [
			{ type: DOUBLER_ENEMY, script: genScriptFlyIn(0.15) },
			{ type: DOUBLER_ENEMY, script: genScriptFlyIn(0.2), delay: 0.5 },
			{ type: BASIC_FAST_ENEMY, script: genScriptFlyIn(0.1), delay: 1 },
			{ type: BASIC_FAST_ENEMY, script: genScriptFlyIn(0.25), delay: 1.5 },
		]
	}],
	23: [{ action: SCRIPT_CHANGE_ROCK_DENSITY, value: 2 }],
	28: [{
		action: SCRIPT_ADD_ENEMIES,
		value: [
			{ type: PEWPEW_ENEMY, script: genFlyAcross(0.1) },
			{ type: PEWPEW_ENEMY, script: genFlyAcross(0.2), delay: 0.5 },
			{ type: BASIC_ENEMY, script: genFlyAcross(0.25), delay: 2 },
			{ type: BASIC_ENEMY, script: genFlyAcross(0.3), delay: 2.5 },
		]
	}],
	38: [{
		action: SCRIPT_ADD_TEXT,
		value: 'Asteroid\n field!'
	}],
	40: [{ action: SCRIPT_CHANGE_ROCK_DENSITY, value: 0.5 }],
	50: [{ action: SCRIPT_CHANGE_ROCK_DENSITY, value: 2 }],
	52: [{
		action: SCRIPT_ADD_ENEMIES,
		value: [
			{ type: SPREADER_ENEMY, script: genScriptFlyIn(0.2) },
			{ type: SPREADER_ENEMY, script: genScriptFlyIn(0.1), delay: 1 },
		]
	}],
	58: [{
		action: SCRIPT_ADD_ENEMIES,
		value: [
			{ type: LAUNCHY_ENEMY, script: genFlyAcross(0.1) },
			{ type: LAUNCHY_ENEMY, script: genFlyAcross(0.3), delay: 2 },
		]
	}],
	66: [{
		action: SCRIPT_ADD_TEXT,
		value: 'Incoming!',
	}],
	68: [{
		action: SCRIPT_ADD_ENEMIES,
		value: [
			{ type: BADBOY_ENEMY, script: genScriptFlyIn(0.1) },
			{ type: BADBOY_ENEMY, script: genScriptFlyIn(0.2), delay: 3 },
		]
	}],
	78: [{
		action: SCRIPT_ADD_TEXT,
		value: 'You made it\n home!',
	}],
	80: [{ action: SCRIPT_ADD_EARTH }],
	84: [{
		action: SCRIPT_END,
		value: 4
	}]
}

export default function gameScene() {
	scene('game', ({ lifeCount = 5, stars }) => {
		const music = play('dnbspace')
		music.loop = true
		music.volume = 0.8

		const ui = addUI()

		const player = addPlayer({ lifeCount })

		const starfield = addStarfield(stars)

		let rockDensity = 3 // seconds between rocks
		let addedEarth = false

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
					const score = player.getScore()
					music.stop()
					wait(levelPart.value, () => {
						go('gameover', {
							score,
							lost: false,
							destroyedEarth: addedEarth && !get('earth').length,
							...getStars(starfield)
						})
					})
					break
				case SCRIPT_CHANGE_ROCK_DENSITY:
					rockDensity = levelPart.value
					break
				case SCRIPT_ADD_TEXT:
					add([
						pos(width() / 2, -20),
						anchor('center'),
						text(levelPart.value),
						move(Vec2.DOWN, 50),
						lifespan(3, { fade: 2}),
						opacity(1),
						layer('ui'),
					])
					break
				case SCRIPT_ADD_SPRITE:
					add([
						pos(width() / 2, -64),
						move(Vec2.DOWN, 50),
						anchor('center'),
						sprite(levelPart.value),
						lifespan(4, { fade: 3 }),
						opacity(1),
						layer('ui'),
					])
					break
				case SCRIPT_ADD_EARTH:
					addEarth()
					addedEarth = true
					break
			}
		}

		let counter = 0
		let lastCounter = null

		let rockDensityCounter = rockDensity
		onUpdate(() => {
			counter += dt()
			const counterLookup = Math.floor(counter)
			if (counterLookup > lastCounter || lastCounter === null) {
				if (level[counterLookup]) {
					loadLevelPart(level[counterLookup])
				}
			}
			lastCounter = counterLookup

			if (rockDensity > 0) {
				rockDensityCounter -= dt()
				if (rockDensity > 0 && rockDensityCounter <= 0) {
					addRock({
						startPos: vec2(randi(width() / 16, width() - width() / 16), -30),
						direction: Vec2.DOWN
					})
					rockDensityCounter = rockDensity
				}
			}
		})

		let scoreDisplay = null
		player.onScoreUpdate((newScore) => {
			if (!scoreDisplay) {
				scoreDisplay = get('score_display').pop()
				if (!scoreDisplay) {
					return
				}
			}

			scoreDisplay.setNumbers(newScore)
		})

		player.onGameOver(() => {
			const score = player.getScore()
			music.stop()

			addBigExplosion(player.pos, 20)
			wait(3, () => {
				go('gameover', {
					score,
					lost: true,
					destroyedEarth: addedEarth && !get('earth').length,
					...getStars(starfield)
				})
			})
		})
	})
}
