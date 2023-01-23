import { CryptoHookFactory } from "@_types/hooks";
import useSWR from "swr";

type UseNetworkResponse = {
  isLoading: boolean;
} 

type NetworkHookFactory = CryptoHookFactory<string, UseNetworkResponse>;

export type UseNetworkHook = ReturnType<NetworkHookFactory>;

export const hookFactory: NetworkHookFactory = ({provider, isLoading}) => (params) => {
  
  const swrResponse = useSWR(
    provider ? "web3/useNetwork" : null,
    async () => {
      
      return "Testing network";
    }, {
      revalidateOnFocus: false,
    }
  );

  return {
    ...swrResponse,
    isLoading: isLoading || swrResponse.isValidating,
  };
}

