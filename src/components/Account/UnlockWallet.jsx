import { useState } from 'react';
import './UnlockWallet.css';

const UnlockWallet = ({ onUnlock, error: externalError }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password.trim()) {
            setError('Please enter your password');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            await onUnlock(password);
        } catch (err) {
            setError(err.message || 'Invalid password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const displayError = error || externalError;

    return (
        <div className="unlock-wallet-overlay">
            <div className="unlock-wallet-container">
                <div className="unlock-header">
                    <div className="unlock-logo">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1>Welcome Back!</h1>
                    <p>Unlock your wallet with your password</p>
                </div>

                <form onSubmit={handleSubmit} className="unlock-form">
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                autoFocus
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 3L21 21M10.5 10.677A2 2 0 1013.5 13.677" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M7.362 7.561C5.68 8.74 4.279 10.42 3 12c1.889 2.991 5.282 6 9 6 1.55 0 3.043-.523 4.395-1.35M12 6C15.718 6 19.111 9.01 21 12c-.583.924-1.225 1.773-1.91 2.537" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 5C8.24 5 4.82 7.58 3 12c1.82 4.42 5.24 7 9 7s7.18-2.58 9-7c-1.82-4.42-5.24-7-9-7z" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {displayError && (
                            <div className="error-message">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                {displayError}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="unlock-button"
                        disabled={isLoading || !password.trim()}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Unlocking...
                            </>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M16 9V7a4 4 0 10-8 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Unlock Wallet
                            </>
                        )}
                    </button>
                </form>

                <div className="unlock-footer">
                    <p className="help-text">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Forgot your password? You'll need to restore your wallet using your seed phrase.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UnlockWallet;


