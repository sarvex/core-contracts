// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../../interfaces/modules/IHPSStorage.sol";
import "../../interfaces/IBLS.sol";
import "../../interfaces/IProviderQueue.sol";
import "../../interfaces/IWithdrawalQueue.sol";

import "../../libs/ProviderStorage.sol";

abstract contract HPSStorage is IHPSStorage {
    using ProviderStorageLib for ProviderTree;

    bytes32 public constant NEW_VALIDATOR_SIG = 0xbddc396dfed8423aa810557cfed0b5b9e7b7516dac77d0b0cdf3cfbca88518bc;
    uint256 public constant ACTIVE_PROVIDER_SET_SIZE = 100; // TODO: no no!
    uint256 public constant MAX_PROVIDER_SET_SIZE = 500; // TODO: no max?
    uint256 public constant REWARD_PRECISION = 10 ** 18;
    uint256 public constant WITHDRAWAL_WAIT_PERIOD = 1;
    // more granular commission?
    uint256 public constant MAX_COMMISSION = 100;

    uint256 public epochSize;
    uint256 public currentEpochId;
    uint256[] public epochEndBlocks;
    uint256 public epochReward;
    uint256 public minStake;
    uint256 public minDelegation;

    IBLS public bls;

    /// @notice Message to sign for registration
    uint256[2] public message;

    // slither-disable-next-line naming-convention
    ProviderTree internal _providers;
    // slither-disable-next-line naming-convention
    ProviderQueue internal _queue;
    // slither-disable-next-line naming-convention
    mapping(address => WithdrawalQueue) internal _withdrawals;

    mapping(uint256 => Epoch) public epochs;
    mapping(address => bool) public whitelist;

    // slither-disable-next-line unused-state,naming-convention
    uint256[50] private __gap;

    /**
     * @inheritdoc IHPSStorage
     */
    function getProvider(address provider) public view returns (Provider memory) {
        return _providers.get(provider);
    }
}
