// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "./IChildProxy.sol";
import "../root/StateSender.sol";
import "../interfaces/IProvider.sol";
import "../interfaces/modules/IHPSStorage.sol";
import "../interfaces/IValidator.sol";

contract POCChildProxy is IChildProxy, Ownable2StepUpgradeable {
    address public childCheckpointManager;
    address public childStateSender;

    address public hub;

    function initialize(
        address hub,
        address childCheckpointManager,
        address childStateSender,
        address governance
    ) external initializer {
        _transferOwnership(governance);
        childCheckpointManager = childCheckpointManager;
        childStateSender = childStateSender;
    }

    function canSubscribe(address provider) public view returns (bool) {
        return true; // TODO ???
    }

    function subscribe(address provider) external {
        // TODO: should only be called from the hub ...?
        require(canSubscribe(provider), "cannot subscribe");

        // TODO: *way* too simplistic ...
        Provider memory p = IHPSStorage(hub).getProvider(provider); // TODO: error / not exist?
        Validator memory v = Validator({
            blsKey: p.blsKey, // TODO: likely want different BLS key per child chain
            stake: p.stake,
            totalStake: p.totalStake,
            commission: p.commission,
            withdrawableRewards: 0,
            active: true
        });

        bytes memory b = abi.encode(v);
        StateSender sender = StateSender(childStateSender);
        // 	ValidatorSetContract = types.StringToAddress("0x101")
        // TODO: send state straight to child validator set contract?
        sender.syncState(address(0x101), b);
        return;
    }
}
