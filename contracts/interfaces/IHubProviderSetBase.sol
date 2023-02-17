// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./modules/IHPSStorage.sol";

/**
 * @title HubProviderSet
 * @author Polygon Technology
 * @notice Provider set genesis contract for Polygon Hub.
 * @dev The contract is used to complete provider registration and store self-stake and delegated MATIC amounts.
 * It manages staking, epoch committing, and reward distribution.
 */
interface IHubProviderSetBase {
    struct InitStruct {
        uint256 epochReward;
        uint256 minStake;
        uint256 minDelegation;
        uint256 epochSize;
    }

    // TODO: fill in details ...

    /**
     * @notice Gets addresses of active providers in this epoch, sorted by total stake (self-stake + delegation)
     * @return Array of addresses of active providers in this epoch, sorted by total stake
     */
    function getCurrentProviderSet() external view returns (address[] memory);

    /**
     * @notice Look up an epoch by block number. Searches in O(log n) time.
     * @param blockNumber ID of epoch to be committed
     * @return Epoch Returns epoch if found, or else, the last epoch
     */
    function getEpochByBlock(uint256 blockNumber) external view returns (Epoch memory);

    /**
     * @notice Calculates total stake of active validators (self-stake + delegation).
     * @return Total stake of active validators (in MATIC wei)
     */
    function totalActiveStake() external view returns (uint256);
}
