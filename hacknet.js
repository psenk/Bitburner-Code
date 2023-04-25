/** @param {NS} ns */
export async function main(ns) {
	const AMOUNT = 6;
	const SLEEP_INTERVAL = 100;
	let numberNodes = ns.hacknet.numNodes();
	let price = ns.hacknet.getPurchaseNodeCost();

	ns.disableLog('sleep');
	ns.disableLog('getServerMoneyAvailable');

	function getMoney() {
		return ns.getServerMoneyAvailable('home');
	}

	async function waitMoney(cost) {
		while (getMoney() < cost) {
			await ns.sleep(SLEEP_INTERVAL);
		}
	}

	// Buy nodes loop
	while (numberNodes < AMOUNT) {
		await waitMoney(price)
		ns.hacknet.purchaseNode();
		ns.tprint(`Node #${numberNodes + 1} purchased.`);
		price = ns.hacknet.getPurchaseNodeCost();
		numberNodes = ns.hacknet.numNodes();
	}

	// Main Loop
	while (ns.hacknet.getNodeStats(numberNodes - 1).cores < 16) {
		for (let i = 0; i < AMOUNT; i++) {
			let levelsAvail = ns.hacknet.getNodeStats(i).level;
			// Levels Loop
			while (levelsAvail < 200) {
				await waitMoney(ns.hacknet.getLevelUpgradeCost(i, 1));
				ns.hacknet.upgradeLevel(i, 1);
				levelsAvail = ns.hacknet.getNodeStats(i).level;
				ns.tprint(`Node #${i} Level upgraded.`);
			}
		}
		for (let i = 0; i < AMOUNT; i++) {
			let ramAvail = ns.hacknet.getNodeStats(i).ram;
			// RAM Loop
			while (ramAvail < 64) {
				await waitMoney(ns.hacknet.getRamUpgradeCost(i, 1));
				ns.hacknet.upgradeRam(i, 1);
				ramAvail = ns.hacknet.getNodeStats(i).ram;
				ns.tprint(`Node #${i} RAM upgraded.`);
			}
		}
		for (let i = 0; i < AMOUNT; i++) {
			let coresAvail = ns.hacknet.getNodeStats(i).cores;
			// Cores Loop
			while (coresAvail < 16) {
				await waitMoney(ns.hacknet.getCoreUpgradeCost(i, 1));
				ns.hacknet.upgradeCore(i, 1);
				coresAvail = ns.hacknet.getNodeStats(i).cores;
				ns.tprint(`Node #${i} Cores upgraded.`);
			}
		}
	}
}
