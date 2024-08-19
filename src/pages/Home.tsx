
import LoadingBlock from "@/components/LoadingBlock";
import PollItem from "@/components/PollItem";
import useWeb3Function from "@/hooks/useWeb3Functions";
import useStore from "@/store";
import { useEffect } from "react";

export default function Home() {
  const { fetchAvailablePolls, loading } = useWeb3Function();
  const { availablePolls } = useStore();

  useEffect(() => {
    fetchAvailablePolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="space-y-8">
      <h2 className="text-2xl lg:text-4xl">
        Available Polls ({availablePolls.length})
      </h2>

      {loading ? (
        <LoadingBlock />
      ) : availablePolls.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-4">
          {availablePolls.map((poll, index) => (
            <PollItem key={index} item={poll} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl lg:text-3xl">No Voting Polls</h2>
        </div>
      )}
    </main>
  );
}
