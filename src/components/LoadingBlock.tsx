
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

export default function LoadingBlock({
  className,
  absolute = false,
}: {
  className?: string;
  absolute?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-6xl w-full mx-auto py-12 flex justify-center items-center",
        {
          "absolute inset-0 w-full h-full bg-black/50 z-20 backdrop-blur-sm":
            absolute,
        },
        className
      )}
    >
      <Loader2Icon className="animate-spin h-12 w-12 text-primary" />
    </div>
  );
}
