import { Address } from "viem";

export type Poll = {
  id: bigint;
  endTime: bigint;
  isValid: boolean;
  name: string;
  options: readonly string[];
  optionsVoteCount: readonly bigint[];
  owner: Address;
  voters: readonly Address[];
};
