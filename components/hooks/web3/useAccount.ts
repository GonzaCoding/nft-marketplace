import { CryptoHookFactory } from "@_types/hooks";
import useSWR from "swr";

type AccountHookFactory = CryptoHookFactory<string, string>;

export type UseAccountHook = ReturnType<AccountHookFactory>;

export const hookFactory: AccountHookFactory = (deps) => (params) => {
  
  const swrResponse = useSWR("web3/useAccount", () => {
    console.log(deps);
    console.log(params);
    return "Test User";
  });

  return swrResponse;
}

export const useAccount = hookFactory({ ethereum: undefined, provider: undefined, contract: undefined});
