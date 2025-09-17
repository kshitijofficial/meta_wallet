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
    return (
        <WalletContext.Provider
            value={{
                seedPhrase,
                accounts,
                activeChainId,
                activeAccountIndex,
                selectedAccount
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};
