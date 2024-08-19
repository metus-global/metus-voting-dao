
import { Poll } from "@/types/Poll";
import { RandomAvatar } from "react-random-avatars";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import dayjs from "dayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { BanIcon, CheckCircle2Icon, MoreVertical } from "lucide-react";
import useWeb3Function from "@/hooks/useWeb3Functions";
import { toast } from "react-toastify";
import useStore from "@/store";
import LoadingBlock from "./LoadingBlock";
import { useState } from "react";
import { Link } from "react-router-dom";

type Props = {
  item: Poll;
  enableOptions?: boolean;
};

export default function PollItem({ item, enableOptions }: Props) {
  const store = useStore();
  const [loading, setLoading] = useState(false);
  const { togglePoll } = useWeb3Function();

  const toggleAction = async () => {
    const result = confirm(
      `Are you sure you want to ${item.isValid ? "close" : "reopen"} this poll?`
    );
    if (!result) return;
    setLoading(true);
    const { success } = await togglePoll({ pollId: item.id });
    if (success) {
      store.togglePoll(item.id);
      toast.success(
        `Poll ${item.isValid ? "closed" : "reopened"} successfully`
      );
    }
    setLoading(false);
  };
  return (
    <Card>
      {loading && (
        <LoadingBlock className="absolute inset-0 bg-black/50 backdrop-blur-md" />
      )}
      <CardHeader className="flex-row items-center gap-3 border-b">
        <Link to={`/poll/${item.id}`}>
          <RandomAvatar name={item.name} size={40} />
        </Link>
        <div className="flex items-center justify-between w-full min-w-0">
          <div className="w-full">
            <Link
              to={`/poll/${item.id}`}
              className="text-xl font-medium leading-5"
            >
              {item.name}
            </Link>

            {enableOptions ? (
              <p>
                <Badge className="gap-1 px-2 mt-2">
                  {item.isValid ? (
                    <>
                      <CheckCircle2Icon className="w-4 h-4 text-green-600" />
                      Open
                    </>
                  ) : (
                    <>
                      <BanIcon className="w-4 h-4 text-red-600" />
                      Closed
                    </>
                  )}
                </Badge>
              </p>
            ) : (
              <p
                className="pt-2 text-xs truncate text-muted-foreground"
                title={item.owner}
              >
                Owner: {item.owner}
              </p>
            )}
          </div>
        </div>
        {enableOptions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size={"icon"}>
                <MoreVertical size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={() => toggleAction()}>
                {item.isValid ? "Close Poll" : "Reopen Poll"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="pt-4 pb-4 border-b">
        <div className="flex flex-row items-center justify-between ">
          <div>
            <p className="text-sm leading-normal">Total Voters</p>
            <p className="pt-2 text-sm leading-normal">
              {item.options.length} voters
            </p>
          </div>
          <div>
            <p className="text-sm">End Date</p>
            <p className="pt-2 text-sm">
              {dayjs.unix(Number(item.endTime)).format("MMM D, YYYY hh:mm A")}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4 pb-4">
        <div>
          <p className="mb-4">Candidates Names</p>
          <div className="flex flex-wrap gap-2">
            {item.options.map((option, index) => (
              <Badge key={index} className="text-sm">
                #{option}
              </Badge>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
