import { CryptoHookFactory } from "@_types/hooks";
import useSWR from "swr";
import { useEffect } from 'react';

type UseAccountResponse = {
  connect: () => void;
  isLoading: boolean;
  isInstalled: boolean;
} 

type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>;

export type UseAccountHook = ReturnType<AccountHookFactory>;

export const hookFactory: AccountHookFactory = ({provider, ethereum, isLoading}) => () => {
  
  const swrResponse = useSWR(
    provider ? "web3/useAccount" : null,
    async () => {
      const accounts = await provider!.listAccounts();
      const account = accounts[0];

      if (!account) {
        throw "Cannot retreive account! Please, connect to web3 wallet."
      }

      return account;
    }, {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  useEffect(() => {
    ethereum?.on("accountsChanged", handleAccountsChanged);

    return () => {
      ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    }
  });

  const handleAccountsChanged = (...args: unknown[]) => {
    const accounts = args[0] as string[];
    if (accounts.length === 0) {
      console.error("Please, connect to Web3 wallet.");
    } else if (accounts[0] !== swrResponse.data) {
      swrResponse.mutate(accounts[0]);
    }
  }


  const connect = async () => {
    try {
      ethereum?.request({ method: "eth_requestAccounts"})
    } catch (e) {
      console.error(e);
    }
  }

  return {
    ...swrResponse,
    isLoading: isLoading || swrResponse.isValidating,
    isInstalled: ethereum?.isMetaMask || false,
    connect
  };
}

