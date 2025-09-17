import { useWalletContext } from "../../context/useWalletContext";
import { CHAINS } from "../../services/chainConfig";

export default function ChainSelector() {
    const { activeChainId, changeNetwork } = useWalletContext();

    const handleNetworkChange = (e) => {
        const newChainId = parseInt(e.target.value);
        changeNetwork(newChainId)
    }
    return (
        <div>
            <h3 style={{ marginTop: 0 }}>Network</h3>
            <div className="row">
                <select
                    className="input"
                    value={activeChainId}
                    onChange={handleNetworkChange}
                >
                    {
                        Object.entries(CHAINS).map(([chainId, chain]) => {
                            return (
                                <option key={chainId} value={chainId}>
                                    {chain.name}
                                </option>
                            )
                        })
                    }
                </select>
            </div>
            <p className="status">
                Current Network: {CHAINS[activeChainId]?.name || 'Unknown Network'}
            </p>
        </div>
    );
}
