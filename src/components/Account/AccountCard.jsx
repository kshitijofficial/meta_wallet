import { useWalletContext } from '../../context/useWalletContext';
import { useEffect, useState } from 'react';
import { getBalance } from '../../utils/getBalance';
import { CHAINS } from '../../services/chainConfig';
import { getUsdPrices } from '../../services/priceService';

export default function AccountCard() {
    const {
        accounts,
        activeChainId,
        setAccounts,
        selectedAccount
    } = useWalletContext();

    const [currentBalance, setCurrentBalance] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [usdValue,setUsdValue] =useState(null);

    // Function to copy address to clipboard
    const copyToClipboard = async (address) => {
        try {
            await navigator.clipboard.writeText(address);
           
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
            
            setCurrentBalance(balance);
            const updateAccounts = accounts.map(acc =>
                acc.address === selectedAccount.address ? { ...acc, balance } : acc
            )
            setAccounts(updateAccounts)

            //Price: show inline USD like Metamask

            try{
                const {ethUsd,polUsd} = await getUsdPrices();
                const isPolygon = activeChainId === 80002;
                const unitUsd = isPolygon?polUsd:ethUsd;
                const totalUsd = parseFloat(balance || '0') * (unitUsd || 0);
                setUsdValue(totalUsd)
            }catch(e){
                console.error('USD price fetch failed',e);
                setUsdValue(null)
            }
        } catch (error) {
            console.error('Failed to fetch balance:', error);
            setCurrentBalance(null)
            setUsdValue(null)
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
                <div style={{ margin: 0 }}>
                    <p style={{ margin: 0 }}>
                        <strong>Balance:</strong>{' '}
                        {isLoading ? 'Loading...' :
                            currentBalance !== null ? `${currentBalance} ${getCurrencySymbol()}` : 'Failed to load'}
                    </p>
                    {!isLoading && usdValue !== null && (
                        <p style={{ margin: 0, fontSize: 12, opacity: 0.85 }}>
                            ${usdValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        </p>
                    )}
                </div>
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
