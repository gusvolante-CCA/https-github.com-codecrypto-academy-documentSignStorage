📘 PROJECT SPEC — Document Registry (ETH DApp)

Versión inicial — basada en la especificación oficial del curso


Definicion Funcional Tarea ETH

1. Objetivo del Proyecto

Desarrollar una aplicación descentralizada (DApp) completa para almacenar y verificar autenticidad de documentos utilizando la blockchain Ethereum.

Incluye:

✔ Smart contract (Solidity + Foundry)

✔ Frontend Web (React / Next.js)

✔ Firma criptográfica

✔ Nodo local (Anvil) para desarrollo

2. Contexto

⦁	Un usuario debe poder:
⦁	Subir un documento
⦁	Calcular su hash criptográfico
⦁	Firmarlo con su wallet
⦁	Guardar hash, firma y fecha en blockchain
⦁	Verificar posteriormente la autenticidad
⦁	Consultar historial de documentos

La seguridad está dada por:

⦁	Inmutabilidad de blockchain
⦁	Firmas ECDSA
⦁	Hash keccak256

3. Requisitos Previos
Software

⦁	Node.js v18+
⦁	Foundry (Forge, Cast, Anvil)
⦁	Git
⦁	Editor VS Code

Conocimientos

⦁	JavaScript / TypeScript
⦁	React (hooks, useState, useEffect, useContext)
⦁	Solidity (struct, mapping, events)
⦁	Terminal
⦁	Blockchain basics (wallets, gas)

4. Fase 1 — Smart Contract

4.1 Estructura del contrato

Archivo: sc/src/DocumentRegistry.sol

Struct Document:

⦁	bytes32 hash
⦁	bytes signature
⦁	address signer
⦁	uint256 timestamp

Almacenamiento:

⦁	mapping (bytes32 → Document)
⦁	array bytes32[] documentHashes para enumeración

Puntos clave del profe:

❌ No incluir bool exists
❌ No usar mapping hashExists
✔ Usar documents[_hash].signer != address(0) para verificar existencia
✔ Ahorra ~39% gas

4.2 Funciones Principales

1-storeDocumentHash(bytes32 hash, bytes signature, address signer, uint256 timestamp)

⦁	Guarda documento
⦁	Push al array
⦁	Emite evento

2-verifyDocument(bytes32 hash, address signer, bytes signature)
⦁	Valida firma
⦁	Valida existencia
3-getDocumentInfo(bytes32 hash)
4-isDocumentStored(bytes32 hash)

5-getDocumentsCount()

6-getDocumentHashByIndex(uint256 i)

4.3 Modificadores
⦁	modifier documentNotExists(bytes32 _hash)
⦁	modifier documentExists(bytes32 _hash)

4.4 Testing

11 tests obligatorios:

⦁	Almacenar correctamente
⦁	Verificar correctamente
⦁	Rechazar duplicados
⦁	Rechazar inexistentes
⦁	Obtener información
⦁	Contar documentos
⦁	Recorrer índices

Comando:

cd sc
forge test -vv

4.5 Script de despliegue

Archivo: sc/script/Deploy.s.sol

Comando:

forge script script/Deploy.s.sol \
 --rpc-url http://localhost:8545 \
 --broadcast \
 --private-key <clave>

5. Fase 2 — Frontend DApp (Next.js)
5.1 Estructura
Componentes:

⦁	FileUploader.tsx
⦁	DocumentSigner.tsx
⦁	DocumentVerifier.tsx
⦁	DocumentHistory.tsx

Hooks:

⦁	useContract.ts
⦁	MetamaskContext.tsx

Variables de entorno:
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_RPC_URL=
NEXT_PUBLIC_CHAIN_ID=
NEXT_PUBLIC_MNEMONIC=

6. Fase 3 — Integración
Flujo:

1-Conectar wallet
2-Subir archivo
3-Hash local
4-Firmar hash
5-Enviar transacción store
6-Verificar
7-History

7. Fase 4 — Testing
Tipos:

-Smart Contract tests
-Integration tests
-Casos a cubrir:
-Happy path
-Documento duplicado
-Firmante incorrecto
-Documento inexistente
-Cambio de wallet

8. Criterios de Evaluación (según profesor)
⦁	Funcionalidad 40%
⦁	Código 30%
⦁	Testing 15%
⦁	UI/UX 10%
⦁	Documentación 5%

9. Checklist de Entrega

✔ DocumentRegistry.sol implementado
✔ Script deploy
✔ 11 tests
✔ Frontend funcional
✔ History funcionando
✔ Interacción completa
✔ .env configurado
✔ README actualizado

10. Notas Finales

Evitar:

❌ Hardcodear claves privadas
❌ Subir lib/, cache/, out/
❌ Código sin comentarios
❌ Commit sin mensaje
