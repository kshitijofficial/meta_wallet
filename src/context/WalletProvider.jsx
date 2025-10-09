import { useState, useEffect } from "react"
import { deriveAccount } from "../services/walletService";
import { getBalance } from "../utils/getBalance";
import { CHAINS } from "../services/chainConfig"
import { getTokenBalance, formateTokenBalance, getTokenInfo } from "../services/erc20Service";
import { encryptData, decryptData } from "../services/encryptionService";
import {
    saveEncryptedWallet,
    loadEncryptedWallet,
    isWalletInitialized,
    updateLastUnlock,
    saveImportedTokens,
    loadImportedTokens
} from "../services/storageService";
import { WalletContext } from "./WalletContext";


export const WalletProvider = ({ children }) => {
    const [accounts, setAccounts] = useState([]);
    const [seedPhrase, setSeedPhrase] = useState(null);
    const [activeChainId, setActiveChainId] = useState(1);
    const [activeAccountIndex, setActiveAccountIndex] = useState(0);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [importedTokens, setImportedTokens] = useState([]);
    const [tokenBalances, setTokenBalances] = useState({});

    const [isLocked, setIsLocked] = useState(true);
    const [hasWallet, setHasWallet] = useState(false);

    useEffect(() => {
        const walletExists = isWalletInitialized();
        setHasWallet(walletExists);
        setIsLocked(walletExists);

        if (walletExists) {
            const tokens = loadImportedTokens();
            setImportedTokens(tokens)
        }

    }, [])

    const createWalletWithPassword = async (password) => {
        try {
            const { seedPhrase: newSeed, privateKey, address } = deriveAccount(null, 0);
            const encryptedSeed = await encryptData(newSeed, password);

            const saved = saveEncryptedWallet({
                encryptedSeedPhrase: encryptedSeed,
                createdAt: Date.now()
            })

            if (!saved) {
                throw new Error('Failed to save wallet')
            }
            const balance = await getBalance(address, CHAINS[activeChainId].rpc);
            const firstAccount = { privateKey, address, balance, index: 0 };
            setSelectedAccount(firstAccount);
            setSeedPhrase(newSeed);
            setAccounts([firstAccount]);
            setIsLocked(false);
            setHasWallet(true);
            updateLastUnlock();
            return newSeed;
        } catch (error) {
            console.error('Error creating wallet:', error)
            throw error
        }
    }

    const unlockWallet = async (password) => {
        try {
            const encryptedWallet = loadEncryptedWallet();
            if (!encryptedWallet) {
                throw new Error('No wallet is found')
            }

            const decryptedSeed = await decryptData(
                encryptedWallet.encryptedSeedPhrase,
                password
            );
            const { privateKey, address } = deriveAccount(decryptedSeed, 0);
            const balance = await getBalance(address, CHAINS[activeChainId].rpc);
            const firstAccount = { privateKey, address, balance, index: 0 };
            setSelectedAccount(firstAccount);
            setSeedPhrase(decryptedSeed);
            setAccounts([firstAccount]);
            setIsLocked(false);
            setHasWallet(true);
            updateLastUnlock();

            const tokens = loadImportedTokens();
            setImportedTokens(tokens);
        } catch (error) {
            console.error('Error unlocking wallet:', error);
            throw new Error('Invalid password')
        }
    }

    const lockWallet = () => {
        setIsLocked(true);
        setSeedPhrase(null);
        setAccounts([]);
        setSelectedAccount(null);
        setTokenBalances({})
    }

    const addAccount = async () => {

        if (isLocked || !seedPhrase) {
            throw new Error("Wallet is locked")
        }
        const newIndex = accounts.length;
        const { privateKey, address } = deriveAccount(seedPhrase, newIndex);
        const balance = await getBalance(address, CHAINS[activeChainId].rpc);
        const newAccount = { privateKey, address, balance, index: newIndex };
        const updatedAccounts = [...accounts, newAccount];
        setAccounts(updatedAccounts)
    }

    const changeNetwork = async (newChainId) => {
        if (isLocked) {
            throw new Error("Wallet is locked")
        }
        if (!CHAINS[newChainId]) {
            console.error("Unsupported chain ID:", newChainId);
            return;
        }

        setActiveChainId(newChainId);

        const updateAccounts = await Promise.all(
            accounts.map(async (acc) => {
                const balance = await getBalance(acc.address, CHAINS[newChainId].rpc);
                return { ...acc, balance };
            })
        )
        setAccounts(updateAccounts);
        await updateTokenBalances(selectedAccount?.address, newChainId);
    }

    const importToken = async (tokenAddress) => {
        if (isLocked) {
            throw new Error("Wallet is locked")
        }
        try {
            if (!selectedAccount) {
                throw new Error('No account selected')
            }

            const tokenInfo = await getTokenInfo(tokenAddress, CHAINS[activeChainId].rpc);
            const existingToken = importedTokens.find(token => token.address.toLowerCase() === tokenAddress.toLowerCase());
            if (existingToken) {
                throw new Error('Token already imported')
            }

            const newToken = { ...tokenInfo, addAt: Date.now() };
            const updatedTokens = [...importedTokens, newToken];
            setImportedTokens(updatedTokens);
            saveImportedTokens(updatedTokens);
            await updateTokenBalance(tokenAddress, selectedAccount.address, activeChainId)
            return newToken;
        } catch (error) {
            console.error('Error importing token:', error);
            throw error;
        }
    }

    const removeToken = (tokenAddress) => {
        const updatedTokens = importedTokens.filter(token => token.address.toLowerCase() !== tokenAddress.toLowerCase());
        setImportedTokens(updatedTokens);
        saveImportedTokens(updatedTokens);
        const updatedBalances = { ...tokenBalances };
        delete updatedBalances[tokenAddress.toLowerCase()];
        setTokenBalances(updatedBalances)
    }

    const updateTokenBalance = async (tokenAddress, walletAddress, chainId) => {
        try {
            const balance = await getTokenBalance(tokenAddress, walletAddress, CHAINS[chainId].rpc);

            const token = importedTokens.find(t => t.address.toLowerCase() === tokenAddress.toLowerCase());

            if (token) {
                const formattedBalance = formateTokenBalance(balance, token.decimals);

                setTokenBalances(prev => ({
                    ...prev,
                    [tokenAddress.toLowerCase()]: formattedBalance
                }))
            }
        } catch (error) {
            console.error('Error updating token balance:', error)
        }
    }

    const updateTokenBalances = async (walletAddress, chainId) => {
        if (!walletAddress || importedTokens.length === 0) return;

        const balancesPromises = importedTokens.map(async (token) => {
            try {
                const balance = await getTokenBalance(token.address, walletAddress, CHAINS[chainId].rpc);

                const formattedBalance = formateTokenBalance(balance, token.decimals);
                return { address: token.address.toLowerCase(), balance: formattedBalance };
            } catch (error) {

                return { address: token.address.toLowerCase(), balance: '0' };
            }
        })

        const balances = await Promise.all(balancesPromises);
        const balanceMap = {};
        balances.forEach(({ address, balance }) => {
            balanceMap[address] = balance;
        });

        setTokenBalances(balanceMap)
    }

    useEffect(() => {
        if (selectedAccount && !isLocked) {
            updateTokenBalances(selectedAccount.address, activeChainId);
        }
    }, [selectedAccount, activeChainId, importedTokens])
    return (
        <WalletContext.Provider
            value={{
                setSeedPhrase,
                seedPhrase,
                accounts,
                activeChainId,
                activeAccountIndex,
                selectedAccount,
                setSelectedAccount,
                changeNetwork,
                setAccounts,
                addAccount,
                importedTokens,
                tokenBalances,
                importToken,
                removeToken,
                updateTokenBalances,
                isLocked,
                hasWallet,
                createWalletWithPassword,
                unlockWallet,
                lockWallet
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};
