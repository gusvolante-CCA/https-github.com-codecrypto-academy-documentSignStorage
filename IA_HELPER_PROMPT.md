# IA Helper Prompt – Document Sign Storage
Este prompt sirve para que la IA genere, revise y mejore los componentes del proyecto Document Sign Storage.  

A continuación, se definen los requerimientos, estructura, restricciones, validaciones y entregables que la IA debe cumplir cuando genere código o documentación relacionada al proyecto.

---

## 🔐 OBJETIVO DEL PROYECTO
Construir una DApp completa que permita:
1. Subir un archivo.
2. Calcular su hash localmente.
3. Firmar digitalmente el hash con la wallet conectada.
4. Almacenar hash, firma, timestamp y signer en la blockchain.
5. Verificar un documento subido por terceros.
6. Mostrar el historial completo de documentos registrados.

---

## 🧱 ESTRUCTURA GENERAL DEL PROYECTO
El proyecto debe estar compuesto por:
- **Smart Contract (Solidity + Foundry)**
- **Frontend (Next.js + Ethers.js)**
- **Tests (Foundry)**
- **Scripts de deployment**
- **Documentación técnica**

---

## 📌 REQUERIMIENTOS DEL SMART CONTRACT
El contrato debe:
- Definir una `struct Document { bytes32 hash; bytes signature; address signer; uint256 timestamp; }`
- Usar `mapping(bytes32 => Document) documents`  
- Usar `bytes32[] documentHashes` para enumeración
- Incluir modificadores:
  - `documentNotExists(bytes32 hash)`
  - `documentExists(bytes32 hash)`
- Incluir funciones:
  - `storeDocumentHash(bytes32 hash, bytes signature, address signer, uint256 timestamp)`  
  - `verifyDocument(bytes32 hash, address signer, bytes signature)`  
  - `getDocumentsCount() → uint`  
  - `getDocumentHashByIndex(uint index) → bytes32`
  - `isDocumentStored(bytes32 hash)`

El contrato **NO** debe calcular hashes.  
Los hashes se calculan en el frontend.

---

## 🔧 VALIDACIONES REQUERIDAS
- El documento no debe poder guardarse dos veces  
- La firma debe tener longitud > 0  
- `verifyDocument()` debe fallar si:
  - El documento no existe  
  - El signer no coincide  
  - La signature no coincide  
- Todas las direcciones deben compararse en `lowercase` desde el frontend

---

## 📁 FRONTEND (NEXT.JS)
El frontend debe incluir:
- Página principal con:
  - File Upload
  - Hash visualization
  - Document Signing
  - Store on Blockchain
  - Verify Document
  - History

Debe incluir un **Wallet Context Provider** que contenga:
- signer
- currentAccount
- connectWallet()
- signMessage()

Hashing debe usarse así:
```js
const fileBuffer = await file.arrayBuffer();
const bytes = new Uint8Array(fileBuffer);
const hash = ethers.keccak256(bytes);
const signature = await signer.signMessage(hash);
🧪 TESTS (FOUNDRY)

La IA debe generar tests para:

storeDocumentHash

debe guardar

debe fallar si está duplicado

verifyDocument

ok path

firmante incorrecto

hash inexistente

firma incorrecta

lectura:

count

getDocumentHashByIndex

isDocumentStored

🚀 DEPLOYMENT

Foundry script debe:

Desplegar el contrato

Guardar el address en consola

Generar archivo /frontend/.env.local con:

NEXT_PUBLIC_CONTRACT_ADDRESS=0x....
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337

🎨 PATRONES DE CALIDAD

La IA debe asegurarse de:

Contratos minimalistas

Código seguro

Comentarios claros

Nombres expresivos

Nada de lógica pesada en Solidity

Minimizar gas

🧠 MODO DE RESPUESTA DE LA IA

Cuando el estudiante le pida ayuda, la IA debe responder siempre:

Explicación clara del concepto

Código generado

Cómo se integra en el proyecto

Comandos exactos para ejecutar

Posibles errores y cómo resolverlos

🎯 ENTREGABLES ESPERADOS

La IA debe poder generar:

El contrato completo

Tests completos

Scripts de deployment

Hooks de conexión a wallet

Componentes del frontend (File Upload, Verifier, History)

Documentación Markdown

Explicaciones paso a paso

Fin del prompt.
