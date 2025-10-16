# Quick Start: Enable Paymaster (Gas Sponsorship)

## TL;DR - 3 Steps to Enable Gas Sponsorship

### Step 1: Get Your Paymaster URL

1. Go to [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Sign up or log in
3. Navigate to: **Onchain Tools** → **Paymaster**
4. Copy your Paymaster service URL

### Step 2: Configure Allowlist

In the CDP Paymaster dashboard:

**Add to allowlist:**
- Contract: `0x036CbD53842c5426634e7929541eC2318f3dCF7e` (USDC on Base Sepolia)
- Function: `transfer(address,uint256)`

This allows your paymaster to sponsor USDC transfer transactions.

### Step 3: Add Environment Variable

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_PAYMASTER_SERVICE_URL=https://api.developer.coinbase.com/rpc/v1/base-sepolia/YOUR_API_KEY
```

**Then restart your server:**

```bash
npm run dev
```

## That's It! 🎉

Now when users burn USDC, the gas fees will be sponsored by your paymaster. They'll see:

- ✅ "Sending sponsored burn transaction... 🎁" 
- ✅ No need for ETH in wallet
- ✅ Free transactions for users!

## Test It

1. Connect your Base Account wallet
2. Click "Burn USDC"  
3. In the Coinbase wallet popup, you should see that the transaction is sponsored (no gas fee)
4. Approve the transaction
5. 🔥 USDC gets burned, you gain XP, and no ETH was spent on gas!

## Troubleshooting

**Error: "insufficient balance to perform useroperation"**

This means paymaster is not configured properly. Check:

- [ ] Did you create `.env.local` with the correct URL?
- [ ] Did you add USDC contract to the allowlist in CDP?
- [ ] Did you restart the dev server after adding `.env.local`?
- [ ] Does your CDP paymaster have sufficient balance?

## Get Free Credits

Coinbase Developer Platform is offering **$15k in gas credits** for the Base Gasless Campaign!

[Learn more →](https://docs.base.org/base-account/base-gasless-campaign)

---

For detailed information, see [PAYMASTER_SETUP.md](./PAYMASTER_SETUP.md)

