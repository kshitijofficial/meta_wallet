import { WalletProvider } from "./context/WalletContext";
import AccountCard from "./components/Account/AccountCard";
import SeedPhrasePrompt from "./components/Account/SeedPhrasePrompt";
import './App.css';
import CreateAccount from "./components/Account/CreateAccount";
import RecoverAccount from "./components/Account/RecoverAccount";
import SendCrypto from "./components/Wallet/SendCrypto";
import ChainSelector from "./components/Wallet/ChainSelector";
import RecentActivity from "./components/Wallet/RecentActivity"
import TokenList from "./components/Wallet/TokenList";
import ImportToken from "./components/Wallet/ImportToken";

function App() {
  return (
    <WalletProvider>
      <div className="wallet-shell">
        <div className="app-header">
          <div className="app-title">
            <div className="app-title-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span>Crypto Wallet</span>
          </div>
        </div>

        <div className="panel">
          <div className="section">
            <SeedPhrasePrompt />
          </div>

          <div className="section">
            <ChainSelector />
          </div>

          <div className="section">
            <AccountCard />
          </div>

          <div className="section">
            <CreateAccount />
          </div>

          <div className="section">
            <SendCrypto />
          </div>
          <div className="section">
            <RecentActivity />
          </div>
            <div className="section">
            <ImportToken />
          </div>

          <div className="section">
            <TokenList />
          </div>

          <div className="section">
            <RecoverAccount />
          </div>
        </div>
      </div>
    </WalletProvider>
  );
}

export default App;
