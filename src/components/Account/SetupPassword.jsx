import { useState } from 'react';
import './SetupPassword.css';

const SetupPassword = ({ onSetupComplete }) => {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const validatePassword = () => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long'
        }
        if (password !== confirmPassword) {
            return 'Passwords do not match'
        }
        return null;
    }

    const getPasswordStrength = () => {
        if (!password) return { level: 0, text: '', color: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;

        if (strength <= 2) return { level: 1, text: 'Weak', color: '#ff4757' };
        if (strength <= 3) return { level: 2, text: 'Medium', color: '#ffa502' };
        return { level: 3, text: 'Strong', color: '#2ed573' }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validatorError = validatePassword();
        if (validatorError) {
            setError(validatorError);
            return;
        }
        if (!agreed) {
            setError('Please agree to the terms and condition')
        }

        setError('');
        setIsLoading(true)

        try {
            await onSetupComplete(password);
        } catch (error) {
            setError(error.message || 'Failed to setup password')
        } finally {
            setIsLoading(false)
        }
    }
    const passwordStrength = getPasswordStrength()
    return (
        <div className="setup-password-overlay">
            <div className="setup-password-container">
                <div className="setup-header">
                    <div className="setup-logo">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1>Create Password</h1>
                    <p>This password will unlock your wallet</p>
                </div>

                <form onSubmit={handleSubmit} className="setup-form">
                    <div className="input-group">
                        <label htmlFor="password">New Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password (min. 8 characters)"
                                autoFocus
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {password && (
                            <div className="password-strength">
                                <div className="strength-bar">
                                    <div
                                        className="strength-fill"
                                        style={{
                                            width: `${(passwordStrength.level / 3) * 100}%`,
                                            backgroundColor: passwordStrength.color
                                        }}
                                    ></div>
                                </div>
                                <span style={{ color: passwordStrength.color }}>
                                    {passwordStrength.text}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter your password"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="password-requirements">
                        <p className="requirements-title">Requirements:</p>
                        <ul>
                            <li className={password.length >= 8 ? 'met' : ''}>
                                <span className="check">✓</span>
                                At least 8 characters
                            </li>
                            <li className={password === confirmPassword && password ? 'met' : ''}>
                                <span className="check">✓</span>
                                Passwords match
                            </li>
                        </ul>
                        <p style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '12px', marginBottom: '0' }}>
                            💡 Tip: Use a mix of letters, numbers, and symbols for a stronger password
                        </p>
                    </div>

                    <div className="checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                disabled={isLoading}
                            />
                            <span>
                                I understand that if I lose my password, I will need my seed phrase to recover my wallet.
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="setup-button"
                        disabled={isLoading || !password || !confirmPassword || !agreed}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Creating...
                            </>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Create Password
                            </>
                        )}
                    </button>
                </form>

                <div className="setup-footer">
                    <div className="info-box">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <p>
                            Your password protects your wallet locally on this device. Always keep your seed phrase safe as a backup!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetupPassword;
