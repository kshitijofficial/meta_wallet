// src/hooks/useBalance.js
import { useState, useEffect } from "react";
import { ethers } from "ethers";

export const useBalance = (address, rpcUrl) => {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!address) return;

        const provider = new ethers.JsonRpcProvider(rpcUrl);

        const fetchBalance = async () => {
            try {
                setLoading(true);
                const balanceWei = await provider.getBalance(address);
                const balanceEth = ethers.formatEther(balanceWei);
                setBalance(balanceEth);
            } catch (err) {
                console.error("Error fetching balance:", err);
                setBalance(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
    }, [address, rpcUrl]);

    return { balance, loading };
};
