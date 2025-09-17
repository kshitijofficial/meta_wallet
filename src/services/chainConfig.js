export const CHAINS = {
  1: { 
    name: 'Ethereum Mainnet', 
    rpc: import.meta.env.VITE_ETH_MAINNET_RPC 
  },
  11155111: { 
    name: 'Sepolia', 
    rpc: import.meta.env.VITE_SEPOLIA_RPC 
  },
  80002: { 
    name: 'Polygon Amoy', 
    rpc: import.meta.env.VITE_POLYGON_AMOY_RPC 
  }
};
