// Fetch INR prices for ETH and POL using CoinGecko Simple Price API

async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Price fetch failed: ${res.status}`);
    return res.json();
}

export async function getInrPrices() {
    // Primary attempt: ETH + POL (new token) id
    const primaryUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,polygon-ecosystem-token&vs_currencies=inr';
    try {
        const data = await fetchJson(primaryUrl);
        const ethInr = data?.ethereum?.inr;
        const polInr = data?.['polygon-ecosystem-token']?.inr;
        if (typeof ethInr === 'number' && typeof polInr === 'number') {
            return { ethInr, polInr };
        }
        throw new Error('Primary ids missing');
    } catch (_) {
        // Fallback to legacy MATIC id for POL pricing if needed
        const fallbackUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,matic-network&vs_currencies=inr';
        const data = await fetchJson(fallbackUrl);
        const ethInr = data?.ethereum?.inr ?? 0;
        const polInr = data?.['matic-network']?.inr ?? 0;
        return { ethInr, polInr };
    }
}

// Fetch USD prices and 24h change for ETH and POL (fallback to MATIC)
export async function getUsdPrices() {
    const base = 'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&include_24hr_change=true&ids=';
    try {
        const url = base + 'ethereum,polygon-ecosystem-token';
        const data = await fetchJson(url);
        const eth = data?.ethereum;
        const pol = data?.['polygon-ecosystem-token'];
        if (eth && pol) {
            return {
                ethUsd: eth.usd ?? 0,
                ethChange24h: eth.usd_24h_change ?? 0,
                polUsd: pol.usd ?? 0,
                polChange24h: pol.usd_24h_change ?? 0
            };
        }
        throw new Error('Primary ids missing');
    } catch (_) {
        const url = base + 'ethereum,matic-network';
        const data = await fetchJson(url);
        const eth = data?.ethereum ?? {};
        const matic = data?.['matic-network'] ?? {};
        return {
            ethUsd: eth.usd ?? 0,
            ethChange24h: eth.usd_24h_change ?? 0,
            polUsd: matic.usd ?? 0,
            polChange24h: matic.usd_24h_change ?? 0
        };
    }
}


