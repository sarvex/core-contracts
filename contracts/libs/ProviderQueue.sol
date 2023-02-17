// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../interfaces/IProviderQueue.sol";
import "../interfaces/IProvider.sol";

/**
 * @title Provider Queue Lib
 * @author Polygon Technology (Daniel Gretzke @gretzke)
 * @notice library to manage a queue of updates to block providers
 * including registering a new provider, adding to stake or unstaking,
 * delegation and undelegation
 * @dev queue is processed and cleared at the end of each epoch
 */
library ProviderQueueLib {
    /**
     * @notice queues a provider's data
     * @param self ProviderQueue struct
     * @param provider address of the provider
     * @param stake delta to the amount staked by provider (negative for unstaking)
     * @param delegation delta to the amount delegated to provider (negative for undelegating)
     */
    function insert(ProviderQueue storage self, address provider, int256 stake, int256 delegation) internal {
        uint256 index = self.indices[provider];
        if (index == 0) {
            // insert into queue
            // use index starting with 1, 0 is empty by default for easier checking of pending balances
            index = self.queue.length + 1;
            self.indices[provider] = index;
            self.queue.push(QueuedProvider(provider, stake, delegation));
        } else {
            // update values
            QueuedProvider storage queuedValidator = self.queue[indexOf(self, provider)];
            queuedValidator.stake += stake;
            queuedValidator.delegation += delegation;
        }
    }

    /**
     * @notice deletes data from a specific provider in the queue
     * @dev used in tandem with reset() to delete queue
     * @param self ProviderQueue struct
     * @param provider address of the provider to remove the queue data of
     */
    function resetIndex(ProviderQueue storage self, address provider) internal {
        self.indices[provider] = 0;
    }

    /**
     * @notice reinitializes the provider queue
     * @dev used in tandem with resetIndex() to delete queue
     * @param self ProviderQueue struct
     */
    function reset(ProviderQueue storage self) internal {
        delete self.queue;
    }

    /**
     * @notice returns the queue
     * @param self the ProviderQueue struct
     * @return QueuedValidator[]
     */
    function get(ProviderQueue storage self) internal view returns (QueuedProvider[] storage) {
        return self.queue;
    }

    /**
     * @notice returns if a specific provider is in the queue
     * @dev the queue starts from index 1 (not 0) to facilitate this
     * @param self the ProviderQueue struct
     * @param provider the address of the provider to check
     * @return bool indicating if the provider is in the queue (true) or not
     */
    function waiting(ProviderQueue storage self, address provider) internal view returns (bool) {
        return self.indices[provider] != 0;
    }

    /**
     * @notice convenience function to return the change to stake for a provider in the queue
     * @param self the ProviderQueue struct
     * @param provider the address of the provider to check the change to stake of
     * @return int256 change to stake of the provider
     */
    function pendingStake(ProviderQueue storage self, address provider) internal view returns (int256) {
        if (!waiting(self, provider)) return 0;
        return self.queue[indexOf(self, provider)].stake;
    }

    /**
     * @notice convenience function to return the change to funds delegated to a pending provider
     * @param self the ProviderQueue struct
     * @param provider the address of the provider to check the change to delegated funds of
     * @return int256 change to funds delegated to the provider
     */
    // slither-disable-next-line dead-code
    function pendingDelegation(ProviderQueue storage self, address provider) internal view returns (int256) {
        if (!waiting(self, provider)) return 0;
        return self.queue[indexOf(self, provider)].delegation;
    }

    /**
     * @notice returns index of a specific provider
     * @dev indexes returned from this function start from 0
     * @param self the ProviderQueue struct
     * @param provider address of the provider whose index is being queried
     * @return index the index of the provider in the queue
     */
    function indexOf(ProviderQueue storage self, address provider) private view returns (uint256 index) {
        index = self.indices[provider];
        assert(index != 0); // currently index == 0 is unreachable
        return index - 1;
    }
}
