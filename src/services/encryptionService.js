export const encryptData = async (data, password) => {
    try {
        const encoder = new TextEncoder();
        const passwordData = encoder.encode(password);

        const passwordHash = await crypto.subtle.digest('SHA-256', passwordData);

        const key = await crypto.subtle.importKey(
            'raw',
            passwordHash,
            { name: 'AES-GCM' },
            false,
            ['encrypt']
        );

        const iv = crypto.getRandomValues(new Uint8Array(12));

        const dataToEncypt = encoder.encode(data);
        const encryptedData = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            dataToEncypt
        )

        const encryptedArray = new Uint8Array(iv.length + encryptedData.byteLength);
        encryptedArray.set(iv, 0);
        encryptedArray.set(new Uint8Array(encryptedData), iv.length);

        return btoa(String.fromCharCode(...encryptedArray));

    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data')
    }
}


export const decryptData = async (encryptedText, password) => {
    try {
        const encoder = new TextEncoder();
        const passwordData = encoder.encode(password);

        const passwordHash = await crypto.subtle.digest('SHA-256', passwordData);

        const key = await crypto.subtle.importKey(
            'raw',
            passwordHash,
            { name: 'AES-GCM' },
            false,
            ['decrypt']
        );

        const encryptedArray = new Uint8Array(atob(encryptedText).split('').map(c => c.charCodeAt(0)))

        const iv = encryptedArray.slice(0, 12);
        const encryptData = encryptedArray.slice(12);

        const decryptData = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            encryptData
        )

        const decoder = new TextDecoder();
        return decoder.decode(decryptData);

    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data')
    }
}

export const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)));
}