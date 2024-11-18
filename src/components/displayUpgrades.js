import { card, WEAPON, MOVEMENT } from './card'

export function displayUpgrades() {
	return {
		id: 'displayUpgrades',
		require: ['weapon'],
		add() {
			if (this.weaponType !== undefined) {
				this.updateWeaponType(this.weaponType)
			}
		},
		updateWeaponType(weaponType) {
			const ui = get(['ui', 'upgrades']).pop()
			if (!ui) {
				wait(0.5, () => this.updateWeaponType(weaponType))
				return
			}
			ui.removeAll('weapon')
			ui.add([
				pos(0, 0),
				card({ type: WEAPON, subType: weaponType }),
				'upgrade',
				'weapon',
			])
		},
		updateShipUpgradeType(shipUpgradeType) {
		}
	}
}


