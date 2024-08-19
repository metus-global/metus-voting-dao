import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { Link, useLocation } from "react-router-dom";

type SidebarSubItemType = {
  name: string;
  link: string;
};

export type SidebarItemType = {
  name: string;
  link?: string;
  type?: "external";
  icon: JSX.Element;
  subItems?: SidebarSubItemType[];
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  active?: boolean;
}

const SidebarItemLink = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, active, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex justify-between px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-auto text-base items-center gap-2 w-full",
          { "bg-accent text-accent-foreground": active },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

SidebarItemLink.displayName = "SidebarItemLink";

export default function SidebarItem({ item }: { item: SidebarItemType }) {
  const { pathname } = useLocation();
  const [active, setActive] = useState(
    item.subItems?.some((subItem) => subItem.link === pathname)
  );
  if (item.subItems) {
    return (
      <div>
        <SidebarItemLink
          className="justify-between"
          onClick={() => setActive(!active)}
        >
          <div className="flex items-center gap-2">
            {item.icon}
            <span>{item.name}</span>
          </div>
          <ChevronDown
            className={cn("h-4 w-4 transition-all", { "rotate-180": active })}
          />
        </SidebarItemLink>

        {active && (
          <div className={cn("overflow-hidden space-y-1")}>
            {item.subItems.map((subItem, subKey) => (
              <SidebarItemLink
                className="justify-start text-sm font-normal pl-11"
                active={subItem.link === pathname}
                key={subKey}
                asChild
              >
                <Link to={subItem.link}>{subItem.name}</Link>
              </SidebarItemLink>
            ))}
          </div>
        )}
      </div>
    );
  } else if (item.type === "external") {
    return (
      <SidebarItemLink className="justify-start" asChild>
        <a href={item.link} target="_blank">
          {item.icon}
          <span>{item.name}</span>
        </a>
      </SidebarItemLink>
    );
  } else if (item.link) {
    return (
      <SidebarItemLink
        className="justify-start"
        asChild
        active={item.link === pathname}
      >
        <Link to={item.link}>
          {item.icon}
          <span>{item.name}</span>
        </Link>
      </SidebarItemLink>
    );
  }
}
