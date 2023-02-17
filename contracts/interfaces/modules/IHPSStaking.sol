// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./IHPSStorage.sol";

interface IHPSStaking {
    event NewProvider(address indexed provider, uint256[4] blsKey);
    event Staked(address indexed provider, uint256 amount);
    event Unstaked(address indexed provider, uint256 amount);
    event ProviderRewardClaimed(address indexed provider, uint256 amount);
    event ProviderRewardDistributed(address indexed provider, uint256 amount);

    /**
     * @notice Validates BLS signature with the provided pubkey and registers validators into the set.
     * @param signature Signature to validate message against
     * @param pubkey BLS public key of provider
     */
    function register(uint256[2] calldata signature, uint256[4] calldata pubkey) external;

    /**
     * @notice Stakes sent amount. Claims rewards beforehand.
     */
    function stake() external payable;

    /**
     * @notice Unstakes amount for sender. Claims rewards beforehand.
     * @param amount Amount to unstake
     */
    function unstake(uint256 amount) external;

    /**
     * @notice Sets commission for provider.
     * @param newCommission New commission (100 = 100%)
     */
    function setCommission(uint256 newCommission) external;

    /**
     * @notice Claims provider rewards for sender.
     */
    function claimProviderReward() external;

    /**
     * @notice Gets first n active validators sorted by total stake.
     * @param n Desired number of validators to return
     * @return Returns array of addresses of first n active validators sorted by total stake,
     * or fewer if there are not enough active validators
     */
    function sortedProviders(uint256 n) external view returns (address[] memory);

    /**
     * @notice Calculates total stake in the network (self-stake + delegation).
     * @return Total stake (in MATIC wei)
     */
    function totalStake() external view returns (uint256);

    /**
     * @notice Gets provider's unclaimed rewards.
     * @param provider Address of provider
     * @return Provider's unclaimed rewards (in MATIC wei)
     */
    function getProviderReward(address provider) external view returns (uint256);
}
