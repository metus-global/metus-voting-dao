import { Address } from "viem";
import { Token } from "./types/Token";
import { bscTestnet } from "viem/chains";

const config = {
  chains: [bscTestnet],
  walletConnectProjectId: "", // REPLACE WITH YOUR WALLET CONNECT PROJECT ID

  rewardToken: {
    [bscTestnet.id]: {
      symbol: "",
      address: "", // YOUR REWARD TOKEN SMART CONTRACT
      decimals: 18,
    },
  } as Record<number, Token>,

  votingContract: {
    [bscTestnet.id]: "", // YOUR VOTING SMART CONTRACT
  } as Record<number, Address>,
};

export default config;
