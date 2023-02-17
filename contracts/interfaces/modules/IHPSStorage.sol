// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../IProvider.sol";

struct UptimeData {
    address provider;
    uint256 signedBlocks;
}

struct Uptime {
    uint256 epochId;
    UptimeData[] uptimeData;
    uint256 totalBlocks;
}

struct Epoch {
    uint256 startBlock;
    uint256 endBlock;
    bytes32 epochRoot;
}

interface IHPSStorage {
    /**
     * @notice Gets validator by address.
     * @return Validator (BLS public key, self-stake, total stake, commission, withdrawable rewards, activity status)
     */
    function getProvider(address provider) external view returns (Provider memory);
}
