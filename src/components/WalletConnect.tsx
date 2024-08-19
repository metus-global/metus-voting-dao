
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { Button } from "./ui/button";
import { useWeb3Modal } from "@web3modal/react";
import { WalletIcon } from "lucide-react";
import { useEffect } from "react";
import config from "@/config";

export default function WalletConnect() {
  const { open } = useWeb3Modal();
  const { chain } = useNetwork();
  const { isConnected, address } = useAccount();
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (!chain) return;

    if (chain.unsupported) {
      switchNetwork?.(config.chains[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain]);

  return isConnected ? (
    <Button
      className="gap-2 max-lg:h-10 max-lg:w-10 max-lg:px-0 max-lg:py-0"
      onClick={() => open()}
    >
      <WalletIcon className="w-6 h-6" />

      <span className="hidden font-semibold lg:inline">
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </span>
    </Button>
  ) : (
    <Button onClick={() => open()}>Connect</Button>
  );
}
