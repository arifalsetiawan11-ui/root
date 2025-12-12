// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ArbitrationAdapter is EIP712 {
    // DOMAIN
    string private constant NAME = "EscrowArbitration";
    string private constant VERSION = "1";

    address public arbitrator;
    mapping(bytes32 => bool) public usedNonces; // nonce replay protection

    event ArbitratorChanged(address indexed newArbitrator);
    event RulingSubmitted(
        bytes32 indexed orderId,
        uint8 ruling,
        uint256 timestamp,
        uint256 nonce,
        address indexed submitter
    );

    // EIP-712 typehash
    bytes32 private constant RULING_TYPEHASH =
        keccak256("Ruling(bytes32 orderId,uint8 ruling,uint256 timestamp,uint256 nonce)");

    modifier onlyArbitrator() {
        require(msg.sender == arbitrator, "only arbitrator");
        _;
    }

    constructor(address _arbitrator)
        EIP712(NAME, VERSION)
    {
        arbitrator = _arbitrator;
    }

    function setArbitrator(address a) external onlyArbitrator {
        arbitrator = a;
        emit ArbitratorChanged(a);
    }

    // EIP-712 signature verification
    function verifyRulingSignature(
        bytes32 orderId,
        uint8 ruling,
        uint256 timestamp,
        uint256 nonce,
        bytes calldata signature
    ) public view returns (bool) {
        require(block.timestamp <= timestamp + 3600, "signature expired");
        bytes32 structHash = keccak256(abi.encode(
            RULING_TYPEHASH, orderId, ruling, timestamp, nonce
        ));
        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(digest, signature);
        return signer == arbitrator;
    }

    // For usage: verify and mark nonce used
    function submitRuling(
        bytes32 orderId,
        uint8 ruling,
        uint256 timestamp,
        uint256 nonce,
        bytes calldata signature
    ) external {
        require(verifyRulingSignature(orderId, ruling, timestamp, nonce, signature), "bad signature");
        require(!usedNonces[keccak256(abi.encodePacked(orderId, nonce))], "nonce used");
        usedNonces[keccak256(abi.encodePacked(orderId, nonce))] = true;
        emit RulingSubmitted(orderId, ruling, timestamp, nonce, msg.sender);
        // Forward to Escrow.resolveAndExecute if needed
    }
}
