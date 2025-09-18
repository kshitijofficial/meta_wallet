import { ethers } from "ethers";


export async function getRecentOutboundNative(address, rpcUrl, max = 3) {
    if (!address || !rpcUrl) return [];
    try {
        const provider = new ethers.JsonRpcProvider(rpcUrl);

        const hexMax = '0x' + Math.max(1, max).toString(16);
        const params = [{
            fromBlock: "0x0",
            toBlock: "latest",
            category: ["external"],
            fromAddress: address,
            withMetadata: true,
            excludeZeroValue: true,
            maxCount: hexMax
        }];
        const result = await provider.send('alchemy_getAssetTransfers', params);
        const transfers = Array.isArray(result?.transfers) ? result.transfers : [];
        return transfers.map(t => ({
            hash: t.hash,
            to: t.to,
            from: t.from,
            amount: t.value,
            timestamp: t.metadata?.blockTimestamp ? Date.parse(t.metadata.blockTimestamp) : Date.now(),
            status: 'success'
        }));
    } catch (e) {
        console.error('Failed to load recent transfers', e);
        return [];
    }
}


