import 'kaplay/global'

import { SINGLE, DOUBLE } from './components/weapon'
import { card, WEAPON } from './components/card'
import { numbers } from './components/numbers'

export default function addUI() {
	const score = add([
		pos(width() / 2 - 42, 6),
		numbers({ numbers: 0, size: 1, padding: 5 }),
		layer('ui'),
		'score_display',
		'ui'
	])

	const ships = add([
		pos(width() - 64, 32),
		sprite('sheet', { frame: 2 }),
		layer('ui'),
		'ships',
		'ui'
	])

	ships.add([
		pos(8, 0),
		numbers({ numbers: 10, size: 1, padding: 2 }),
		'ship_count',
		'ui'
	])

	add([
		pos(10, 10),
		layer('ui'),
		'upgrades',
		'ui'
	])
}

