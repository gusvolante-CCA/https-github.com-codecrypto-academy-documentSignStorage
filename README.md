# DocumentSignStorage – Trabajo Práctico CodeCrypto Academy

Proyecto de registro de documentos en blockchain como parte del Máster Ingeniero Blockchain 360° (CodeCrypto Academy).

Permite:

- Subir un archivo o texto.
- Calcular su hash `keccak256` en el frontend.
- Firmar el hash con MetaMask.
- Guardar el hash y la firma en un smart contract (`DocumentRegistry`).
- Consultar luego el historial y verificar documentos.

---

## 1. Arquitectura general

### Backend (Solidity + Foundry)

- **Contrato:** `DocumentRegistry.sol`
- **Herramientas:** Foundry (`forge`, `cast`, `anvil`)
- **Red de desarrollo:** Anvil local (`http://127.0.0.1:8545`, `chainId 31337`)

Contrato principal:

```solidity
struct Document {
    bytes32 hash;
    bytes signature;
    address signer;
    uint256 timestamp;
}

mapping(bytes32 => Document) public documents;
bytes32[] public documentHashes;

function storeDocumentHash(
    bytes32 _hash,
    bytes memory _signature,
    address _signer,
    uint256 _timestamp
)
    public
    documentNotStored(_hash)
{
    require(_signature.length > 0, "Invalid signature");
    documents[_hash] = Document(_hash, _signature, _signer, _timestamp);
    documentHashes.push(_hash);
}
El contrato fue probado directamente con cast send y cast call contra Anvil, y almacena los documentos correctamente.

Frontend (Next.js + wagmi + MetaMask)
Framework: Next.js (App Router)

Web3: wagmi + viem

Wallet: MetaMask (red local “anvil local”)

Rutas principales:

/document – Registrar documento

/verify – Verificar documento

/history – Historial

Flujo del usuario en /document:

Seleccionar archivo o escribir texto.

“Generar hash (keccak256)”.

“Firmar hash con la wallet”.

“Guardar hash en el contrato”.

2. Estado del trabajo práctico
✔️ Completado
Contrato DocumentRegistry desarrollado y desplegado con Foundry.

Backend funcionando sobre Anvil (localhost:8545).

Frontend integrado con:

cálculo de hash,

firma con MetaMask,

simulación OK (viem.simulateContract),

vistas de historial y verificación.

Pruebas exitosas con:

cast send (escritura),

cast call (lectura).

⚠️ Pendiente / Impedido
La transacción NO puede confirmarse desde MetaMask, pese a ser válida.

MetaMask muestra:

“Solicitud de transacción”

“Alerta de revisión”

NO aparece el botón Confirmar

A pesar de que:

✔️ El contrato funciona
✔️ La simulación funciona
✔️ El envío directo vía cast funciona

3. Problema conocido (MetaMask / localhost) y posibles causas
Observado:
simulateContract funciona y no revierte.

MetaMask abre la ventana estándar, pero sin botón Confirmar.

Se muestra “Alerta de revisión”.

Hipótesis condicionales (con humildad técnica)
Estas son explicaciones posibles, pero podrían existir otras causas:

1) Falla en la estimación de gas (eth_estimateGas)
MetaMask puede:

fallar al simular el gas,

marcar la transacción como riesgosa,

ocultar el botón “Confirmar”.

Pero la misma transacción via cast send funciona → sugiere fallo en MetaMask, no en el contrato.

2) Heurísticas internas de MetaMask en entornos locales
Posibles disparadores:

RPC HTTP (no HTTPS)

contrato recientemente desplegado

parámetros extensos (bytes grandes)

Esto puede generar falso positivo de riesgo.

3) Interacción con Snaps / extensiones
Se detectó actividad de:

solana-wallet-snap

bitcoin-wallet-snap

Alguno podría alterar los flujos internos de seguridad de MetaMask.

4. Evidencia de que el contrato funciona correctamente
Despliegue
bash
Copiar código
forge create src/DocumentRegistry.sol:DocumentRegistry \
  --rpc-url http://127.0.0.1:8545 \
  --private-key <PRIVATE_KEY_ANVIL> \
  --broadcast
Escritura (OK)
bash
Copiar código
cast send <CONTRACT_ADDRESS> \
  "storeDocumentHash(bytes32,bytes,address,uint256)" \
  <hash> <signature> <signer> <timestamp> \
  --private-key <PRIVATE_KEY_ANVIL> \
  --rpc-url http://127.0.0.1:8545
Lectura (OK)
bash
Copiar código
cast call <CONTRACT_ADDRESS> \
  "documents(bytes32)(bytes32,bytes,address,uint256)" \
  <hash> \
  --rpc-url http://127.0.0.1:8545
Resultado:

hash correcto

signature correcta

signer correcto

timestamp correcto

✔️ Confirma que el backend funciona 100%.

5. Cómo correr el proyecto localmente
5.1 Backend (Anvil + Foundry)
bash
Copiar código
cd backend
anvil
En otra terminal:

bash
Copiar código
cd backend
forge create src/DocumentRegistry.sol:DocumentRegistry \
  --rpc-url http://127.0.0.1:8545 \
  --private-key <PRIVATE_KEY_ANVIL> \
  --broadcast
Configurar en:

bash
Copiar código
frontend/.env.local
NEXT_PUBLIC_DOCUMENT_REGISTRY_ADDRESS=0x...
5.2 Frontend – Next.js
bash
Copiar código
cd frontend
npm install
npm run dev
Abrir:

http://localhost:3000/document

http://localhost:3000/verify

http://localhost:3000/history

Configurar MetaMask:

Nombre: anvil local

RPC URL: http://127.0.0.1:8545

Chain ID: 31337

Símbolo: ETH

6. Carpeta de entrega y video de demostración
Carpeta incluida:

Copiar código
ENTREGA_TP/
   └── VIDEO_URL.txt
El video muestra:

Flujo completo de la dApp

Hash + firma funcionando

El problema del botón faltante de MetaMask

🎥 Video Demo:
https://www.loom.com/share/2964837af05840ab92da61fa9242eed3

7. Próximos pasos (si el proyecto continuara)
Probar versiones alternativas de MetaMask o desactivar Snaps.

En desarrollo: permitir enviar transacción usando walletClient sin depender de MetaMask.

Mejorar UI de historial y verificación.

Muchas gracias por la corrección.
Quedo atento a cualquier sugerencia para resolver el comportamiento de MetaMask.