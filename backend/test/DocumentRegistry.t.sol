// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/DocumentRegistry.sol";

contract DocumentRegistryTest is Test {
    DocumentRegistry registry;

    // Datos de prueba
    bytes32 testHash;
    bytes  testSignature;
    address testSigner;
    uint256 testTimestamp;

    function setUp() public {
        registry = new DocumentRegistry();

        testHash = keccak256("hola");
        testSignature = hex"123456";
        testSigner = address(0xBEEF);
        testTimestamp = 123456789;
    }

    function testStoreDocument() public {
        registry.storeDocumentHash(
            testHash,
            testSignature,
            testSigner,
            testTimestamp
        );

        // Verificar que está guardado
        bool exists = registry.isDocumentStored(testHash);
        assertTrue(exists, "El documento deberia existir");
    }

    function testVerifySuccess() public {
        registry.storeDocumentHash(
            testHash,
            testSignature,
            testSigner,
            testTimestamp
        );

        bool ok = registry.verifyDocument(testHash, testSigner);
        assertTrue(ok, "La verificacion deberia ser exitosa");
    }

    function testVerifyFail_WrongSigner() public {
        registry.storeDocumentHash(
            testHash,
            testSignature,
            testSigner,
            testTimestamp
        );

        bool ok = registry.verifyDocument(testHash, address(0xCAFE));
        assertFalse(ok, "La verificacion deberia fallar con signer incorrecto");
    }
}