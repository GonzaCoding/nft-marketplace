import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import useSWR from "swr";
import { ethers } from 'ethers';

type UseOwnedNftsResponse = {
  
} 

type OwnedNftsHookFactory = CryptoHookFactory<Nft[], UseOwnedNftsResponse>;

export type UseOwnedNftsHook = ReturnType<OwnedNftsHookFactory>;

export const hookFactory: OwnedNftsHookFactory = ({contract}) => () => {
  
  const swrResponse = useSWR(
    contract ? "web3/useOwnedNfts" : null,
    async () => {
      const nfts = [] as Nft[];
      const coreNfts = await contract!.getOwnedNfts();

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
    }, {
      revalidateOnFocus: false,
    }
  );

  return {
    ...swrResponse,
    data: swrResponse.data || [],
  };
}

