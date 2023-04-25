/** @param {NS} ns */
export async function main(ns) {

	function getAllHosts(ns) {
		getAllHosts.cache ||= {};
		const scanned = getAllHosts.cache;
		const toScan = ['home'];
		while (toScan.length > 0) {
			const host = toScan.shift();
			scanned[host] = true;
			for (const nextHost of ns.scan(host)) {
				if (!(nextHost in scanned)) {
					toScan.push(nextHost);
				}
			}
		}
		const allHosts = Object.keys(scanned);
		return allHosts;
	}

	function getRichestServers() {
		const serverDict = {};
		const SERVER_LIST = getAllHosts(ns);
		const LEN = SERVER_LIST.length;

		for (let i = 1; i < LEN; i++) {
			serverDict[SERVER_LIST[i]] = ns.getServerMaxMoney(SERVER_LIST[i]);
		}

		return Object.keys(serverDict).sort((serverA, serverB) => {
			return serverDict[serverB] - serverDict[serverA]
		})
	}

	function hackTarget(list) {
		for (let k in list) {
			if (ns.getServerRequiredHackingLevel(list[k]) > ns.getHackingLevel()) {
				continue;
			} else {
				ns.tprint(`Hacking target: ${list[k]}`);
				return list[k];
			}
		}
	}

	ns.run('find-and-solve.js', 1);
	ns.run('buyservers.js', 1);
	ns.run('hacknet.js', 1);
	ns.run('masterhack.js', 1, hackTarget(getRichestServers()));
}
