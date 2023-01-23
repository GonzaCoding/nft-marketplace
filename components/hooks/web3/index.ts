import { useHooks } from "@providers/web3"

export const useAccount = () => {
  const hooks = useHooks();
  const swrResponse = hooks.useAccount("");

  return {
    account: swrResponse
  }
}
