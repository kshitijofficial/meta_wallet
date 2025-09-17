import { HDNodeWallet, Mnemonic, randomBytes } from 'ethers';

// Derive or generate a wallet account from a seed phrase.
// If no seed phrase is provided, a new 12-word phrase is generated.
export const deriveAccount = (seedPhrase, index = 0) => {

};

// Backwards compatible alias (in case of lingering imports)
export { deriveAccount as generateKeys };