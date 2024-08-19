
import LoadingBlock from "@/components/LoadingBlock";
import PollItem from "@/components/PollItem";
import WalletConnect from "@/components/WalletConnect";
import useWeb3Function from "@/hooks/useWeb3Functions";
import useStore from "@/store";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function MyPolls() {
  const { isConnected, address } = useAccount();
  const { fetchMyPolls, loading } = useWeb3Function();
  const { myPolls } = useStore();

  useEffect(() => {
    if (!isConnected) return;
    fetchMyPolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  if (!isConnected) return <WalletConnect />;

  const availablePolls = myPolls.filter((poll) => poll.isValid);
  const endedPolls = myPolls.filter((poll) => !poll.isValid);

  return (
    <main className="space-y-8">
      <h2 className="text-2xl lg:text-4xl">
        My Active Polls ({availablePolls.length})
      </h2>
      {loading ? (
        <LoadingBlock />
      ) : availablePolls.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-4">
          {availablePolls.map((poll, index) => (
            <PollItem key={index} item={poll} enableOptions />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl lg:text-3xl">No Polls</h2>
        </div>
      )}
      <h2 className="text-2xl lg:text-4xl">
        My Ended Polls ({endedPolls.length})
      </h2>
      {loading ? (
        <LoadingBlock />
      ) : endedPolls.length ? (
        <div className="grid gap-6 lg:grid-cols-4">
          {endedPolls.map((poll, index) => (
            <PollItem key={index} item={poll} enableOptions />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl lg:text-3xl">No Polls</h2>
        </div>
      )}
    </main>
  );
}
