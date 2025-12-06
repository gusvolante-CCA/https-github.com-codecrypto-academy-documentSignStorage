// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DocumentRegistry {

    struct Document {
        bytes32 hash;        // Hash del documento
        bytes signature;     // Firma digital generada en frontend
        address signer;      // Dirección que firmó el documento
        uint256 timestamp;   // Fecha de firma
    }

    // Mapping para saber rápidamente si un documento existe
    mapping(bytes32 => Document) public documents;

    // Array enumerativo para la vista History
    bytes32[] public documentHashes;

    // Modifier: evita duplicados
    modifier documentNotStored(bytes32 _hash) {
        require(documents[_hash].timestamp == 0, "Document already exists");
        _;
    }

    // Modifier: verifica existencia
    modifier documentExists(bytes32 _hash) {
        require(documents[_hash].timestamp != 0, "Document NOT found");
        _;
    }

    // ------------------------------
    // STORE DOCUMENT
    // ------------------------------
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

        documents[_hash] = Document({
            hash: _hash,
            signature: _signature,
            signer: _signer,
            timestamp: _timestamp
        });

        documentHashes.push(_hash);
    }

    // ------------------------------
    // VERIFY DOCUMENT
    // ------------------------------
    function verifyDocument(
        bytes32 _hash, 
        address _expectedSigner
    ) 
        public 
        view 
        documentExists(_hash)
        returns (bool) 
    {
        // comparar addresses (frontend = lowercase)
        return documents[_hash].signer == _expectedSigner;
    }

    // ------------------------------
    // LECTURAS UTILITARIAS
    // ------------------------------
    // Permite al frontend / tests saber si un documento existe
    function isDocumentStored(bytes32 _hash) external view returns (bool) {
        return documents[_hash].timestamp != 0;
    }

    function getDocumentsCount() public view returns (uint256) {
        return documentHashes.length;
    }

    function getDocumentHashByIndex(uint256 i) public view returns (bytes32) {
        return documentHashes[i];
    }

}
