import { ethers } from "ethers";

export async function sendNativeTransfer(privateKey, toAddress, amountEth, rpcUrl) {
    try {
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const wallet = new ethers.Wallet(privateKey, provider);

        const tx = await wallet.sendTransaction({
            to: toAddress,
            value: ethers.parseEther(amountEth)
        });

        // Return both transaction hash and receipt
        const receipt = await tx.wait();
        return {
            transactionHash: tx.hash,
            receipt: receipt,
            status: receipt.status === 1 ? 'success' : 'failed'
        };
    } catch (error) {
        console.error("Native transfer failed:", error);
        throw error;
    }
}
