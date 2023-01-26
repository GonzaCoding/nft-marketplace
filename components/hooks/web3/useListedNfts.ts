import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import useSWR from "swr";
import { ethers } from 'ethers';

type UseListedNftsResponse = {
  
} 

type ListedNftsHookFactory = CryptoHookFactory<Nft[], UseListedNftsResponse>;

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>;

export const hookFactory: ListedNftsHookFactory = ({contract}) => () => {
  
  const swrResponse = useSWR(
    contract ? "web3/useListedNfts" : null,
    async () => {
      const nfts = [] as Nft[];
      const coreNfts = await contract!.getAllNftsOnSale();

      coreNfts.forEach(async (nft) => {
        const tokenURI = await contract!.tokenURI(nft.tokenId);
        const metaResponse = await fetch(tokenURI);
        const metaData = await metaResponse.json();

        nfts.push({
          price: parseFloat(ethers.utils.formatEther(nft.price)),
          tokenId: nft.tokenId.toNumber(),
          creator: nft.creator,
          isListed: nft.isListed,
          meta: metaData,
        })
      });
      
      return nfts;
    }
  );

  return {
    ...swrResponse,
    data: swrResponse.data || [],
  };
}

