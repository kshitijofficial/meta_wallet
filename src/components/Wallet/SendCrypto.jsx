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

    const shortenAddress = () => {
        if (!addres) return '';
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
                setAccounts(updateAccounts);
                setStatus(`Transaction Successful! Hash: ${shortenAddress(txResult.transactionHash)} `);
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
                    placeholder={`Amount 'ETH'
})`}
                    value={amount}
                    onChange={e => setTo(e.target.value)}

                />
                <div className="spacer-sm" />
                <button className="btn btn-primary" onClick={handleSend} >Send</button>
            </div>
            <p className="status">{status}</p>
        </div>
    );
}
