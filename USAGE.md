# How to Use BaseBurn 🔥

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## Step-by-Step Guide

### 1. Connect Your Wallet
- Click the "Connect & Start Burning" button
- A popup will appear asking you to connect your Base Account
- Approve the connection

### 2. Create Sub-Account
- The app automatically creates a sub-account for you
- This sub-account is specific to this application
- You'll see both your universal address and sub-account address displayed

### 3. Start Burning!
- Click the "🔥 Burn 0.01 USDC" button
- The first transaction will require your approval
- **Automatic Spend Permissions**: After the first approval, the sub-account has permission to spend from your universal account
- Continue burning to earn XP and level up!

## How Sub-Accounts Work

### Automatic Creation
The app is configured with:
```javascript
subAccounts: {
  creation: 'on-connect',
  defaultAccount: 'sub',
}
```

This means:
- A sub-account is automatically created when you connect
- All transactions are sent from the sub-account by default
- No need to manually create or manage the sub-account

### Spend Permissions
- The sub-account can spend directly from your universal account's balance
- You don't need to transfer funds to the sub-account
- The first transaction will request spend permission
- Subsequent transactions happen automatically (up to the approved limit)

## XP System

- **1 Burn = 1 XP**
- **10 XP = 1 Level**
- Progress is saved in your browser's localStorage
- Watch the progress bar fill up as you earn XP!

## Technical Details

### USDC Contract
- **Address**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **Network**: Base Sepolia
- **Decimals**: 6

### Burn Address
- **Recipient**: `0x290214A838353fA1250c0A80b83bD6DA23985B1a`
- Each burn sends 0.01 USDC to this address

### Network
- **Chain ID**: 84532 (Base Sepolia)
- **RPC**: Uses Base's default RPC

## Getting Test USDC

You'll need USDC on Base Sepolia to use this app. You can:

1. **Bridge from Ethereum Sepolia**
   - Get Sepolia ETH from a faucet
   - Use the Base bridge to move to Base Sepolia
   - Swap for USDC

2. **Use Base Faucets**
   - Check Base's official documentation for testnet faucets
   - Some faucets provide USDC directly

## Troubleshooting

### "Insufficient Balance" Error
- Make sure you have USDC in your Base Account on Base Sepolia
- You need at least 0.01 USDC per burn

### "Transaction Failed" Error
- Check that you're connected to Base Sepolia
- Ensure you have enough ETH for gas fees
- Try refreshing the page and reconnecting

### Sub-Account Not Created
- Refresh the page and try connecting again
- Check browser console for errors
- Make sure you're using a supported browser (Chrome, Brave, Edge)

### XP Not Saving
- Check that localStorage is enabled in your browser
- Private/incognito mode may not persist data

## Advanced Configuration

### Adding a Paymaster
To sponsor gas fees for users, add a paymaster URL:

```javascript
capabilities: {
  paymasterUrl: "https://your-paymaster-url.com",
}
```

Update this in `app/page.tsx` in the `burnUSDC` function.

### Changing Burn Amount
Update the `BURN_AMOUNT` constant in `app/page.tsx`:

```javascript
const BURN_AMOUNT = '0.01'; // Change this value
```

### Modifying XP Requirements
To change XP needed per level, update the calculation:

```javascript
const xpForNextLevel = (level + 1) * 10; // Change multiplier
```

## Support

For issues or questions:
- Check the [Base Documentation](https://docs.base.org/base-account/)
- Review the code in `app/page.tsx`
- Check browser console for error messages

