import { useCallback } from "react";
import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import useSWR from "swr";
import { ethers } from 'ethers';
import { toast } from "react-toastify";

type UseOwnedNftsResponse = {
  listNft: (tokenId: number, newPrice: number) => Promise<void>;
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

  // workaround because it's undefined in first render
  const _contract = contract;

  const listNft = useCallback(async (tokenId: number, newPrice: number) => {
    try {
      const result = await _contract!.placeNftOnSale(
        tokenId,
        ethers.utils.parseEther(newPrice.toString()),
        {
          value: ethers.utils.parseEther((0.025).toString())
        }
      );
      
      await toast.promise(
        result!.wait(), {
          pending: "Processing transaction",
          success: "Item has been listed",
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
    listNft,
  };
}

