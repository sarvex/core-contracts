// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

error NoTokensDelegated(address validator);

/**
 * @notice struct representation of a pool for reward distribution
 * @dev pools are formed by delegators to a specific validator
 * @dev uses virtual balances to track slashed delegations
 * @param supply amount of tokens in the pool
 * @param virtualSupply the total supply of virtual balances in the pool
 * @param magnifiedRewardPerShare coefficient to aggregate rewards
 * @param validator the address of the validator the pool based on
 * @param magnifiedRewardCorrections adjustments to reward magnifications by address
 * @param claimedRewards amount claimed by address
 * @param balances virtual balance by address
 */
struct RewardPool {
    uint256 supply;
    uint256 virtualSupply;
    uint256 magnifiedRewardPerShare;
    address validator;
    mapping(address => int256) magnifiedRewardCorrections;
    mapping(address => uint256) claimedRewards;
    mapping(address => uint256) balances;
}
