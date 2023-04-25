/** @param {NS} ns */
export async function main(ns) {

	const MAX_SERVERS = 25;
	const COST = ns.getPurchasedServerCost(2);
	const SLEEP_INTERVAL = 100;
	let numServers = ns.getPurchasedServers().length;
	let serverName = '';

	ns.disableLog('getServerMoneyAvailable');
	ns.disableLog('sleep');
	ns.disableLog('getServerMaxRam');

	function getMoney() {
		return ns.getServerMoneyAvailable('home');
	}

	async function waitMoney(cost) {
		while (getMoney() < cost) {
			await ns.sleep(SLEEP_INTERVAL);
		}
	}

	// Buying 25 servers
	while (numServers < MAX_SERVERS) {
		await waitMoney(COST);
		serverName = `server-${numServers}`;
		ns.purchaseServer(serverName, 2);
		numServers = ns.getPurchasedServers().length;
		ns.tprint('Server #' + numServers + ' purchased.');
	}

	// Upgrading 25 servers to max until last server has max RAM
	while (ns.getServerMaxRam('server-24') < ns.getPurchasedServerMaxRam()) {
		for (let i = 0; i < 25; i++) {
			serverName = `server-${i}`;
			if (ns.getServerMaxRam(serverName) == ns.getPurchasedServerMaxRam()) {
				continue;
			}
			let upgradeRAM = ns.getServerMaxRam(serverName) * 2;
			let upgradeCost = ns.getPurchasedServerUpgradeCost(serverName, upgradeRAM);
			await waitMoney(upgradeCost);
			ns.upgradePurchasedServer(serverName, upgradeRAM);
			ns.tprint('Server #' + i + ' upgraded to ' + upgradeRAM + ' GBs of RAM.');
			if (ns.scriptRunning('hack.js', serverName)) {
				ns.scriptKill('hack.js', serverName);
			}
		}
	}
}
