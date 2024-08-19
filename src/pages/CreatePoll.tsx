
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useWeb3Function from "@/hooks/useWeb3Functions";
import { Loader2Icon, XIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import { useNavigate } from "react-router-dom";
import useStore from "@/store";
import { formatEther } from "viem";
import config from "@/config";

const chain = config.chains[0];

export default function CreatePoll() {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { loading, createPoll } = useWeb3Function();
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [candidates, setCandidates] = useState<string[]>([]);
  const [candidate, setCandidate] = useState("");
  const { createPollFee } = useStore();

  const navigate = useNavigate();

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isConnected) return open();

    if (candidates.length < 2) {
      toast.error("You need to add at least 2 candidates");
      return;
    }

    const { success } = await createPoll({
      name,
      options: candidates,
      endTime: BigInt(dayjs(time).unix()),
    });

    if (success) {
      navigate("/my-polls");
    }
  };

  const addCandidate = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!candidate) return;
      setCandidates([...candidates, candidate]);
      setCandidate("");
    }
  };
  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Create Poll</CardTitle>
        <CardDescription>
          Create a new poll to vote on with {formatEther(createPollFee)}{" "}
          {chain.nativeCurrency.symbol} fee.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="vote">Vote name</Label>
            <Input
              type="text"
              id="vote"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="time">Voting Time</Label>
            <Input
              type="datetime-local"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="candidates">Add Candidates</Label>
            <div className="space-y-3">
              <Input
                type="text"
                id="candidates"
                value={candidate}
                onChange={(e) => setCandidate(e.target.value)}
                onKeyDown={addCandidate}
              />
              <div className="flex flex-wrap gap-2">
                {candidates.map((candidate, index) => (
                  <Badge
                    key={index}
                    className="text-sm cursor-pointer"
                    onClick={() => {
                      setCandidates(candidates.filter((_, i) => i !== index));
                    }}
                  >
                    <XIcon className="w-4 h-4" />
                    <span>{candidate}</span>
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                By clicking Enter key to add Candidates to list, ex: Can1, Can2,
                Can3
              </p>
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />}{" "}
            Create Poll
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
