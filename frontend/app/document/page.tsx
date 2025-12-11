"use client";

import { useState } from "react";
import {
  useAccount,
  useSignMessage,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { keccak256, stringToBytes } from "viem";
import {
  DOCUMENT_REGISTRY_ABI,
  DOCUMENT_REGISTRY_ADDRESS,
} from "@/lib/contract";
import Link from "next/link";
import { WalletConnectButton } from "@/components/WalletConnectButton";

export default function DocumentPage() {
  const { address, isConnected } = useAccount();

  // Texto (opcional) y archivo
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [signature, setSignature] = useState<`0x${string}` | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const {
    signMessageAsync,
    isPending: isSigning,
    error: signError,
  } = useSignMessage();

  const {
    writeContract,
    data: txHash,
    isPending: isSendingTx,
    error: txError,
  } = useWriteContract();

  const { isLoading: isWaitingReceipt, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
      query: {
        enabled: !!txHash,
      },
    });

  // 1) Generar hash keccak256: PRIORIDAD archivo, si no hay, usa texto
  const handleGenerateHash = async () => {
    try {
      if (file) {
        setStatusMessage("Leyendo archivo y generando hash...");
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const keccak = keccak256(bytes);
        setHash(keccak as `0x${string}`);
        setStatusMessage(
          `Hash generado a partir del archivo: ${file.name}`
        );
        return;
      }

      if (content.trim()) {
        setStatusMessage("Generando hash a partir del texto...");
        const bytes = stringToBytes(content);
        const keccak = keccak256(bytes);
        setHash(keccak as `0x${string}`);
        setStatusMessage("Hash generado a partir del texto.");
        return;
      }

      setStatusMessage(
        "Subí un archivo o ingresá texto para generar el hash."
      );
    } catch (err) {
      console.error(err);
      setStatusMessage("Error al generar el hash.");
    }
  };

  // 2) Firmar el hash con la wallet
  const handleSign = async () => {
    if (!hash) {
      setStatusMessage("Primero generá el hash.");
      return;
    }
    if (!isConnected || !address) {
      setStatusMessage("Conectá la wallet antes de firmar.");
      return;
    }

    try {
      setStatusMessage("Firmando mensaje con la wallet...");
      const sig = await signMessageAsync({
        message: hash,
      });
      setSignature(sig);
      setStatusMessage("Firma generada correctamente.");
    } catch (err) {
      console.error(err);
      setStatusMessage("Error al firmar el mensaje.");
    }
  };

  // 3) Guardar el hash en el contrato: storeDocumentHash(hash, signature, signer, timestamp)
  const handleStoreHash = () => {
    if (!hash) {
      setStatusMessage("Primero generá el hash.");
      return;
    }
    if (!signature) {
      setStatusMessage(
        "Antes de guardar, generá el hash y firmalo con la wallet."
      );
      return;
    }
    if (!isConnected || !address) {
      setStatusMessage("Conectá la wallet antes de enviar la transacción.");
      return;
    }

    try {
      const timestamp = BigInt(Math.floor(Date.now() / 1000)); // segundos Unix

      setStatusMessage("Enviando transacción al contrato...");
      writeContract({
        abi: DOCUMENT_REGISTRY_ABI,
        address: DOCUMENT_REGISTRY_ADDRESS,
        functionName: "storeDocumentHash",
        args: [hash, signature, address, timestamp],
      });
    } catch (err) {
      console.error(err);
      setStatusMessage("Error al enviar la transacción.");
    }
  };

  const txStatusLabel = () => {
    if (isSendingTx) return "Transacción enviada, esperando confirmación...";
    if (isWaitingReceipt) return "Esperando confirmación en la blockchain...";
    if (isConfirmed) return "✅ Transacción confirmada. Hash almacenado.";
    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      setStatusMessage(
        `Archivo seleccionado: ${f.name} (${Math.round(f.size / 1024)} KB)`
      );
    } else {
      setStatusMessage(null);
    }
  };

  // 👇 A partir de acá es SOLO JSX dentro del return
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-6">
      <div className="max-w-3xl w-full space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Registrar documento</h1>
            <p className="text-sm text-slate-500">
              Subí un archivo (imagen, PDF, etc.) o ingresá texto, generá el
              hash keccak256, firmalo con tu wallet y almacenalo en el
              contrato <code>DocumentRegistry</code>.
            </p>
          </div>
          <WalletConnectButton />
        </header>

        {/* Links de navegación */}
        <nav className="flex gap-4 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-900 underline">
            Inicio
          </Link>
          <Link href="/verify" className="hover:text-slate-900 underline">
            Verificar
          </Link>
          <Link href="/history" className="hover:text-slate-900 underline">
            Historial
          </Link>
        </nav>

        {/* Área principal */}
        <section className="space-y-6 rounded-xl border border-slate-200 p-4">
          {/* Subida de archivo */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Archivo del documento (opción recomendada)
            </label>

            {/* Input real (oculto) */}
            <input
              id="document-file"
              type="file"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Área visible y clickeable */}
            <label
              htmlFor="document-file"
              className="flex items-center justify-center w-full border-2 border-dashed border-slate-300 rounded-lg px-4 py-6 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-sm text-slate-600"
            >
              {file ? (
                <div className="text-center">
                  <div className="font-medium">Cambiar archivo</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {file.name} ({Math.round(file.size / 1024)} KB)
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="font-medium">
                    Hacé clic aquí para seleccionar un archivo
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Podés subir imágenes, PDF u otros documentos.
                  </div>
                </div>
              )}
            </label>

            <p className="text-xs text-slate-500">
              Se calculará el hash sobre el contenido binario del archivo. Si no
              subís archivo, podés usar el texto de abajo como alternativa.
            </p>
          </div>

          {/* Texto opcional */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Contenido del documento (texto) – opcional
            </label>
            <textarea
              className="w-full min-h-[120px] border border-slate-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Alternativa: pegá aquí una representación en texto del documento..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Botones */}
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              type="button"
              onClick={handleGenerateHash}
              className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm hover:bg-slate-800"
            >
              1) Generar hash (keccak256)
            </button>

            <button
              type="button"
              onClick={handleSign}
              disabled={!hash || isSigning}
              className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm disabled:opacity-50 hover:bg-emerald-500"
            >
              {isSigning ? "Firmando..." : "2) Firmar hash con la wallet"}
            </button>

            <button
              type="button"
              onClick={handleStoreHash}
              disabled={!hash || isSendingTx}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm disabled:opacity-50 hover:bg-indigo-500"
            >
              3) Guardar hash en el contrato
            </button>
          </div>

          {/* Info técnica */}
          <div className="space-y-2 mt-4 text-xs font-mono">
            {hash && (
              <div>
                <div className="font-semibold mb-1">Hash (keccak256):</div>
                <div className="break-all bg-slate-50 border border-slate-200 rounded p-2">
                  {hash}
                </div>
              </div>
            )}

            {signature && (
              <div>
                <div className="font-semibold mb-1">Firma (signMessage):</div>
                <div className="break-all bg-slate-50 border border-slate-200 rounded p-2">
                  {signature}
                </div>
              </div>
            )}

            {txHash && (
              <div>
                <div className="font-semibold mb-1">Tx hash:</div>
                <div className="break-all bg-slate-50 border border-slate-200 rounded p-2">
                  {txHash}
                </div>
              </div>
            )}
          </div>

          {/* Mensajes de estado */}
          <div className="mt-4 space-y-1 text-xs">
            {statusMessage && (
              <div className="text-slate-700">{statusMessage}</div>
            )}
            {txStatusLabel() && (
              <div className="text-emerald-700">{txStatusLabel()}</div>
            )}
            {signError && (
              <div className="text-red-500">
                Error al firmar: {signError.message}
              </div>
            )}
            {txError && (
              <div className="text-red-500">
                Error en transacción: {txError.message}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}