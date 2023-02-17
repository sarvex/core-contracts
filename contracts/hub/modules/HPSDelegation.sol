// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../../interfaces/modules/IHPSDelegation.sol";
import "./HPSStorage.sol";
import "./HPSWithdrawal.sol";
import "../../interfaces/Errors.sol";

import "../../libs/ProviderStorage.sol";
import "../../libs/ProviderQueue.sol";
import "../../libs/RewardPool.sol";
import "../../libs/SafeMathInt.sol";

abstract contract HPSDelegation is IHPSDelegation, HPSStorage, HPSWithdrawal {
    using ProviderStorageLib for ProviderTree;
    using ProviderQueueLib for ProviderQueue;
    using RewardPoolLib for RewardPool;
    using SafeMathUint for uint256;

    /**
     * @inheritdoc IHPSDelegation
     */
    function delegate(address provider, bool restake) external payable {
        RewardPool storage delegation = _providers.getDelegationPool(provider);
        if (delegation.balanceOf(msg.sender) + msg.value < minDelegation)
            revert StakeRequirement({src: "delegate", msg: "DELEGATION_TOO_LOW"});
        claimDelegatorReward(provider, restake);
        _delegate(msg.sender, provider, msg.value);
    }

    /**
     * @inheritdoc IHPSDelegation
     */
    function undelegate(address provider, uint256 amount) external {
        RewardPool storage delegation = _providers.getDelegationPool(provider);
        uint256 delegatedAmount = delegation.balanceOf(msg.sender);

        if (amount > delegatedAmount) revert StakeRequirement({src: "undelegate", msg: "INSUFFICIENT_BALANCE"});
        delegation.withdraw(msg.sender, amount);

        uint256 amountAfterUndelegate = delegatedAmount - amount;

        if (amountAfterUndelegate < minDelegation && amountAfterUndelegate != 0)
            revert StakeRequirement({src: "undelegate", msg: "DELEGATION_TOO_LOW"});

        claimDelegatorReward(provider, false);

        int256 amountInt = amount.toInt256Safe();

        _queue.insert(provider, 0, amountInt * -1);
        // delegation.amount -= amount;

        _registerWithdrawal(msg.sender, amount);
        emit Undelegated(msg.sender, provider, amount);
    }

    /**
     * @inheritdoc IHPSDelegation
     */
    function claimDelegatorReward(address provider, bool restake) public {
        RewardPool storage pool = _providers.getDelegationPool(provider);
        uint256 reward = pool.claimRewards(msg.sender);
        if (reward == 0) return;

        if (restake) {
            _delegate(msg.sender, provider, reward);
        } else {
            _registerWithdrawal(msg.sender, reward);
        }

        emit DelegatorRewardClaimed(msg.sender, provider, restake, reward);
    }

    /**
     * @inheritdoc IHPSDelegation
     */
    function delegationOf(address provider, address delegator) external view returns (uint256) {
        return _providers.getDelegationPool(provider).balanceOf(delegator);
    }

    /**
     * @inheritdoc IHPSDelegation
     */
    function getDelegatorReward(address provider, address delegator) external view returns (uint256) {
        return _providers.getDelegationPool(provider).claimableRewards(delegator);
    }

    function _delegate(address delegator, address provider, uint256 amount) private {
        if (!getProvider(provider).active) revert Unauthorized("INVALID_VALIDATOR");
        _queue.insert(provider, 0, amount.toInt256Safe());
        _providers.getDelegationPool(provider).deposit(delegator, amount);
        // delegations[delegator][provider].amount += amount;
        emit Delegated(delegator, provider, amount);
    }

    function _distributeDelegatorReward(address provider, uint256 reward) internal {
        _providers.getDelegationPool(provider).distributeReward(reward);
        emit DelegatorRewardDistributed(provider, reward);
    }
}
