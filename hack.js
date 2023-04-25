/** @param {NS} ns */
export async function main(ns) {
	const TGT = ns.args[0];
	ns.disableLog('getServerSecurityLevel');
	ns.disableLog('getServerMinSecurityLevel');
	ns.disableLog('getServerMoneyAvailable');
	ns.disableLog('getServerMaxMoney');
	while (true) {
		if (ns.getServerSecurityLevel(TGT) > ns.getServerMinSecurityLevel(TGT)) {
			await ns.weaken(TGT);
		} else if (ns.getServerMoneyAvailable(TGT) < ns.getServerMaxMoney(TGT)) {
			await ns.grow(TGT);
			await ns.weaken(TGT);
		} else {
			await ns.hack(TGT);
			await ns.weaken(TGT);
			await ns.grow(TGT);
			await ns.weaken(TGT);
		}
	}
}
