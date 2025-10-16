'use client';

import { useEffect, useState, useCallback } from 'react';
import { baseSepolia } from 'viem/chains';
import { encodeFunctionData, parseUnits } from 'viem';
import { WalletConnection } from '@/components/WalletConnection';
import { useBaseAccountContext } from '@/contexts/BaseAccountContext';
import { getPaymasterServiceUrl } from '@/lib/base-account';

// USDC on Base Sepolia
const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
const BURN_ADDRESS = '0x290214A838353fA1250c0A80b83bD6DA23985B1a';
const BURN_AMOUNT = '1.00'; // 0.01 USDC per burn

// ERC20 Transfer ABI
const TRANSFER_ABI = {
  inputs: [
    { name: 'to', type: 'address' },
    { name: 'amount', type: 'uint256' }
  ],
  name: 'transfer',
  outputs: [{ name: '', type: 'bool' }],
  stateMutability: 'nonpayable',
  type: 'function'
} as const;

// Using BaseAccountContext for provider and accounts

export default function Home() {
  const { provider, subAccount, universalAddress, connected, status, setStatus } = useBaseAccountContext();
  const [loading, setLoading] = useState(false);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(0);
  const [burnCount, setBurnCount] = useState(0);

  // Calculate level and progress
  const xpForNextLevel = (level + 1) * 10;
  const progress = ((xp % 10) / 10) * 100;
  const currentLevelXp = xp % 10;

  // Load saved XP from localStorage
  useEffect(() => {
    const savedXp = localStorage.getItem('baseburn_xp');
    const savedBurnCount = localStorage.getItem('baseburn_burns');
    if (savedXp) {
      const xpNum = parseInt(savedXp);
      setXp(xpNum);
      setLevel(Math.floor(xpNum / 10));
    }
    if (savedBurnCount) {
      setBurnCount(parseInt(savedBurnCount));
    }
  }, []);

  const burnUSDC = async () => {
    if (!provider || !subAccount) {
      setStatus('Please connect wallet first');
      return;
    }

    setLoading(true);
    setStatus('Preparing to burn USDC... 🔥');

    try {
      // Encode transfer function call
      const data = encodeFunctionData({
        abi: [TRANSFER_ABI],
        functionName: 'transfer',
        args: [BURN_ADDRESS, parseUnits(BURN_AMOUNT, 6)] // USDC has 6 decimals
      });

      setStatus('Sending burn transaction...');

      // Get paymaster service URL for sponsored transactions
      const paymasterServiceUrl = getPaymasterServiceUrl();

      // Build transaction params with optional paymaster capability
      const transactionParams: any = {
        version: '1.0',
        chainId: `0x${baseSepolia.id.toString(16)}`,
        from: subAccount.address,
        calls: [
          {
            to: USDC_ADDRESS,
            data: data,
            value: '0x0'
          }
        ]
      };

      // Add paymaster capability if URL is configured
      if (paymasterServiceUrl) {
        transactionParams.capabilities = {
          paymasterService: {
            url: paymasterServiceUrl
          }
        };
        setStatus('Sending sponsored burn transaction... 🎁');
      }

      // Send transaction from sub account
      const callsId = await provider.request({
        method: 'wallet_sendCalls',
        params: [transactionParams]
      });

      // Update XP
      const newXp = xp + 1;
      const newBurnCount = burnCount + 1;
      const newLevel = Math.floor(newXp / 10);

      setXp(newXp);
      setBurnCount(newBurnCount);
      setLevel(newLevel);

      // Save to localStorage
      localStorage.setItem('baseburn_xp', newXp.toString());
      localStorage.setItem('baseburn_burns', newBurnCount.toString());

      // Check for level up
      if (newLevel > level) {
        setStatus(`🎉 LEVEL UP! You're now Level ${newLevel}! Burn #${newBurnCount} complete!`);
      } else {
        setStatus(`🔥 Burn #${newBurnCount} successful! +1 XP (${currentLevelXp + 1}/10)`);
      }

      console.log('Burn successful! Calls ID:', callsId);
    } catch (error: any) {
      console.error('Burn failed:', error);
      setStatus(`Burn failed: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">🔥 BaseBurn</h1>
        <p className="subtitle">Burn USDC, Earn XP, Level Up!</p>

        {/* Wallet Connection */}
        <WalletConnection />

        {/* XP Progress Bar */}
        <div className="xp-container">
          <div className="level-badge">Level {level}</div>
          <div className="xp-bar-container">
            <div className="xp-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="xp-text">
            {currentLevelXp} / 10 XP
            <span className="total-xp">Total: {xp} XP</span>
          </div>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat">
            <div className="stat-value">{burnCount}</div>
            <div className="stat-label">Total Burns</div>
          </div>
          <div className="stat">
            <div className="stat-value">{xp}</div>
            <div className="stat-label">Total XP</div>
          </div>
        </div>

        {/* Status */}
        <div className="status">{status}</div>

        {/* Wallet Info */}
        {connected && (
          <div className="wallet-info">
            <div className="address-row">
              <span className="label">Universal:</span>
              <span className="address">
                {universalAddress.slice(0, 6)}...{universalAddress.slice(-4)}
              </span>
            </div>
            {subAccount && (
              <div className="address-row">
                <span className="label">Sub Account:</span>
                <span className="address">
                  {subAccount.address.slice(0, 6)}...{subAccount.address.slice(-4)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="actions">
          {!connected ? (
            <button disabled className="btn btn-primary">
              Connect above to start
            </button>
          ) : (
            <button onClick={burnUSDC} disabled={loading} className="btn btn-burn">
              {loading ? 'Burning...' : `🔥 Burn ${BURN_AMOUNT} USDC`}
            </button>
          )}
        </div>

        {/* Info */}
        <div className="info">
          <p>💡 Each burn sends {BURN_AMOUNT} USDC and earns you 1 XP</p>
          <p>⚡ Level up every 10 XP!</p>
          <p>
            🎯 Burn to: {BURN_ADDRESS.slice(0, 6)}...{BURN_ADDRESS.slice(-4)}
          </p>
        </div>
      </div>

      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 650px;
          width: 100%;
        }

        .card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 28px;
          padding: 48px;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        }

        .title {
          font-size: 48px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #fff 0%, #ffd700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          text-align: center;
          font-size: 18px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 32px;
        }

        .xp-container {
          margin: 32px 0;
        }

        .level-badge {
          display: inline-block;
          background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
          color: #001a66;
          padding: 10px 20px;
          border-radius: 24px;
          font-weight: 700;
          font-size: 15px;
          margin-bottom: 16px;
          box-shadow: 0 4px 16px rgba(255, 215, 0, 0.3);
          transition: transform 0.2s ease;
        }

        .level-badge:hover {
          transform: scale(1.05);
        }

        .xp-bar-container {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          height: 24px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .xp-bar {
          background: linear-gradient(90deg, #ffd700 0%, #ff8c00 100%);
          height: 100%;
          border-radius: 12px;
          transition: width 0.5s ease;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
        }

        .xp-text {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
        }

        .total-xp {
          color: rgba(255, 255, 255, 0.6);
        }

        .stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%);
          border-radius: 20px;
          padding: 24px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #ffd700, #ff8c00);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(255, 215, 0, 0.2);
        }

        .stat:hover::before {
          opacity: 1;
        }

        .stat-value {
          font-size: 40px;
          font-weight: 800;
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
          text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
        }

        .stat-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 600;
        }

        .status {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
          border-radius: 16px;
          padding: 18px 24px;
          margin-bottom: 28px;
          text-align: center;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.95);
          min-height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-weight: 500;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .wallet-info {
          background: linear-gradient(135deg, rgba(100, 200, 255, 0.08) 0%, rgba(50, 150, 255, 0.04) 100%);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 28px;
          font-size: 14px;
          border: 1px solid rgba(100, 200, 255, 0.15);
          box-shadow: 0 4px 16px rgba(100, 200, 255, 0.1);
        }

        .address-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          transition: background 0.2s ease;
        }

        .address-row:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .address-row:last-child {
          margin-bottom: 0;
        }

        .label {
          color: rgba(255, 255, 255, 0.65);
          font-weight: 600;
          font-size: 13px;
        }

        .address {
          color: rgba(255, 255, 255, 0.95);
          font-family: 'Courier New', monospace;
          font-weight: 600;
          font-size: 13px;
        }

        .actions {
          margin-bottom: 28px;
        }

        .btn {
          position: relative;
          width: 100%;
          padding: 20px 40px;
          border: none;
          border-radius: 16px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .btn:hover:not(:disabled)::before {
          left: 100%;
        }

        .btn-primary {
          background: linear-gradient(135deg, #0052ff 0%, #0041cc 100%);
          color: white;
          box-shadow: 0 6px 24px rgba(0, 82, 255, 0.4);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 32px rgba(0, 82, 255, 0.6);
        }

        .btn-primary:active:not(:disabled) {
          transform: translateY(-1px);
        }

        .btn-burn {
          background: linear-gradient(135deg, #ff6b00 0%, #ff0000 100%);
          color: white;
          box-shadow: 0 6px 24px rgba(255, 107, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .btn-burn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 40px rgba(255, 107, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          animation: none;
        }

        .btn-burn:active:not(:disabled) {
          transform: translateY(-1px);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          animation: none;
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 6px 24px rgba(255, 107, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow: 0 6px 32px rgba(255, 107, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
        }

        .info {
          text-align: center;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.55);
          line-height: 2;
          background: rgba(255, 255, 255, 0.03);
          padding: 16px 20px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .info p {
          margin: 6px 0;
        }

        @media (max-width: 640px) {
          .card {
            padding: 28px;
          }

          .title {
            font-size: 36px;
          }

          .subtitle {
            font-size: 16px;
          }

          .stat-value {
            font-size: 32px;
          }

          .btn {
            padding: 16px 32px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
