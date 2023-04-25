/** @param {NS} ns */
export async function main(ns) {
	const hosts = getAllHosts(ns);
	const len = hosts.length;

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

	for (let i = 0; i < len; i++) {
		try {
			ns.brutessh(hosts[i]);
			ns.ftpcrack(hosts[i]);
			ns.relaysmtp(hosts[i]);
			ns.httpworm(hosts[i]);
			ns.sqlinject(hosts[i]);
		}
		catch (err) {
			ns.tprint('Failed to open ports!');
		}
	}
}
