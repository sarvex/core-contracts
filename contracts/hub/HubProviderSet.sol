// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../interfaces/IHubProviderSetBase.sol";
import "./modules/HPSStorage.sol";
import "./modules/HPSWithdrawal.sol";
import "./modules/HPSStaking.sol";
import "./modules/HPSDelegation.sol";

import "../libs/SafeMathInt.sol";
import "@openzeppelin/contracts-upgradeable/utils/ArraysUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "./IChildProxy.sol";

contract HubProviderSet is
    IHubProviderSetBase,
    HPSStorage,
    HPSWithdrawal,
    HPSStaking,
    HPSDelegation,
    Ownable2StepUpgradeable
{
    using ProviderStorageLib for ProviderTree;
    using ProviderQueueLib for ProviderQueue;
    using WithdrawalQueueLib for WithdrawalQueue;
    using RewardPoolLib for RewardPool;
    using SafeMathInt for int256;
    using ArraysUpgradeable for uint256[];

    function initialize(
        InitStruct calldata init,
        address[] calldata providerAddresses,
        uint256[4][] calldata providerPubkeys,
        uint256[] calldata providerStakes,
        IBLS newBls,
        uint256[2] calldata newMessage,
        address governance
    ) external initializer {
        currentEpochId = 1;
        epochSize = init.epochSize;
        _transferOwnership(governance);
        __ReentrancyGuard_init();

        // slither-disable-next-line events-maths
        epochReward = init.epochReward;
        minStake = init.minStake;
        minDelegation = init.minDelegation;

        for (uint256 i = 0; i < providerAddresses.length; i++) {
            // _addToWhitelist(validatorAddresses[i]);
            Provider memory provider;
            provider.blsKey = providerPubkeys[i];
            provider.stake = providerStakes[i];
            provider.totalStake = providerStakes[i];
            provider.active = true;
            _providers.insert(providerAddresses[i], provider);
        }
        bls = newBls;
        message = newMessage;
    }

    function subscribed(address providerAddr, address childAddr) public view returns (bool) {
        Provider memory provider = _providers.get(providerAddr);
        if (provider.subscribed.length == 0) {
            return false;
        }
        for (uint i = 0; i < provider.subscribed.length; i++) {
            if (provider.subscribed[i] == childAddr) {
                return true;
            }
        }
        return false;
    }

    // called by provider to subscribe to child chain through proxy contract
    function subscribe(address child) external onlyProvider {
        IChildProxy proxy = IChildProxy(child);
        require(proxy.canSubscribe(msg.sender), "provider not authorized to subscribe");
        require(!subscribed(msg.sender, child), "provider is already subscribed");
        _providers.get(msg.sender).subscribed.push(child);
        proxy.subscribe(msg.sender);
    }

    /**
     * @inheritdoc IHubProviderSetBase
     */
    function getCurrentProviderSet() external view returns (address[] memory) {
        return sortedProviders(ACTIVE_PROVIDER_SET_SIZE);
    }

    /**
     * @inheritdoc IHubProviderSetBase
     */
    function getEpochByBlock(uint256 blockNumber) external view returns (Epoch memory) {
        uint256 ret = epochEndBlocks.findUpperBound(blockNumber);
        return epochs[ret + 1];
    }

    /**
     * @inheritdoc IHubProviderSetBase
     */
    function totalActiveStake() public view returns (uint256 activeStake) {
        uint256 length = ACTIVE_PROVIDER_SET_SIZE <= _providers.count ? ACTIVE_PROVIDER_SET_SIZE : _providers.count;
        if (length == 0) return 0;

        address tmpProvider = _providers.last();
        activeStake += getProvider(tmpProvider).stake + _providers.getDelegationPool(tmpProvider).supply;

        for (uint256 i = 1; i < length; i++) {
            tmpProvider = _providers.prev(tmpProvider);
            activeStake += getProvider(tmpProvider).stake + _providers.getDelegationPool(tmpProvider).supply;
        }
    }
}
