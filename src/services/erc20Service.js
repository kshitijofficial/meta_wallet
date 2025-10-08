import { ethers } from "ethers";

// Standard ERC20 ABI for token operations
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function totalSupply() view returns (uint256)"
];

export const getTokenInfo = async (tokenAddress, rpcUrl) => {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    //Check if the address is a valid contract
    const code = await provider.getCode(tokenAddress);
    if (code === '0x') {
      throw new Error('Address is not a contract');
    }

    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals()
    ])

    return {
      address: tokenAddress,
      name,
      symbol,
      decimals: Number(decimals)
    }
  } catch (error) {
    console.error('Error fetching token info', error)
    throw error
  }
}

export const getTokenBalance = async (tokenAddress, walletAddress, rpcUrl) => {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

    const balance = await contract.balanceOf(walletAddress);
    console.log("Balance", balance)

    return balance
  } catch (error) {
    console.error('Error fetching token balance', error)
    throw error
  }
}

export const formateTokenBalance = (balance, decimals) => {
  return ethers.formatUnits(balance, decimals)
}