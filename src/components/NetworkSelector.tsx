
import { useNetwork } from "wagmi";
import { Button } from "./ui/button";
import config from "@/config";
import { ChevronDownIcon } from "lucide-react";
import { useWeb3Modal } from "@web3modal/react";
import { cn } from "@/lib/utils";

export default function NetworkSelector({ className }: { className?: string }) {
  const { open } = useWeb3Modal();
  const { chain } = useNetwork();
  const selectedChain = chain || config.chains[0];
  return (
    <Button
      variant={"outline"}
      className={cn("gap-2", className)}
      onClick={() => open({ route: "SelectNetwork" })}
    >
      {/* {chain?.unsupported ? (
          <GlobeIcon className="object-contain w-6 h-6" />
        ) : (
          config.chainImages[selectedChain.id] && (
            <img
              src={config.chainImages[selectedChain.id]}
              alt={selectedChain.id.toString()}
              className="object-contain w-6 h-6"
            />
          )
        )} */}

      <span className="uppercase">
        {chain?.unsupported ? "Not supported" : selectedChain.name}
      </span>
      <ChevronDownIcon className="w-4 h-4" />
    </Button>
  );
}
