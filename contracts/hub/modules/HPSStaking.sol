// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../../interfaces/modules/IHPSStaking.sol";
import "./HPSStorage.sol";
import "./HPSWithdrawal.sol";
import "../../interfaces/Errors.sol";

import "../../libs/ProviderStorage.sol";
import "../../libs/ProviderQueue.sol";
import "../../libs/SafeMathInt.sol";
import "../../interfaces/IProvider.sol";

abstract contract HPSStaking is IHPSStaking, HPSStorage, HPSWithdrawal {
    using ProviderStorageLib for ProviderTree;
    using ProviderQueueLib for ProviderQueue;
    using SafeMathUint for uint256;

    modifier onlyProvider() {
        if (!getProvider(msg.sender).active) revert Unauthorized("PROVIDER");
        _;
    }

    /**
     * @inheritdoc IHPSStaking
     */
    function register(uint256[2] calldata signature, uint256[4] calldata pubkey) external {
        // if (!whitelist[msg.sender]) revert Unauthorized("WHITELIST"); TODO: no whitelist for now ...

        (bool result, bool callSuccess) = bls.verifySingle(signature, pubkey, message);
        require(callSuccess && result, "INVALID_SIGNATURE");

        _providers.insert(
            msg.sender,
            Provider({blsKey: pubkey, stake: 0, totalStake: 0, commission: 0, withdrawableRewards: 0, active: true})
        );
        // _removeFromWhitelist(msg.sender);

        emit NewProvider(msg.sender, pubkey);
    }

    /**
     * @inheritdoc IHPSStaking
     */
    function stake() external payable onlyProvider {
        uint256 currentStake = _providers.stakeOf(msg.sender);
        if (msg.value + currentStake < minStake) revert StakeRequirement({src: "stake", msg: "STAKE_TOO_LOW"});
        claimProviderReward();
        _queue.insert(msg.sender, int256(msg.value), 0);
        emit Staked(msg.sender, msg.value);
    }

    /**
     * @inheritdoc IHPSStaking
     */
    function unstake(uint256 amount) external {
        int256 totalProviderStake = int256(_providers.stakeOf(msg.sender)) + _queue.pendingStake(msg.sender);
        int256 amountInt = amount.toInt256Safe();
        if (amountInt > totalProviderStake) revert StakeRequirement({src: "unstake", msg: "INSUFFICIENT_BALANCE"});

        int256 amountAfterUnstake = totalProviderStake - amountInt;
        if (amountAfterUnstake < int256(minStake) && amountAfterUnstake != 0)
            revert StakeRequirement({src: "unstake", msg: "STAKE_TOO_LOW"});

        claimProviderReward();
        _queue.insert(msg.sender, amountInt * -1, 0);
        if (amountAfterUnstake == 0) {
            _providers.get(msg.sender).active = false;
        }
        _registerWithdrawal(msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }

    /**
     * @inheritdoc IHPSStaking
     */
    function setCommission(uint256 newCommission) external onlyProvider {
        require(newCommission <= MAX_COMMISSION, "INVALID_COMMISSION");
        Provider storage provider = _providers.get(msg.sender);
        provider.commission = newCommission;
    }

    /**
     * @inheritdoc IHPSStaking
     */
    function claimProviderReward() public {
        Provider storage provider = _providers.get(msg.sender);
        uint256 reward = provider.withdrawableRewards;
        if (reward == 0) return;
        provider.withdrawableRewards = 0;
        _registerWithdrawal(msg.sender, reward);
        emit ProviderRewardClaimed(msg.sender, reward);
    }

    /**
     * @inheritdoc IHPSStaking
     */
    function sortedProviders(uint256 n) public view returns (address[] memory) {
        uint256 length = n <= _providers.count ? n : _providers.count;
        address[] memory providerAddresses = new address[](length);

        if (length == 0) return providerAddresses;

        address tmpProvider = _providers.last();
        providerAddresses[0] = tmpProvider;

        for (uint256 i = 1; i < length; i++) {
            tmpProvider = _providers.prev(tmpProvider);
            providerAddresses[i] = tmpProvider;
        }

        return providerAddresses;
    }

    /**
     * @inheritdoc IHPSStaking
     */
    function getProviderReward(address provider) external view returns (uint256) {
        return getProvider(provider).withdrawableRewards;
    }

    /**
     * @inheritdoc IHPSStaking
     */
    function totalStake() external view returns (uint256) {
        return _providers.totalStake;
    }

    function _distributeProviderReward(address provider, uint256 reward) internal {
        Provider storage _provider = _providers.get(provider);
        _provider.withdrawableRewards += reward;
        emit ProviderRewardDistributed(provider, reward);
    }
}
