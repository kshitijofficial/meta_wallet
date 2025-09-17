import { useContext } from "react";
import { WalletContext } from "./WalletContext";

export function useWalletContext() {
    return useContext(WalletContext);
}