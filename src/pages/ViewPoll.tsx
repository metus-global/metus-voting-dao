
import LoadingBlock from "@/components/LoadingBlock";
import WalletConnect from "@/components/WalletConnect";
import { Card, CardContent } from "@/components/ui/card";
import useWeb3Function from "@/hooks/useWeb3Functions";
import { Poll } from "@/types/Poll";
import { useEffect, useState } from "react";
import { RandomAvatar } from "react-random-avatars";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import Countdown from "react-countdown";
import dayjs from "dayjs";
import {
  CalendarIcon,
  CircleDollarSignIcon,
  CoinsIcon,
  Loader2Icon,
  UsersIcon,
  VoteIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import config from "@/config";
import useStore from "@/store";
import { formatEther, formatUnits } from "viem";

const chain = config.chains[0];
const rewardToken = config.rewardToken[chain.id];

export default function ViewPoll() {
  const { id } = useParams();
  const [poll, setPoll] = useState<Poll | undefined>();
  const [pageLoading, setPageLoading] = useState(false);
  const { votingContract, vote, loading } = useWeb3Function();
  const { isConnected, address } = useAccount();
  const { voteFee, rewardAmount } = useStore();
  const [winners, setWinner] = useState<string[]>([]);

  const fetchPoll = async () => {
    if (!id) return;
    setPageLoading(true);
    try {
      const poll = await votingContract.read.getPollDetails([BigInt(id)]);
      setPoll(poll);

      // calculate winner
      let _winners: string[] = [];
      let winnerVoteCount = 0n;
      poll.optionsVoteCount.forEach((item, index) => {
        if (item === 0n) return;
        else if (item > winnerVoteCount) {
          _winners = [poll.options[index]];
          winnerVoteCount = item;
        } else if (item === winnerVoteCount) {
          _winners.push(poll.options[index]);
        }
      });

      setWinner(_winners);
    } catch (e) {
      toast.error("Poll Not Found, or Something Went Wrong");
    }
    setPageLoading(false);
  };

  const voteAction = async (index: number) => {
    if (!poll || !id) return;

    const { success } = await vote({
      pollId: BigInt(id),
      optionId: BigInt(index),
    });

    if (success) {
      fetchPoll();
    }
  };

  useEffect(() => {
    fetchPoll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (pageLoading) return <LoadingBlock />;

  if (!poll?.name)
    return (
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-4xl">Poll Not Found</h2>
      </div>
    );

  const time = dayjs.unix(Number(poll.endTime));
  const alreadyVoted = poll.voters.some((i) => i === address);

  return (
    <div>
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex items-center w-full">
              <RandomAvatar name={poll.name} size={40} />
              <div className="ml-2">
                <h2 className="text-2xl font-bold">{poll.name.toString()}</h2>
                <p className="text-xs text-muted-foreground">Voting Title</p>
              </div>
            </div>
            <p className="w-full min-w-0 px-3 py-2 text-sm truncate rounded bg-muted">
              Owner: {poll.owner.toString()}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid gap-y-4 lg:divide-x lg:grid-cols-4">
            <div className="flex items-center w-full gap-4 lg:px-4">
              <UsersIcon className="w-12 h-12 text-indigo-600" />
              <div>
                <p className="mb-1 text-xl font-bold">{poll.options.length}</p>
                <p className="text-muted-foreground">Elections</p>
              </div>
            </div>
            <div className="flex items-center w-full gap-4 lg:px-4">
              <CalendarIcon className="w-12 h-12 text-indigo-600" />
              <div>
                <p className="mb-1 text-lg font-bold">
                  {time.format("MMM D, YYYY hh:mm A")}
                </p>
                <p className="text-muted-foreground">End Time</p>
              </div>
            </div>
            <div className="flex items-center w-full gap-4 lg:px-4">
              <CircleDollarSignIcon className="w-12 h-12 text-indigo-600" />
              <div>
                <p className="mb-1 text-xl font-bold">
                  {formatEther(voteFee)} {chain.nativeCurrency.symbol}
                </p>
                <p className="text-muted-foreground">Vote Fee</p>
              </div>
            </div>
            <div className="flex items-center w-full gap-4 lg:px-4">
              <CoinsIcon className="w-12 h-12 text-indigo-600" />
              <div>
                <p className="mb-1 text-xl font-bold">
                  {formatUnits(rewardAmount, rewardToken.decimals)}{" "}
                  {rewardToken.symbol}
                </p>
                <p className="text-muted-foreground">Vote Reward</p>
              </div>
            </div>
          </div>
          <div className="grid divide-x lg:grid-cols-2"></div>
        </CardContent>
      </Card>
      <div className="mt-12 mb-6">
        {poll.isValid ? (
          dayjs.unix(Number(poll.endTime)).isAfter(dayjs()) ? (
            <div className="flex flex-col items-center justify-center mx-auto">
              <p className="mb-3 text-xl font-semibold lg:text-2xl">
                Time Remaing
              </p>
              <p className="mb-4 text-4xl font-bold lg:text-6xl">
                <Countdown date={dayjs.unix(Number(poll.endTime)).valueOf()} />
              </p>
            </div>
          ) : (
            <p className="text-3xl font-bold text-center lg:text-6xl">
              Time is Over
            </p>
          )
        ) : (
          <p className="text-3xl font-bold text-center lg:text-6xl">
            Voting Poll Closed
          </p>
        )}
      </div>
      <Card className="text-white bg-gradient-to-l from-indigo-600 to-indigo-700">
        <CardContent className="max-w-4xl p-6 mx-auto">
          <h2 className="mt-10 mb-4 text-3xl font-black leading-10 text-center text-white lg:text-6xl ">
            Winner <span className="text-green-400 "> : </span>{" "}
            {winners.length > 0 ? winners.join(" & ") : "Unkown"}
          </h2>
          <p className="mb-6 text-sm leading-6 text-center text-white lg:mb-12 lg:text-lg md:text-base">
            Select who want to give to him your voice and mint your voice to
            blockchain Network
          </p>
          {alreadyVoted && (
            <p className="mb-12 font-semibold text-center text-green-400 lg:text-4xl">
              You Already Voted
            </p>
          )}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {poll.options.map((item, index) => (
              <Card key={index} className="bg-muted">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <h2 className="mb-3 text-2xl font-bold text-center lg:text-5xl">
                    {poll.optionsVoteCount[index].toString()}
                  </h2>
                  <p className="mb-6 text-sm font-semibold lg:text-lg">
                    {item}
                  </p>
                  {isConnected ? (
                    <>
                      {!alreadyVoted && poll.isValid && (
                        <Button
                          onClick={() => voteAction(index)}
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <VoteIcon className="mr-2 " />
                          )}
                          Vote
                        </Button>
                      )}
                    </>
                  ) : (
                    <WalletConnect />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="py-12">
        <h2 className="mx-auto mb-6 text-3xl font-bold">User Already Voted</h2>
        <Card>
          {poll.voters.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-6 text-sm"></th>
                  <th className="px-4 py-6 text-sm text-left">User Address</th>
                  <th className="px-4 py-6 text-sm font-bold text-left">
                    {poll.voters.length} Voters
                  </th>
                </tr>
              </thead>
              <tbody>
                {poll.voters.map((item) => (
                  <tr className="border-b">
                    <td className="px-4 py-6 text-sm">
                      <div className="flex justify-end">
                        <RandomAvatar name={item.toString()} size={40} />
                      </div>
                    </td>
                    <td className="py-6 px-4 text-sm truncate max-lg:max-w-[10rem]">
                      {item}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex items-center justify-center w-full h-32">
              <p className="text-xl font-semibold text-center text-gray-400">
                No One Voted Yet
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
