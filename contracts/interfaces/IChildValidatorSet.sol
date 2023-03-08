// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./modules/ICVSAccessControl.sol";
import "./modules/ICVSDelegation.sol";
import "./modules/ICVSStaking.sol";
import "./modules/ICVSStorage.sol";
import "./modules/ICVSWithdrawal.sol";
import "./IChildValidatorSetBase.sol";

// solhint-disable-next-line no-empty-blocks
interface IChildValidatorSet is
    ICVSAccessControl,
    ICVSDelegation,
    ICVSStaking,
    ICVSStorage,
    ICVSWithdrawal,
    IChildValidatorSetBase
{

}
