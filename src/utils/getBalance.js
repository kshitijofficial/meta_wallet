// src/utils/getBalance.js
import { ethers } from 'ethers';
export const getBalance = async (address, rpcUrl) => {
    if (!ethers.isAddress(address)) {
        throw new Error("Invalid Ethereum address");
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const balanceWei = await provider.getBalance(address);
    return ethers.formatEther(balanceWei); // Returns as string in ETH
};
