import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import useSWR from "swr";

type UseListedNftsResponse = {
  
} 

type ListedNftsHookFactory = CryptoHookFactory<string, UseListedNftsResponse>;

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>;

export const hookFactory: ListedNftsHookFactory = ({contract}) => () => {
  
  const swrResponse = useSWR(
    contract ? "web3/useListedNfts" : null,
    async () => {
      const coreNfts = await contract!.getAllNftsOnSale();

      const nfts = [] as any;
      return nfts;
    }
  );

  return {
    ...swrResponse,
    data: swrResponse.data || [],
  };
}

