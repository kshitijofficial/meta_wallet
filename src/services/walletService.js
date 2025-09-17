import { HDNodeWallet, Mnemonic, randomBytes } from 'ethers';

// Derive or generate a wallet account from a seed phrase.
// If no seed phrase is provided, a new 12-word phrase is generated.
export const deriveAccount = (seedPhrase, index = 0) => {
    let mnemonic;

    if (seedPhrase) {
        mnemonic = Mnemonic.fromPhrase(seedPhrase);
    } else {
        const entropy = randomBytes(16);
        mnemonic = Mnemonic.fromEntropy(entropy);
        seedPhrase = mnemonic.phrase;
    }
    const path = `m/44'/60'/0'/0/${index}`;
    const wallet = HDNodeWallet.fromMnemonic(mnemonic, path);

    return {
        seedPhrase,
        privateKey: wallet.privateKey,
        address: wallet.address,
        index
    }
};

// Backwards compatible alias (in case of lingering imports)
export { deriveAccount as generateKeys };