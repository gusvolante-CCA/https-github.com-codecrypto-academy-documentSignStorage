"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-300">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sm"
        >
          Desconectar
        </button>
      </div>
    );
  }

  const injectedConnector = connectors[0]; // el 'injected()' que definimos en wagmiConfig

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => connect({ connector: injectedConnector })}
        disabled={status === "pending"}
        className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-sm"
      >
        {status === "pending" ? "Conectando..." : "Conectar Wallet"}
      </button>
      {error && (
        <span className="text-xs text-red-400">
          Error: {error.message}
        </span>
      )}
    </div>
  );
}