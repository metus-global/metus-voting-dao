/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/config";
import { VotingAbi } from "@/contracts/abi/voting";
import useStore from "@/store";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getContract } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

const chain = config.chains[0];

function useWeb3Function() {
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletConnect } = useWalletClient();
  const { createPollFee, voteFee } = useStore();
  const votingContract = useMemo(
    () =>
      getContract({
        abi: VotingAbi,
        address: config.votingContract[chain.id],
        publicClient,
        walletClient: walletConnect || undefined,
      }),
    [publicClient, walletConnect]
  );

  const fetchInit = async () => {
    setLoading(true);
    const [createPollFee, voteFee, rewardAmount] = await Promise.all([
      votingContract.read.createPollFee(),
      votingContract.read.voteFee(),
      votingContract.read.rewardAmount(),
    ]);

    useStore.setState({ createPollFee, voteFee, rewardAmount });
    setLoading(false);
  };

  const fetchTotalEarned = async () => {
    if (!address) return;
    const totalEarned = await votingContract.read.userRewards([address]);
    useStore.setState({ totalEarned });
  };

  const fetchAvailablePolls = async () => {
    setLoading(true);
    try {
      const availablePolls = await votingContract.read.getAvailablePolls();
      useStore.setState({
        availablePolls: [...availablePolls].reverse(),
      });
    } catch (e: any) {
      toast.error(e?.walk?.()?.message || e?.message || "Error fetching polls");
    }
    setLoading(false);
  };

  const fetchPollById = async (id: bigint) => {
    setLoading(true);
    try {
      const poll = await votingContract.read.getPollDetails([id]);
      return poll;
    } catch (e: any) {
      toast.error(e?.walk?.()?.message || e?.message || "Error fetching polls");
    }
    setLoading(false);
  };

  const fetchMyPolls = async () => {
    setLoading(true);
    try {
      const myPolls = await votingContract.read.getMyPolls({
        account: address,
      });

      useStore.setState({
        myPolls: [...myPolls].reverse(),
      });
    } catch (e: any) {
      toast.error(e?.walk?.()?.message || e?.message || "Error fetching polls");
    }
    setLoading(false);
  };

  const togglePoll = async (payload: { pollId: bigint }) => {
    let success = false;
    if (!walletConnect || !address) return { success };

    setLoading(true);
    try {
      const { request } = await votingContract.simulate.togglePoll(
        [payload.pollId],
        { account: address }
      );
      const hash = await walletConnect.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      success = true;
    } catch (e: any) {
      toast.error(e?.walk?.()?.message || e?.message || "Error toggling poll");
    }

    setLoading(false);

    return { success };
  };

  const createPoll = async (payload: {
    name: string;
    options: string[];
    endTime: bigint;
  }) => {
    let success = false;
    if (!walletConnect || !address) return { success };

    setLoading(true);

    const balance = await publicClient.getBalance({ address });

    if (createPollFee > balance) {
      toast.error("Insufficient balance");
      setLoading(false);
      return { success };
    }

    try {
      const { request } = await votingContract.simulate.createPoll(
        [payload.name, payload.endTime, payload.options],
        {
          value: createPollFee,
          from: address,
        }
      );
      const hash = await walletConnect.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success("Poll created");
      success = true;
    } catch (e: any) {
      toast.error(e?.walk?.()?.message || e?.message || "Error creating poll");
    }

    setLoading(false);
    return { success };
  };

  const vote = async (payload: { pollId: bigint; optionId: bigint }) => {
    let success = false;

    if (!walletConnect || !address) return { success };

    setLoading(true);

    const balance = await publicClient.getBalance({ address });

    if (voteFee > balance) {
      toast.error("Insufficient balance");
      setLoading(false);
      return { success };
    }

    try {
      const { request } = await votingContract.simulate.vote(
        [payload.pollId, payload.optionId],
        { value: voteFee, account: address }
      );

      const hash = await walletConnect.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
      toast.success("Voted Successfully");

      fetchTotalEarned();
      success = true;
    } catch (e: any) {
      toast.error(e?.walk?.()?.message || e?.message || "Error voting");
    }

    setLoading(false);

    return { success };
  };

  return {
    createPoll,
    fetchInit,
    fetchMyPolls,
    fetchAvailablePolls,
    togglePoll,
    vote,
    fetchTotalEarned,
    fetchPollById,
    votingContract,
    loading,
  };
}

export default useWeb3Function;
