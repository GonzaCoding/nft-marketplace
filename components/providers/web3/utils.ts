import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers, ethers } from "ethers";
import { Web3Hooks, setupHooks } from '../../hooks/web3/setupHooks';
import { Web3Dependencies } from "@_types/hooks";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
}

export type Web3State = {
  isLoading: boolean;
  hooks: Web3Hooks;
} & Nullable<Web3Dependencies>;

export const createDefaultState = () => ({
  ethereum: null,
  provider: null,
  contract: null,
  isLoading: true,
  hooks: setupHooks({} as any)
});

export const createWeb3State = ({
  ethereum, provider, contract, isLoading
}: Web3Dependencies & {isLoading: boolean}) => ({
  ethereum,
  provider,
  contract,
  isLoading,
  hooks: setupHooks({ ethereum, provider, contract})
});

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (name: string, provider: providers.Web3Provider): Promise<Contract> => {

  if (!NETWORK_ID) return Promise.reject("Network ID is not defined");

  const response = await fetch(`/contracts/${name}.json`);
  const Artifact = await response.json();

  if (Artifact.networks[NETWORK_ID].address) {
    const contract = new ethers.Contract(
      Artifact.networks[NETWORK_ID].address,
      Artifact.abi,
      provider,
    );

    return contract;
  } else {
    return Promise.reject(`Contract: [${name}] cannot be loaded!`);
  }

}