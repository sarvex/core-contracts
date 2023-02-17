// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * @notice data type representing provider in queue
 * @param provider the address of the provider
 * @param stake the amount staked by the provider
 * @param delegation the amount delegated to this provider
 */
struct QueuedProvider {
    address provider;
    int256 stake;
    int256 delegation;
}

/**
 * @notice data type for the management of the queue
 * @param indices position of a provider in the queue array
 * @param queue array of QueuedValidators
 */
struct ProviderQueue {
    mapping(address => uint256) indices;
    QueuedProvider[] queue;
}
