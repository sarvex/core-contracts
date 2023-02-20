// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./IRewardPool.sol";

/**
 * @title IProvider
 * @author Polygon Technology (Daniel Gretzke @gretzke)
 * @dev even though the natspec on the structs is not output,
 *  it is included for clarity
 */

/**
 * @notice data type representing a validator
 * @param blsKey the public BLS key of the validator
 * @param stake amount staked by the validator
 * @param totalStake amount staked by self + amount delegated to
 * @param commission percent of validator's personal reward distributed to delegators
 * @param withdrawableRewards amount that can be withdrawn from
 * @param active if this validator is actively proposing/attesting
 */
struct Provider {
    uint256[4] blsKey; // TODO: probably should not be here ...
    uint256 stake;
    uint256 totalStake;
    uint256 commission;
    uint256 withdrawableRewards;
    bool active;
    // TODO: nested mapping won't work here and my assumption is that no provider can ever validate on more than a few chains
    // TypeError: Types containing (nested) mappings can only be parameters or return variables of internal or library functions.
    address[] subscribed;
}

/**
 * @notice data type for nodes in the red-black validator tree
 * @param parent address of the parent of this node
 * @param left the node in the tree to the left of this one
 * @param right the node in the tree to the right of this one
 * @param red bool denoting color of node for balancing
 */
struct Node {
    address parent;
    address left;
    address right;
    bool red;
    Provider provider;
}

/**
 * @notice data type for the red-black validator tree
 * @param root
 * @param count amount of nodes in the tree
 * @param totalStake total amount staked by nodes of the tree
 * @param nodes address to node mapping
 * @param delegationPools validator RewardPools by validator address
 */
struct ProviderTree {
    address root;
    uint256 count;
    uint256 totalStake;
    mapping(address => Node) nodes;
    mapping(address => RewardPool) delegationPools;
}
