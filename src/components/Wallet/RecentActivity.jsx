import { useEffect, useState } from "react";
import { useWalletContext } from "../../context/useWalletContext";
import { getRecentOutboundNative } from "../../services/activityService";
import { CHAINS } from "../../services/chainConfig";

export default function RecentActivity() {
    const { selectedAccount, activeChainId } = useWalletContext();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (!selectedAccount) return;
            setLoading(true);
            const txs = await getRecentOutboundNative(selectedAccount.address, CHAINS[activeChainId]?.rpc, 3);
            setItems(txs);
            setLoading(false);
        };
        load();
    }, [selectedAccount, activeChainId]);

    if (!selectedAccount) return null;

    const explorerBase = CHAINS[activeChainId]?.explorerTx;
    const isPolygon = CHAINS[activeChainId]?.name === 'Polygon Amoy';
    const symbol = isPolygon ? 'POL' : 'ETH';

    return (
        <div>
            <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
            {loading ? (
                <p className="status">Loading...</p>
            ) : items.length === 0 ? (
                <p className="status">No recent transactions.</p>
            ) : (
                <div className="list">
                    {items.map((tx) => (
                        explorerBase ? (
                            <a
                                key={`${tx.hash}`}
                                href={`${explorerBase}${tx.hash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="row between"
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    padding: '4px 0'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 500, fontSize: 13 }}>Sent</div>
                                    <div style={{ fontSize: 12, opacity: 0.8 }}>{new Date(tx.timestamp).toLocaleString()}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 14, fontWeight: 600 }}>{tx.amount} {symbol}</div>
                                    <div style={{ fontSize: 12, opacity: 0.9 }}>{tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}</div>
                                </div>
                            </a>
                        ) : (
                            <div key={`${tx.hash}`} className="row between">
                                <div>
                                    <div style={{ fontWeight: 500, fontSize: 13 }}>Sent</div>
                                    <div style={{ fontSize: 12, opacity: 0.8 }}>{new Date(tx.timestamp).toLocaleString()}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 14, fontWeight: 600 }}>{tx.amount} {symbol}</div>
                                    <div style={{ fontSize: 12, opacity: 0.9 }}>{tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}</div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
}


