import { useState } from "react";
import { useWalletContext } from "../../context/useWalletContext";
import { sendNativeTransfer } from "../../services/transactionService";
import { CHAINS } from "../../services/chainConfig";
import { getBalance } from "../../utils/getBalance";

export default function SendCrypto() {

    const { selectedAccount, setAccounts, accounts, activeChainId } = useWalletContext();
    const [to, setTo] = useState("")
    const [amount, setAmount] = useState("")
    const [status, setStatus] = useState("")
    const [txUrl, setTxUrl] = useState(null);

    const shortenAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    const handleSend = async () => {
        if (!selectedAccount) {
            setStatus("No active account selected");
            return;
        }

        if (!to || !amount) {
            setStatus("Recipient or amount is missing");
            return;
        }

        try {
            setStatus("Sending...")
            setTxUrl(null)
            const txResult = await sendNativeTransfer(
                selectedAccount.privateKey,
                to,
                amount,
                CHAINS[activeChainId].rpc
            );

            if (txResult.status === 'success') {
                const newBalance = await getBalance(selectedAccount.address, CHAINS[activeChainId].rpc);
                const updatedAccounts = accounts.map(acc =>
                    acc.address === selectedAccount.address ? { ...acc, balance: newBalance } : acc
                );
                setAccounts(updatedAccounts);
                const explorerBase = CHAINS[activeChainId]?.explorerTx;
                if (explorerBase) {
                    const url = `${explorerBase}${txResult.transactionHash}`
                    setTxUrl(url)
                    setStatus("Transaction Successful")
                } else {
                    setStatus(`Transaction Successful! Hash: ${shortenAddress(txResult.transactionHash)} `);
                }
                setTo("")
                setAmount("")
            } else {
                setStatus(`Transaction Failed:  ${txResult.receipt?.reason || `Unknown Error`} `);
            }

        } catch (error) {
            console.error('Transaction error:', error);
            setStatus(`Error: ${error.message || 'Transaction failed'} `);
        }
    }
    return (
        <div>
            <h3 style={{ marginTop: 0 }}>Send Crypto</h3>
            <div className="row stack">
                <input
                    className="input"
                    type="text"
                    placeholder="Recipient Address"
                    value={to}
                    onChange={e => setTo(e.target.value)}

                />
                <input
                    className="input"
                    type="number"
                    placeholder={`Amount 'ETH'`}
                    value={amount}
                    onChange={e => setAmount(e.target.value)}

                />
                <div className="spacer-sm" />
                <button className="btn btn-primary" onClick={handleSend} >Send</button>
            </div>
            <p className="status">{status}</p>
            {txUrl && (
                <p className="status">
                    <a href={txUrl} target="_blank" rel="noreferrer">
                        View on {CHAINS[activeChainId]?.name?.includes('Polygon') ? 'Polygonscan' : 'Etherscan'}
                    </a>
                </p>
            )}
        </div>
    );
}
