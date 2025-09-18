import { useWalletContext } from '../../context/useWalletContext';
import { useEffect, useState } from 'react';
import { getBalance } from '../../utils/getBalance';
import { CHAINS } from '../../services/chainConfig';

export default function AccountCard() {
    const {
        accounts,
        activeChainId,
        setAccounts,
        selectedAccount
    } = useWalletContext();

    const [currentBalance, setCurrentBalance] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Function to copy address to clipboard
    const copyToClipboard = async (address) => {
        try {
            await navigator.clipboard.writeText(address);
            console.log('Address copied to clipboard');
        } catch (err) {
            console.error('Failed to copy address:', err);
        }
    };

    // Function to format address for display
    const shortenAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const refreshBalance = async () => {
        if (!selectedAccount || !activeChainId) return;

        setIsLoading(true);
        try {

            const balance = await getBalance(selectedAccount.address, CHAINS[activeChainId].rpc);
            console.log(balance)
            setCurrentBalance(balance);
            const updateAccounts = accounts.map(acc =>
                acc.address === selectedAccount.address ? { ...acc, balance } : acc
            )
            setAccounts(updateAccounts)
        } catch (error) {
            console.error('Failed to fetch balance:', error);
            setCurrentBalance(null)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        refreshBalance();
    }, [activeChainId, selectedAccount?.address])


    const getCurrencySymbol = () => {
        switch (activeChainId) {
            case 80002:
                return 'POL';
            case 1:
                return 'ETH';
            case 11155111:
                return 'SEPOLIA ETH';
        }
    }

    if (!selectedAccount) {
        return <div className="card"><strong>No account</strong></div>
    }
    return (
        <div className="card">
            <p style={{ marginTop: 0, marginBottom: 8 }}>Active Account</p>
            <div className="row" style={{ alignItems: 'flex-start', gap: '8px' }}>
                <div className="address" style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                        {shortenAddress(selectedAccount.address)}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', wordBreak: 'break-all' }}>
                        {selectedAccount.address}
                    </div>
                </div>
                <button
                    className="btn btn-secondary"
                    onClick={() => copyToClipboard(selectedAccount.address)}
                    title="Copy address to clipboard"
                    style={{ padding: '6px 8px', fontSize: '12px' }}
                >
                    Copy
                </button>
            </div>
            <div className="spacer-sm" />
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0 }}>
                    <strong>Balance:</strong>{' '}
                    {isLoading ? 'Loading...' :
                        currentBalance !== null ? `${currentBalance} ${getCurrencySymbol()}` : 'Failed to load'}
                </p>
                <button
                    className="btn btn-secondary"
                    onClick={refreshBalance}
                    disabled={isLoading}
                    style={{ padding: '6px 8px', fontSize: '12px' }}
                    title="Refresh balance"
                >
                    {isLoading ? '...' : '↻'}
                </button>
            </div>
        </div>
    );
}
