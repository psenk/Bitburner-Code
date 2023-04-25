/** @param {NS} ns */
export async function main(ns) {
    const TGT = ns.args[0];
    const SLEEP_INTERVAL = 100;
    const SIZE = ns.getScriptRam('hack.js');
    //const NUM_SERVS = ns.getPurchasedServers().length;
    let hosts = getAllHosts(ns);
    let len = hosts.length;
    //const RAM = ns.getScriptRam('hack.js');
    let threads = 1;

    ns.disableLog('sleep');
    ns.disableLog('getServerMaxRam');
    ns.disableLog('getServerUsedRam');

    //scanning for all hosts
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

    //opening ports
    function openPorts(host) {
        try {
            ns.brutessh(host);
            ns.ftpcrack(host);
            ns.relaysmtp(host);
            ns.httpworm(host);
            ns.sqlinject(host);
        }
        catch (err) {
            // do nothing
        }
    }

    while (true) {
        // Main Loop
        for (let i = 0; i < len; i++) {
            const hostMaxRam = ns.getServerMaxRam(hosts[i]);
            const hostUsedRam = ns.getServerUsedRam(hosts[i]);

            // Checking for hack.js and giving file
            if (!ns.fileExists('hack.js', hosts[i])) {
                ns.scp('hack.js', hosts[i], 'home');
            }

            try {
                // Nuking server if not opened
                if (!ns.hasRootAccess(hosts[i])) {
                    openPorts(hosts[i]);
                    ns.nuke(hosts[i]);
                }
            }
            catch {
                // nothing
            }

            // Adjusting hack.js thread count
            if ((hostMaxRam - hostUsedRam) > SIZE) {
                threads = parseInt((hostMaxRam - hostUsedRam) / SIZE);
            }

            ns.exec('hack.js', hosts[i], threads, TGT);
        }

        /*
                //Server Hacks
                if (NUM_SERVS > 0) {
                    threads = 1;
                    for (let i = 1; i < 25; i++) {
                        const name = `server-${i}`;
                        const usedServerRam = ns.getServerUsedRam(name);
                        const maxServerRam = ns.getServerMaxRam(name);
        
                        if ((maxServerRam - usedServerRam) > SIZE) {
                            threads = parseInt((maxServerRam - usedServerRam) / SIZE)
                        }
                        ns.exec('hack.js', name, threads, TGT);
                    }
                }
        */
        await ns.sleep(SLEEP_INTERVAL);
        hosts = getAllHosts(ns);
    }
}
