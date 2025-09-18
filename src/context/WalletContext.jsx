import { createContext, useState, useEffect } from "react"
import { deriveAccount } from "../services/walletService";
import { getBalance } from "../utils/getBalance";
import { CHAINS } from "../services/chainConfig"
export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [accounts, setAccounts] = useState([]);
    const [seedPhrase, setSeedPhrase] = useState(null);
    const [activeChainId, setActiveChainId] = useState(1);
    const [activeAccountIndex, setActiveAccountIndex] = useState(0);
    const [selectedAccount, setSelectedAccount] = useState(null);

    useEffect(() => {

        const initWallet = async () => {
            const { seedPhrase: newSeed, privateKey, address } = deriveAccount(null, 0);
            const balance = await getBalance(address, CHAINS[activeChainId].rpc);

            const firstAccount = { privateKey, address, balance, index: 0 };
            setSelectedAccount(firstAccount);
            setSeedPhrase(newSeed);
            setAccounts([firstAccount]);
        }

        initWallet();
    }, [])

    const addAccount = async () => {
        const newIndex = accounts.length;
        const { privateKey, address } = deriveAccount(seedPhrase, newIndex);
        const balance = await getBalance(address, CHAINS[activeChainId].rpc);
        const newAccount = { privateKey, address, balance, index: newIndex };
        const updatedAccounts = [...accounts, newAccount];
        setAccounts(updatedAccounts)
    }

    const changeNetwork = async (newChainId) => {
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
        setAccounts(updateAccounts)
    }
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
                addAccount
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};
