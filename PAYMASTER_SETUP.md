# Paymaster Setup Guide

This guide explains how to set up a Paymaster to sponsor gas fees for your users in BaseBurn.

## What is a Paymaster?

A Paymaster allows you to sponsor gas fees for your users' transactions. This means users can interact with your app without needing to hold ETH for gas fees, significantly improving the user experience.

## Setup Steps

### 1. Get Your Paymaster Service URL

1. Sign up for [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Navigate to **Onchain Tools > Paymaster**
3. Copy your Paymaster service URL

**Note:** Coinbase Developer Platform currently offers up to **$15k in gas credits** as part of the [Base Gasless Campaign](https://docs.base.org/base-account/base-gasless-campaign).

### 2. Configure Allowlist

In the Coinbase Developer Platform Paymaster settings:

1. Add the USDC contract address to your allowlist:
   - **Contract Address:** `0x036CbD53842c5426634e7929541eC2318f3dCF7e` (USDC on Base Sepolia)
   - **Function:** `transfer(address,uint256)`

2. This ensures only USDC transfers are sponsored by your Paymaster

### 3. Add Environment Variable

Create a `.env.local` file in the root of your project with:

```env
# Paymaster Service URL from Coinbase Developer Platform
NEXT_PUBLIC_PAYMASTER_SERVICE_URL=https://api.developer.coinbase.com/rpc/v1/base-sepolia/YOUR_API_KEY
```

Replace `YOUR_API_KEY` with your actual API key from Coinbase Developer Platform.

**Important for Production:**
- Create a backend proxy to protect your Paymaster service URL
- Never expose the URL directly in frontend code in production
- The proxy should validate requests before forwarding to the Paymaster service

### 4. Restart Your Development Server

```bash
npm run dev
```

## How It Works

Once configured, the app will:

1. Detect if a Paymaster service URL is configured
2. Include paymaster capabilities in transaction requests
3. Show "Sending sponsored burn transaction... 🎁" when gas is being sponsored
4. Users can burn USDC without needing ETH for gas fees!

## Verification

When a transaction is sent:
- ✅ If paymaster is configured: Transaction gas will be sponsored
- ❌ If not configured: Users will need ETH for gas fees

You can verify sponsorship in the Coinbase wallet UI - it will indicate "Sponsored" for transactions covered by the Paymaster.

## Troubleshooting

### "insufficient balance to perform useroperation" Error

This error means:
- The Paymaster service URL is not configured, OR
- The transaction is not in your allowlist, OR
- Your Paymaster account has insufficient funds

**Solutions:**
1. Ensure `.env.local` has the correct `NEXT_PUBLIC_PAYMASTER_SERVICE_URL`
2. Verify the USDC contract and `transfer` function are in your allowlist
3. Check your Paymaster balance in Coinbase Developer Platform
4. Restart the dev server after adding the environment variable

### Advanced: Custom Policies

For more control, you can create a custom `willSponsor` function. See the [Base documentation](https://docs.base.org/base-account/improve-ux/sponsor-gas/paymasters) for details.

## Production Considerations

1. **Use a Proxy:** Protect your Paymaster URL with a backend proxy
2. **Rate Limiting:** Implement rate limiting to prevent abuse
3. **Monitoring:** Track sponsored transactions and costs
4. **Allowlist Management:** Regularly review and update your contract allowlist

## Resources

- [Base Paymaster Documentation](https://docs.base.org/base-account/improve-ux/sponsor-gas/paymasters)
- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
- [Base Gasless Campaign](https://docs.base.org/base-account/base-gasless-campaign)
- [ERC-7677 Standard](https://eips.ethereum.org/EIPS/eip-7677)

