import { useWalletContext } from "../../context/useWalletContext";

export default function TokenList() {
    const { importedTokens, tokenBalances, selectedAccount, removeToken } = useWalletContext();
    console.log("Issue:",tokenBalances)
    if (!selectedAccount) {
        return (
            <div>
                <h3 style={{ marginTop: 0 }}>Token Balances</h3>
                <p className="status">Please select an account first</p>
            </div>
        );
    }

    if (importedTokens.length === 0) {
        return (
            <div>
                <h3 style={{ marginTop: 0 }}>Token Balances</h3>
                <p className="status">No tokens imported yet. Use "Import Token" to add ERC20 tokens.</p>
            </div>
        );
    }

    return (
        <div>
            <h3 style={{ marginTop: 0 }}>Token Balances</h3>

            <div className="list">
                {importedTokens.map((token) => {
                    const balance = tokenBalances[token.address.toLowerCase()] || '0';

                    return (
                        <div
                            key={token.address}
                            className="row between"
                            style={{
                                padding: '8px 0',
                                borderBottom: '1px solid #eee',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                                        {token.name}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                        {token.symbol}
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '14px', fontWeight: '600' }}>
                                    {parseFloat(balance).toFixed(4)} {token.symbol}
                                </div>
                                <div style={{ fontSize: '11px', color: '#999' }}>
                                    {token.address.slice(0, 6)}...{token.address.slice(-4)}
                                </div>
                                <button
                                    onClick={() => removeToken(token.address)}
                                    style={{
                                        fontSize: '10px',
                                        padding: '2px 6px',
                                        backgroundColor: '#ff4757',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '3px',
                                        cursor: 'pointer',
                                        marginTop: '2px'
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

