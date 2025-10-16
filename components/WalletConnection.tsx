'use client';

import { useMemo } from 'react';
import { useBaseAccountContext } from '@/contexts/BaseAccountContext';

export function WalletConnection() {
  const { connected, subAccount, universalAddress, loading, status, connectWallet, provider } = useBaseAccountContext();

  const isProviderReady = useMemo(() => !!provider, [provider]);

  return (
    <div className="wallet-connection-wrapper">
      {/* Status Message */}
      <div className="status-message">
        <div className="status-icon">{connected ? '✓' : loading ? '⟳' : '○'}</div>
        <div className="status-text">{status}</div>
      </div>

      {/* Connect Button */}
      {!connected && (
        <button onClick={connectWallet} disabled={loading || !isProviderReady} className="connect-button">
          <span className="button-glow"></span>
          <span className="button-content">
            {loading ? (
              <>
                <span className="spinner"></span>
                Connecting...
              </>
            ) : isProviderReady ? (
              <>
                <svg className="wallet-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Connect Base Account
              </>
            ) : (
              'Initializing...'
            )}
          </span>
        </button>
      )}

      {/* Connected State - Account Cards */}
      {connected && (
        <div className="accounts-container">
          {/* Sub Account Card */}
          {subAccount?.address && (
            <div className="account-card sub-account">
              <div className="account-header">
                <div className="account-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                  </svg>
                </div>
                <div className="account-label">
                  <div className="label-title">Sub Account</div>
                  <div className="label-subtitle">App-specific wallet</div>
                </div>
              </div>
              <div className="account-address">
                <div className="address-full">{subAccount.address}</div>
                <div className="address-short">
                  {subAccount.address.slice(0, 6)}...{subAccount.address.slice(-4)}
                </div>
              </div>
            </div>
          )}

          {/* Universal Account Card */}
          {universalAddress && (
            <div className="account-card universal-account">
              <div className="account-header">
                <div className="account-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                </div>
                <div className="account-label">
                  <div className="label-title">Universal Account</div>
                  <div className="label-subtitle">Main wallet</div>
                </div>
              </div>
              <div className="account-address">
                <div className="address-full">{universalAddress}</div>
                <div className="address-short">
                  {universalAddress.slice(0, 6)}...{universalAddress.slice(-4)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .wallet-connection-wrapper {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .status-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .status-icon {
          font-size: 20px;
          font-weight: 700;
          color: #ffd700;
          animation: ${loading ? 'spin 1s linear infinite' : 'none'};
        }

        .status-text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }

        .connect-button {
          position: relative;
          width: 100%;
          padding: 16px 32px;
          background: linear-gradient(135deg, #0052ff 0%, #0041cc 100%);
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          color: white;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(0, 82, 255, 0.4);
        }

        .connect-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0, 82, 255, 0.6);
        }

        .connect-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .connect-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .button-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .connect-button:hover:not(:disabled) .button-glow {
          left: 100%;
        }

        .button-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .wallet-icon {
          width: 24px;
          height: 24px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .accounts-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }

        .account-card {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px;
          border: 2px solid;
          transition: all 0.3s ease;
          cursor: default;
        }

        .account-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .sub-account {
          border-color: rgba(16, 185, 129, 0.4);
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%);
        }

        .sub-account:hover {
          border-color: rgba(16, 185, 129, 0.6);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
        }

        .universal-account {
          border-color: rgba(168, 85, 247, 0.4);
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%);
        }

        .universal-account:hover {
          border-color: rgba(168, 85, 247, 0.6);
          box-shadow: 0 8px 24px rgba(168, 85, 247, 0.2);
        }

        .account-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .account-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sub-account .account-icon {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .universal-account .account-icon {
          background: rgba(168, 85, 247, 0.2);
          color: #a855f7;
        }

        .account-icon svg {
          width: 22px;
          height: 22px;
        }

        .account-label {
          flex: 1;
        }

        .label-title {
          font-size: 14px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 2px;
        }

        .label-subtitle {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .account-address {
          position: relative;
        }

        .address-full {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          word-break: break-all;
          line-height: 1.6;
          padding: 8px 12px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          display: none;
        }

        .address-short {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 600;
          padding: 8px 12px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          text-align: center;
        }

        .account-card:hover .address-full {
          display: block;
        }

        .account-card:hover .address-short {
          display: none;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 640px) {
          .wallet-connection-wrapper {
            padding: 20px;
          }

          .connect-button {
            padding: 14px 24px;
            font-size: 14px;
          }

          .status-message {
            padding: 10px 16px;
          }

          .status-text {
            font-size: 12px;
          }

          .label-title {
            font-size: 13px;
          }

          .address-short {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
