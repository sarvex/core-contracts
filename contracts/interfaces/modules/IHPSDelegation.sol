// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./IHPSStorage.sol";

interface IHPSDelegation {
    event Delegated(address indexed delegator, address indexed provider, uint256 amount);
    event Undelegated(address indexed delegator, address indexed provider, uint256 amount);
    event DelegatorRewardClaimed(
        address indexed delegator,
        address indexed provider,
        bool indexed restake,
        uint256 amount
    );
    event DelegatorRewardDistributed(address indexed provider, uint256 amount);

    /**
     * @notice Delegates sent amount to provider. Claims rewards beforehand.
     * @param provider Validator to delegate to
     * @param restake Whether to redelegate the claimed rewards
     */
    function delegate(address provider, bool restake) external payable;

    /**
     * @notice Undelegates amount from provider for sender. Claims rewards beforehand.
     * @param provider Validator to undelegate from
     * @param amount The amount to undelegate
     */
    function undelegate(address provider, uint256 amount) external;

    /**
     * @notice Claims delegator rewards for sender.
     * @param provider Validator to claim from
     * @param restake Whether to redelegate the claimed rewards
     */
    function claimDelegatorReward(address provider, bool restake) external;

    /**
     * @notice Gets amount delegated by delegator to provider.
     * @param provider Address of provider
     * @param delegator Address of delegator
     * @return Amount delegated (in MATIC wei)
     */
    function delegationOf(address provider, address delegator) external view returns (uint256);

    /**
     * @notice Gets delegators's unclaimed rewards with provider.
     * @param provider Address of provider
     * @param delegator Address of delegator
     * @return Delegator's unclaimed rewards with provider (in MATIC wei)
     */
    function getDelegatorReward(address provider, address delegator) external view returns (uint256);
}
