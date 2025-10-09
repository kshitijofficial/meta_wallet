const STORAGE_KEYS = {
    ENCRYPTED_WALLET: 'encrypted_wallet',
    WALLET_INITIALIZED: 'wallet_initialized',
    LAST_UNLOCK: 'last_unlock',
    AUTO_LOCK_TIME: 'auto_lock_time',
    IMPORTED_TOKENS: 'imported_tokens'
};

export const saveEncryptedWallet = (encryptedData) => {
    try {
        localStorage.setItem(STORAGE_KEYS.ENCRYPTED_WALLET, JSON.stringify(encryptedData));
        localStorage.setItem(STORAGE_KEYS.WALLET_INITIALIZED, 'true');
        localStorage.setItem(STORAGE_KEYS.LAST_UNLOCK, Date.now().toString())
        return true;
    } catch (error) {
        console.error('Error saving encrypte wallet:', error);
        return false;
    }
}

export const loadEncryptedWallet = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_WALLET);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error laoding encrypted wallet:', error);
        return null;
    }
}

export const isWalletInitialized = () => {
    return localStorage.getItem(STORAGE_KEYS.WALLET_INITIALIZED) === 'true';
}

export const clearWalletData = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    })
}

export const updateLastUnlock = () => {
    localStorage.setItem(STORAGE_KEYS.LAST_UNLOCK, Date.now().toString())
}

export const getLastUnlock = () => {
    const timestamp = localStorage.getItem(STORAGE_KEYS.LAST_UNLOCK);
    return timestamp ? parseInt(timestamp) : null;
}

export const setAutoLockTime = (minutes) => {
    localStorage.setItem(STORAGE_KEYS.AUTO_LOCK_TIME, minutes.toString());
};


export const getAutoLockTime = () => {
    const time = localStorage.getItem(STORAGE_KEYS.AUTO_LOCK_TIME);
    return time ? parseInt(time) : 15; // Default 15 minutes
};


export const shouldAutoLock = () => {
    const autoLockTime = getAutoLockTime();
    if (autoLockTime === 0) return false; //Never auto-lock

    const lastUnlock = getLastUnlock();
    if (!lastUnlock) return true;

    const now = Date.now();
    const timeSinceUnlock = now - lastUnlock;

    const autoLockMs = autoLockTime * 60 * 1000;
    return timeSinceUnlock >= autoLockMs;
}


export const saveImportedTokens = (tokens) => {
    try {
        localStorage.setItem(STORAGE_KEYS.IMPORTED_TOKENS, JSON.stringify(tokens));
        return true;
    } catch (error) {
        console.error('Error saving imported tokens:', error);
        return false;
    }
}

export const loadImportedTokens = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.IMPORTED_TOKENS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading imported tokens:', error);
        return [];
    }
}