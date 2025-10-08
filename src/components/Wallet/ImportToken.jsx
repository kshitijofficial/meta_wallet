import { useState } from "react";
import { useWalletContext } from "../../context/useWalletContext";
import { CHAINS } from "../../services/chainConfig";

export default function ImportToken() {
    const {selectedAccount,activeChainId,importToken} = useWalletContext();
    const [tokenAddress,setTokenAddress] = useState("");
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");
    const [success,setSuccess] = useState("");

    const handleImport = async(e) =>{
        e.preventDefault();
        if(!tokenAddress.trim() || !selectedAccount) return;


        setLoading(false);
        setError("");
        setSuccess("");

        try {
            await importToken(tokenAddress.trim());
            setSuccess("Token imported successfully");
            setTokenAddress("")
        } catch (error) {
            setError(error.message || "Failed to import token")
        }finally{
            setLoading(false)
        }
    }

    if(!selectedAccount){
        return (
            <div>
                <h3 style={{ marginTop: 0 }}>Import Token</h3>
                <p className="status">Please select an account first</p>
            </div>
        );
    }
    return (
        <div>
            <h3 style={{ marginTop: 0 }}>Import Token</h3>

            <form onSubmit={handleImport}>
                <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                        Token Contract Address:
                    </label>
                    <input
                        type="text"
                        value={tokenAddress}
                        onChange={(e)=>setTokenAddress(e.target.value)}
                        placeholder={`Enter ERC20 token address on ${CHAINS[activeChainId]?.name}`}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                        disabled={loading}
                    />
                </div>

                {error && (
                    <div style={{
                        color: '#e74c3c',
                        fontSize: '12px',
                        marginBottom: '8px',
                        padding: '4px 8px',
                        backgroundColor: '#ffeaea',
                        borderRadius: '4px'
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        color: '#27ae60',
                        fontSize: '12px',
                        marginBottom: '8px',
                        padding: '4px 8px',
                        backgroundColor: '#eafaf1',
                        borderRadius: '4px'
                    }}>
                        {success}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !tokenAddress.trim()}
                    style={{
                        backgroundColor: loading || !tokenAddress.trim() ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: loading || !tokenAddress.trim() ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    {loading ? 'Importing...' : 'Import Token'}
                </button>
            </form>

            <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
                <p>⚠️ Make sure you're importing a valid ERC20 token contract address.</p>
                <p>The token will be added to your wallet and you can view its balance.</p>
            </div>
        </div>
    );
}

