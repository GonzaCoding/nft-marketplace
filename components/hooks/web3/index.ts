import { useHooks } from "@providers/web3"

export const useAccount = () => {
  const hooks = useHooks();
  const swrResponse = hooks.useAccount();

  return {
    account: swrResponse
  }
}

export const useNetwork = () => {
  const hooks = useHooks();
  const swrResponse = hooks.useNetwork();

  return {
    network: swrResponse,
  }
}

export const useListedNfts = () => {
  const hooks = useHooks();
  const swrResponse = hooks.useListedNfts();

  return {
    nfts: swrResponse,
  }
}

export const useOwnedNfts = () => {
  const hooks = useHooks();
  const swrResponse = hooks.useOwnedNfts();

  return {
    nfts: swrResponse,
  }
}