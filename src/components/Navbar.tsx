
import WalletConnect from "./WalletConnect";
import ToggleSidebarButton from "./ToggleSidebarButton";
import TotalEarningButton from "./TotalEarning";

export default function Navbar() {
  return (
    <nav className="fixed inset-0 z-30 h-20 border-b bg-background">
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        <ToggleSidebarButton className="inline-flex lg:hidden" />
        <a href="/" className="transition-opacity hover:opacity-75">
          Voting Dapp
        </a>
        <div className="flex gap-5">
          {/* <NetworkSelector className="hidden lg:inline-flex" /> */}
          <TotalEarningButton />
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
}
