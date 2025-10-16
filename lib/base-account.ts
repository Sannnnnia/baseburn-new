import { createBaseAccountSDK } from '@base-org/account';
import { baseSepolia } from 'viem/chains';

type BaseAccountSDK = ReturnType<typeof createBaseAccountSDK>;
export type BaseAccountProvider = ReturnType<BaseAccountSDK['getProvider']>;

let sdkInstance: BaseAccountSDK | null = null;
let providerInstance: BaseAccountProvider | null = null;

type CreateBaseAccountOptions = Parameters<typeof createBaseAccountSDK>[0];

const sdkConfig: CreateBaseAccountOptions = {
  appName: 'BaseBurn',
  appLogoUrl: 'https://base.org/logo.png',
  appChainIds: [baseSepolia.id],
  subAccounts: {
    creation: 'on-connect',
    defaultAccount: 'sub'
  }
};

// Paymaster configuration
// Get your Paymaster URL from Coinbase Developer Platform: https://portal.cdp.coinbase.com/
// Navigate to: Onchain Tools > Paymaster
export function getPaymasterServiceUrl(): string | undefined {
  // In production, you should use a backend proxy to protect this URL
  return process.env.NEXT_PUBLIC_PAYMASTER_SERVICE_URL;
}

function initializeSdk(): BaseAccountSDK {
  if (sdkInstance) return sdkInstance;
  sdkInstance = createBaseAccountSDK(sdkConfig);
  return sdkInstance;
}

export function getBaseAccountSDK(): BaseAccountSDK | null {
  if (typeof window === 'undefined') return null;
  try {
    return initializeSdk();
  } catch (error) {
    console.error('Failed to initialize Base Account SDK:', error);
    return null;
  }
}

export function getBaseAccountProvider(): BaseAccountProvider | null {
  if (typeof window === 'undefined') return null;
  if (providerInstance) return providerInstance;

  const sdk = getBaseAccountSDK();
  if (!sdk) return null;

  providerInstance = sdk.getProvider();
  return providerInstance;
}

export function resetBaseAccountInstances() {
  sdkInstance = null;
  providerInstance = null;
}
