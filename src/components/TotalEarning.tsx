
import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import config from "@/config";
import useWeb3Function from "@/hooks/useWeb3Functions";
import { useEffect } from "react";
import useStore from "@/store";
import { formatUnits } from "viem";

const chain = config.chains[0];
const rewardToken = config.rewardToken[chain.id];

export default function TotalEarning() {
  const { isConnected, address } = useAccount();
  const { fetchTotalEarned } = useWeb3Function();
  const { totalEarned } = useStore();

  useEffect(() => {
    if (!address) return;
    fetchTotalEarned();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  if (!isConnected) return null;

  return (
    <Button variant={"outline"} asChild>
      <a
        href={`${chain.blockExplorers.default.url}/address/${rewardToken.address}`}
        target="_blank"
      >
        <span className="hidden mr-1 lg:block">Total Earning: </span>
        {(+formatUnits(
          totalEarned,
          rewardToken.decimals
        )).toLocaleString()}{" "}
        {rewardToken.symbol}
      </a>
    </Button>
  );
}
