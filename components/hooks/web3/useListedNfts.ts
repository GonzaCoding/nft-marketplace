import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import useSWR from "swr";
import { ethers } from 'ethers';

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

  const buyNft = async (tokenId: number, value: number) => {
    try {
      const result = await contract?.buyNft(tokenId, {
        value: ethers.utils.parseEther(value.toString())
      });

      await result?.wait();
      alert("You have bought NFt. See profile page.");
    } catch (error: any) {
      console.error(error.message)
    }
  }

  return {
    ...swrResponse,
    data: swrResponse.data || [],
    buyNft,
  };
}

