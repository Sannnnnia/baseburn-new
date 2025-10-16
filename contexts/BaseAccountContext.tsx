'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getBaseAccountProvider, getBaseAccountSDK } from '@/lib/base-account';
import type { BaseAccountProvider as BaseAccountProviderType } from '@/lib/base-account';

interface SubAccount {
  address: `0x${string}`;
  factory?: `0x${string}`;
  factoryData?: `0x${string}`;
}

interface GetSubAccountsResponse {
  subAccounts: SubAccount[];
}

interface BaseAccountContextType {
  provider: BaseAccountProviderType | null;
  connected: boolean;
  universalAddress: `0x${string}` | '';
  subAccount: SubAccount | null;
  loading: boolean;
  status: string;
  connectWallet: () => Promise<void>;
  resetState: () => void;
  setStatus: (message: string) => void;
}

export const BaseAccountContext = createContext<BaseAccountContextType | undefined>(undefined);

export function BaseAccountProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<BaseAccountProviderType | null>(null);
  const [connected, setConnected] = useState(false);
  const [universalAddress, setUniversalAddress] = useState<`0x${string}` | ''>('');
  const [subAccount, setSubAccount] = useState<SubAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatusState] = useState('Initializing Base Account SDK...');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sdk = getBaseAccountSDK();
    if (!sdk) {
      setStatusState('SDK initialization failed');
      return;
    }

    const providerInstance = getBaseAccountProvider();
    if (!providerInstance) {
      setStatusState('Provider not available');
      return;
    }

    setProvider(providerInstance);
    setStatusState('SDK initialized - ready to connect');
  }, []);

  const connectWallet = useCallback(async () => {
    if (!provider) {
      setStatusState('Provider not initialized');
      return;
    }

    setLoading(true);
    setStatusState('Connecting wallet and creating sub account...');

    try {
      // Trigger Base Account connection flow
      await provider.request({ method: 'wallet_connect', params: [] });

      const accounts = (await provider.request({
        method: 'eth_requestAccounts',
        params: []
      })) as string[];

      // In Base Account, accounts[0] commonly maps to sub account, accounts[1] to universal account
      const subAddr = (accounts[0] ?? '') as `0x${string}`;
      const universalAddr = (accounts[1] ?? '') as `0x${string}`;

      setUniversalAddress(universalAddr);
      setConnected(true);

      let resolvedSubAccount: SubAccount | null = null;

      if (universalAddr) {
        try {
          const response = (await provider.request({
            method: 'wallet_getSubAccounts',
            params: [
              {
                account: universalAddr,
                domain: typeof window !== 'undefined' ? window.location.origin : ''
              }
            ]
          })) as GetSubAccountsResponse;

          resolvedSubAccount =
            response.subAccounts.find((account) => account.address?.toLowerCase() === subAddr.toLowerCase()) || null;
        } catch (subAccountError) {
          console.warn('Failed to fetch sub accounts:', subAccountError);
        }
      }

      if (!resolvedSubAccount && subAddr) {
        resolvedSubAccount = { address: subAddr };
      }

      setSubAccount(resolvedSubAccount);
      setStatusState('Connected! Sub Account automatically created');
    } catch (error) {
      console.error('Connection failed:', error);
      setStatusState(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [provider]);

  const resetState = useCallback(() => {
    setConnected(false);
    setUniversalAddress('');
    setSubAccount(null);
    setStatusState('Ready to connect');
  }, []);

  const setStatus = useCallback((message: string) => {
    setStatusState(message);
  }, []);

  const value = useMemo<BaseAccountContextType>(
    () => ({
      provider,
      connected,
      universalAddress,
      subAccount,
      loading,
      status,
      connectWallet,
      resetState,
      setStatus
    }),
    [provider, connected, universalAddress, subAccount, loading, status, connectWallet, resetState, setStatus]
  );

  return <BaseAccountContext.Provider value={value}>{children}</BaseAccountContext.Provider>;
}

export function useBaseAccountContext() {
  const context = useContext(BaseAccountContext);
  if (!context) {
    throw new Error('useBaseAccountContext must be used within a BaseAccountProvider');
  }
  return context;
}
