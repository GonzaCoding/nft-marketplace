import { useCallback } from "react";
import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import useSWR from "swr";
import { ethers } from 'ethers';
import { toast } from "react-toastify";

type UseListedNftsResponse = {
  buyNft: (tokenId: number, value: number) => Promise<void>;
};

type ListedNftsHookFactory = CryptoHookFactory<Nft[], UseListedNftsResponse>;

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>;

export const hookFactory: ListedNftsHookFactory = ({contract}) => () => {
  
  const swrResponse = useSWR(
    contract ? "web3/useListedNfts" : null,
    async () => {
      const nfts = [] as Nft[];
      const coreNfts = await contract!.getAllNftsOnSale();

      for (let i = 0; i < coreNfts.length; i++) {
        const item = coreNfts[i];
        const tokenURI = await contract!.tokenURI(item.tokenId);
        const metaResponse = await fetch(tokenURI);
        const metaData = await metaResponse.json();

        nfts.push({
          price: parseFloat(ethers.utils.formatEther(item.price)),
          tokenId: item.tokenId.toNumber(),
          creator: item.creator,
          isListed: item.isListed,
          meta: metaData,
        })
      }
      
      return nfts;
    }
  );

  // workaround because it's undefined in first render
  const _contract = contract;

  const buyNft = useCallback(async (tokenId: number, value: number) => {
    try {
      const result = await _contract!.buyNft(tokenId, {
        value: ethers.utils.parseEther(value.toString())
      });

      await toast.promise(
        result!.wait(), {
          pending: "Processing transaction",
          success: "Nft is yours! Go to profile page",
          error: "Processing error"
        }
      );
    } catch (error: any) {
      console.error(error.message)
    }
  }, [_contract]);

  return {
    ...swrResponse,
    data: swrResponse.data || [],
    buyNft,
  };
}

