import { useState } from "react";
import { useWalletContext } from "./context/useWalletContext";
import { WalletProvider } from "./context/WalletProvider";
import SetupPassword from "./components/Account/SetupPassword";
import UnlockWallet from "./components/Account/UnlockWallet";
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
import ChatAssistant from "./components/Chat/ChatAssistant";


function AppContent() {
  const { isLocked, hasWallet, createWalletWithPassword, unlockWallet, lockWallet } = useWalletContext();
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [newSeedPhrase, setNewSeedPhrase] = useState('');

  // Show password setup for first-time users
  const handleSetupPassword = async (password) => {
    try {
      const seedPhrase = await createWalletWithPassword(password);
      setNewSeedPhrase(seedPhrase);
      setShowSeedPhrase(true); // Show seed phrase for backup
    } catch (error) {
      console.error('Setup failed:', error);
      throw error;
    }
  };

  // Show unlock screen for returning users
  const handleUnlock = async (password) => {
    try {
      await unlockWallet(password);
    } catch (error) {
      console.error('Unlock failed:', error);
      throw error;
    }
  };

  // Close seed phrase backup and proceed to wallet
  const handleSeedPhraseSaved = () => {
    setShowSeedPhrase(false);
    setNewSeedPhrase('');
  };

  // Case 1: New user - Show password setup
  if (!hasWallet) {
    return <SetupPassword onSetupComplete={handleSetupPassword} />;
  }

  // Case 2: Show seed phrase backup after wallet creation
  if (showSeedPhrase && newSeedPhrase) {
    return (
      <div className="seed-phrase-backup-overlay">
        <div className="seed-phrase-backup-container">
          <div className="backup-header">
            <div className="backup-icon">🔐</div>
            <h1>Backup Your Seed Phrase</h1>
            <p>Write this down and keep it safe! You'll need it to recover your wallet.</p>
          </div>

          <div className="seed-phrase-display">
            <div className="seed-words">
              {newSeedPhrase.split(' ').map((word, index) => (
                <div key={index} className="seed-word">
                  <span className="word-number">{index + 1}</span>
                  <span className="word-text">{word}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="backup-warning">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p>
              Never share your seed phrase! Anyone with these words can access your wallet and funds.
              Store it safely offline.
            </p>
          </div>

          <button
            className="backup-continue-button"
            onClick={handleSeedPhraseSaved}
          >
            I've Written It Down Safely
          </button>
        </div>
      </div>
    );
  }

  // Case 3: Wallet locked - Show unlock screen
  if (isLocked) {
    return <UnlockWallet onUnlock={handleUnlock} />;
  }

  // Case 4: Wallet unlocked - Show main wallet interface
  return (
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

        {/* Lock button */}
        <button
          className="lock-button"
          onClick={lockWallet}
          title="Lock Wallet"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 9V7a4 4 0 10-8 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Lock
        </button>
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

      {/* Chat Assistant - Floating */}
      <ChatAssistant />
    </div>
  );
}

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}

export default App;
