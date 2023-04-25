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
	ns.tprint(getAllHosts(ns));
}
