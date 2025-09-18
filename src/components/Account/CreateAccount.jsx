import { useWalletContext } from "../../context/useWalletContext";
export default function CreateAccount() {

    const { addAccount, accounts, setSelectedAccount, selectedAccount } = useWalletContext();
    const handleChange = (e) => {
        const acc = accounts.find(a => a.address === e.target.value);
        setSelectedAccount(acc);
    }
    // Function to format address for display
    const shortenAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    // Function to copy address to clipboard
    const copyToClipboard = async (address) => {
        try {
            await navigator.clipboard.writeText(address);
            console.log('Address copied to clipboard');
        } catch (err) {
            console.error('Failed to copy address:', err);
        }
    };


    return (
        <div>
            <h3 style={{ marginTop: 0 }}>Accounts</h3>

            <div className="row stack">
                <select
                    className="input"
                    value={selectedAccount?.address || ""}
                    onChange={handleChange}
                >
                    <option value="">-- Select an account --</option>
                    {
                        accounts.map(acc => (
                            <option key={acc.index} value={acc.address}>
                                {`#${acc.index} - ${shortenAddress(acc.address)} (Bal:${acc.balance})`}
                            </option>
                        ))
                    }
                </select>

                <div className="row" style={{ gap: '8px' }}>
                    <button className="btn btn-primary" onClick={addAccount}>
                        Create Account
                    </button>

                    {selectedAccount && (
                        <button
                            className="btn btn-secondary"
                            onClick={() => copyToClipboard(selectedAccount.address)}
                            title="Copy address to clipboard"
                        >
                            Copy Address
                        </button>
                    )}
                </div>
            </div>

            {selectedAccount && (
                <>
                    <div className="spacer-sm" />
                    <div className="card" style={{ padding: '8px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>
                            Full Address:
                        </div>
                        <div style={{ fontSize: '11px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                            {selectedAccount.address}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
