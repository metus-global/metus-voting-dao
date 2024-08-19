import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { ToastContainer } from "react-toastify";
// import { ThemeProvider } from "next-themes";
// import {
//   Hydrate,
//   QueryClient,
//   QueryClientProvider,
//   QueryFunctionContext,
// } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import config from "@/config";
import { ThemeProvider } from "./components/theme-provider";
// import { useState } from "react";
// import { useAxios } from "@/hooks/useAxios";

const projectId = config.walletConnectProjectId;

// Wagmi client
const { publicClient } = configureChains(config.chains, [
  w3mProvider({ projectId }),
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains: config.chains }),
  publicClient,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiConfig, config.chains);

export function Providers({ children }: { children: React.ReactNode }) {
  // const axios = useAxios();
  // const [queryClient] = useState(
  //   () =>
  //     new QueryClient({
  //       defaultOptions: {
  //         queries: {
  //           queryFn: async ({ queryKey }: QueryFunctionContext) => {
  //             const { data } = await axios.get(`${queryKey[0]}`);
  //             return data?.data;
  //           },
  //           refetchOnWindowFocus: false,
  //         },
  //       },
  //     })
  // );

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      <Web3Modal
        projectId={config.walletConnectProjectId}
        ethereumClient={ethereumClient}
        defaultChain={config.chains[0]}
      />

      <ToastContainer
        theme="dark"
        closeOnClick
        pauseOnHover
        position="bottom-center"
        hideProgressBar={true}
      />
    </ThemeProvider>
  );
}
